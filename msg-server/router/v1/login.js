const express = require("express");
const md5 = require("md5");
const {
  pool,
  jwt,
  loadErr,
  getRandom,
  setPhone,
} = require("../../config/index");
const { getSign, isToken, getCityIp, addLogin } = require("../function/index");

const router = express.Router();

// 验证用户是否登录
router.post("/login/isLogin", (req, res) => {
  let sign = req.body.sign;
  let uid = req.body.uid;
  if (!sign) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  if (!uid) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  getSign(uid, sign);
  // 查询当前用户sign是否对应
  function getSign(uid, sign) {
    return new Promise((resolve, reject) => {
      let sql = "select id as uid,sign,userName,avatar from user where id = ?";
      pool.query(sql, uid, (err, relect) => {
        if (err) loadErr("login/islogin/user/sign", "mysql:select", err);
        if (relect && relect.length > 0) {
          let usign = relect[0].sign;
          if (sign == usign) {
            // 调用验证token函数
            isToken(relect[0]);
          } else {
            res.send({
              code: 413,
              msg: "账号被挤出，请注意修改账号密码，防止账号被盗",
            });
          }
        } else {
          res.send({ code: 411, msg: "sign不存在，请重新登录-109" });
        }
      });
    });
  }

  // 根据sign查询token
  function isToken(userData) {
    return new Promise((resolve, reject) => {
      let sql = "select id,token,uid from token where sign = ?";
      pool.query(sql, sign, (err, relect) => {
        if (err) loadErr("login/islogin/token", "mysql:select", err);
        if (relect && relect.length > 0) {
          let { id, token, uid } = relect[0];
          // 验证token状态
          jwt.verify(token).then((result) => {
            if (result.code == 0) {
              let data = {};
              data.phone = result.data.phone;
              data.user = result.data.user;
              data.uid = result.data.uid;
              data.phone = setPhone(data.phone);
              data.userName = userData.userName;
              data.avatar = userData.avatar;
              getCityIp(req, res, uid);
              res.send({ code: 0, msg: "成功", data });
            } else {
              res.send({ code: 412, msg: "登录过期，请重新登录" });
            }
          });
        } else {
          res.send({ code: 411, msg: "sign不存在，请重新登录" });
        }
      });
    });
  }
});
// 账号密码登录
router.post("/login", (req, res) => {
  let { user, pwd } = req.body;
  new Promise((resolve, reject) => {
    let sql =
      "select id as uid,user,avatar,gender,phone from user where user = ? and pwd = ?";
    pool.query(sql, [user, pwd], (err, relect) => {
      if (err) loadErr("login/user/pwd", "mysql:select", err);
      if (relect && relect.length > 0) {
        // 用户存在，登录并生成token
        login(res, relect[0], req);
      } else {
        // 用户名登录失败，转手机号登录
        resolve(false);
      }
    });
  }).then((result) => {
    if (!result) {
      let sql =
        "select id as uid,user,avatar,gender,phone from user where phone = ? and pwd = ?";
      pool.query(sql, [user, pwd], (err, relect) => {
        if (err) loadErr("login/user/pwd", "mysql:select", err);
        if (relect && relect.length > 0) {
          // 用户存在，登录并生成token
          login(res, relect[0]);
        } else {
          // 账号或密码错误
          res.send({ code: 307, msg: "账号或密码错误" });
        }
      });
    }
  });
});

// 退出登录
/**
 * 删除用户token
 * 删除用户key
 */
router.post("/outLogin", (req, res) => {
  let { uid, sign } = req.body;
  if (!sign) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  if (!uid) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  getSign(res, uid, sign).then((rel) => {
    // 调用验证token函数
    let { userName, sign } = rel;
    isToken(res, userName, sign).then((data) => {
      if (data.code) {
        let sql = "UPDATE user SET `key` = '',sign=''  WHERE id = ?";
        pool.query(sql, uid, (err, relect) => {
          if (err) loadErr("login/outLogin", "mysql:UPDATE", err);
          if (relect && relect.affectedRows > 0) {
            res.send({ code: 0, msg: "成功" });
          } else {
            res.send({ code: 416, msg: "退出登录失败" });
          }
        });
      }
    });
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

module.exports = router;
