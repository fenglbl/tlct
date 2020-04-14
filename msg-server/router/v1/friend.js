const express = require("express");
const md5 = require("md5");
const {
  pool,
  jwt,
  loadErr,
  getRandom,
  setPhone,
} = require("../../config/index");
const {
  getSign,
  isToken,
  searchUser,
  getCityIp,
} = require("../function/index");

const router = express.Router();

router.post("/searchUser", (req, res) => {
  let { uid, sign, wd } = req.body;

  console.log(getCityIp(req, res));
  if (!sign) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  if (!uid) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  if (!wd) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }

  getSign(res, uid, sign).then((rel) => {
    // 调用验证token函数
    let { userName, sign } = rel;
    isToken(res, userName, sign).then((data) => {
      if (data.code) searchUser(res, { uid, sign }, wd);
    });
  });
});

module.exports = router;
