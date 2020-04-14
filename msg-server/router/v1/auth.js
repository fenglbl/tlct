// 验证码
const express = require("express");
const md5 = require("md5");
const {
  pool,
  jwt,
  loadErr,
  getRandom,
  setPhone,
} = require("../../config/index");
const { getCityIp, addLogin } = require("../function/index");
const router = express.Router();
// 获取验证码
router.post("/auth/get", (req, res) => {
  let { phone, type } = req.body;
  const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/gi;
  if (!reg.test(phone)) {
    res.send({ code: 402, msg: "手机号格式不正确" });
    return;
  }
  if (type != "login" && type != "reg") {
    // console.log(req.body);
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  let auth = getRandom(4);
  let authContent = `【TLCT】尊敬的用户您好，您的验证码是：${auth}，请在30分钟内使用！`;
  let time = new Date().getTime();

  new Promise((resolve, reject) => {
    let sql = "INSERT INTO auth VALUES (NULL, ?, ?, ?, ?, ?)";
    pool.query(sql, [phone, auth, time, authContent, type], (err, relect) => {
      if (err) loadErr("auth/get", "mysql", err);
      if (relect && relect.affectedRows > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }).then((result) => {
    if (result) {
      // 正式环境下这里请求短信发送平台的服务器
      res.send({ code: 0, msg: "成功", data: authContent, auth }); //正式环境下没有data
    } else {
      res.send({ code: 403, msg: "验证码获取失败" });
    }
  });
});
// 验证码登录
router.post("/auth", (req, res) => {
  let { auth, phone, type } = req.body;
  const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/gi;
  if (!auth || auth.length != 4) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  if (!reg.test(phone)) {
    res.send({ code: 402, msg: "手机号格式不正确" });
    return;
  }
  if (type != "login" && type != "reg") {
    console.log(req.body);
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  new Promise((resolve, reject) => {
    let sql = "select id,time from auth where auth = ? and phone = ?";
    pool.query(sql, [auth, phone], (err, relect) => {
      if (err) loadErr("auth", "mysql", err);
      if (relect && relect.length > 0) {
        let time = relect[0].time;
        let newTime = new Date().getTime();
        if (newTime - 1800000 > parseInt(time)) {
          resolve({ code: false, msg: "验证码超时" });
        } else {
          resolve({ code: true });
        }
      } else {
        resolve({ code: false, msg: "验证码不正确" });
      }
    });
  }).then((result) => {
    if (result.code) {
      // 验证码一致
      if (type == "reg") {
        res.send({ code: 300, msg: "接口无效" });
      } else {
        let sql =
          "select id as uid,user,avatar,gender,phone from user where phone = ?";
        pool.query(sql, phone, (err, relect) => {
          if (err) loadErr("auth/user", "mysql", err);
          if (relect && relect.length > 0) {
            // 用户存在，登录并生成token
            login(res, relect[0], req);
          } else {
            register(res, { auth, phone, type });
            // 用户不存在，简易注册并生成token
          }
        });
      }
    } else {
      // 验证码失败
      if (result.msg == "验证码超时") {
        // 验证码失效
        res.send({ code: 406, msg: "验证码已失效，请重新获取" });
      } else {
        // 验证码不正确
        res.send({ code: 404, msg: "验证码不正确" });
      }
    }
  });
});
// 用户存在，登录
function login(res, uData, req) {
  let loginTime = new Date().getTime();
  let { user, phone, uid } = uData;
  jwt.sign({ user, phone, uid }).then((jwtToken) => {
    if (jwtToken.code == 0) {
      let token = jwtToken.token;
      let sign = md5(token);
      setLoginData(uid, sign, loginTime).then((result) => {
        if (result) {
          insertToken(token, uid, loginTime, sign).then((relt) => {
            if (relt) {
              let data = uData;
              data.sign = sign;
              data.phone = setPhone(data.phone);
              console.log(data);
              // 获取，并修改登录位置ip
              getCityIp(req, res, uid);
              // 将登录记录加到数据库
              addLogin(req, res, uid);
              res.send({ code: 0, msg: "登录成功", data });
            } else {
              res.send({ code: 410, msg: "登录失败，请重试" });
            }
          });
        } else {
          res.send({ code: 410, msg: "登录失败，请重试" });
        }
      });
    } else {
      res.send({ code: 409, msg: "登录失败，token异常，请重试" });
    }
  });

  // 修改user表中登录信息函数
  function setLoginData(uid, sign, loginTime) {
    return new Promise((resolve, reject) => {
      let sql = "UPDATE user SET loginTime = ? , sign = ? WHERE id = ?";
      pool.query(sql, [loginTime, sign, uid], (err, relect) => {
        if (err) loadErr("auth/login", "mysql:UPDATE", err);
        if (relect && relect.affectedRows > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
  // token列表插入token
  function insertToken(token, uid, loginTime, sign) {
    return new Promise((resolve, reject) => {
      let sql = "INSERT INTO token VALUES (NULL, ?, ?, ?, ?);";
      pool.query(sql, [token, uid, loginTime, sign], (err, relect) => {
        if (err) loadErr("auth/login/token", "mysql:INSERT", err);
        if (relect && relect.affectedRows > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}
// 用户不存在，注册
function register(res, req) {
  let { auth, phone, type } = req;
  // 取随机9位用户名(4位随机大写字母+5位数字)
  let user = getRandom(4, false, true) + getRandom(5);
  let pwd = getRandom(12, true, true, true);
  let avatar = "https://picsum.photos/400/400";
  let regTime = new Date().getTime();
  let userName = "TLCT用户" + getRandom(5);
  new Promise((resolve, reject) => {
    let sql = `INSERT INTO user VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    pool.query(
      sql,
      [
        user,
        pwd,
        avatar,
        0,
        "",
        regTime,
        "",
        phone,
        "",
        userName,
        "",
        "",
        "",
        "",
        "",
        "", //city
        "", //ip
      ],
      (err, relect) => {
        if (err) loadErr("auth/reg", "mysql:insert", err);
        if (relect && relect.affectedRows > 0) {
          // 注册成功，登录用户
          resolve({ user, avatar, gender: 0, phone });
        } else {
          resolve(false);
        }
      }
    );
  }).then((result) => {
    if (result) {
      let sql = "select id as uid from user where phone = ? and user = ?";
      pool.query(sql, [phone, user], (err, relect) => {
        if (err) loadErr("auth/reg/get/uid", "mysql:select", err);
        if (relect && relect.length > 0) {
          result.uid = relect[0].uid;
          login(res, result);
        } else {
          res.send({ code: 408, msg: "注册成功，登录失败，请重试" });
        }
      });
    } else {
      res.send({ code: 407, msg: "注册失败" });
    }
  });
}
module.exports = router;
