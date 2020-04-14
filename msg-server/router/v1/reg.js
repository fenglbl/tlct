const express = require("express");
const md5 = require("md5");
const {
  pool,
  jwt,
  loadErr,
  getRandom,
  setPhone,
} = require("../../config/index");

const router = express.Router();
// 注册路由api
router.post("/register", (req, res) => {
  let { user, phone, auth, pwd, upwd } = req.body;
  let userReg = /^[A-Za-z0-9]{8,16}$/gi; //8到16位任意字符
  let phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/gi; //11位手机号
  let pwdReg = /^[\u4E00-\u9FA5A-Za-z0-9]{8,64}$/gi; //8到64位任意字符
  if (!user || !userReg.test(user)) {
    res.send({ code: 301, msg: "用户名格式不正确，请输入8-16位字母或数字" });
    return;
  }
  if (!phone || !phoneReg.test(phone)) {
    res.send({ code: 302, msg: "手机号格式不正确" });
    return;
  }
  if (!pwd || !pwdReg.test(pwd)) {
    res.send({ code: 303, msg: "密码格式不正确，请输入8-64位字符" });
    return;
  }
  if (!upwd || pwd !== upwd) {
    res.send({ code: 304, msg: "两次密码不一致" });
    return;
  }
  if (!auth) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  new Promise((resolve, reject) => {
    let sql = "select id,time from auth where auth = ? and phone = ?";
    pool.query(sql, [auth, phone], (err, relect) => {
      if (err) loadErr("register/auth", "mysql:select", err);
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
      register(res, req.body);
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
// 验证手机号重复api
router.post("/register/phone", (req, res) => {
  let phone = req.body.phone;
  let phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/gi; //11位手机号
  if (!phone || !phoneReg.test(phone)) {
    res.send({ code: 302, msg: "手机号格式不正确" });
    return;
  }
  let sql = "select id from user where phone = ?";
  pool.query(sql, phone, (err, relect) => {
    if (err) loadErr("register/auth/phone", "mysql:select", err);
    if (relect && relect.length > 0) {
      res.send({ code: 305, msg: "手机号已存在" });
    } else {
      res.send({ code: 0, msg: "可以注册" });
    }
  });
});
// 验证用户名重复api
router.post("/register/user", (req, res) => {
  let user = req.body.user;
  let userReg = /^[A-Za-z0-9]{8,16}$/gi; //8到16位任意字符
  if (!user || !userReg.test(user)) {
    res.send({ code: 301, msg: "用户名格式不正确，请输入8-16位字母或数字" });
    return;
  }
  let sql = "select id from user where user = ?";
  pool.query(sql, user, (err, relect) => {
    if (err) loadErr("register/auth/user", "mysql:select", err);
    if (relect && relect.length > 0) {
      res.send({ code: 306, msg: "用户名已存在" });
    } else {
      res.send({ code: 0, msg: "可以注册" });
    }
  });
});
// 注册函数
function register(res, req) {
  let { user, phone, auth, pwd } = req;
  // 取随机9位用户名(4位随机大写字母+5位数字)
  // let user = getRandom(4, false, true) + getRandom(5);
  // let pwd = getRandom(12, true, true, true);
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
        if (err) loadErr("register/reg", "mysql:insert", err);
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
          getCityIp(req, res, uid);
          res.send({ code: 0, msg: "注册成功", data: result });
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
