const express = require("express");
const md5 = require("md5");
const {
  pool,
  jwt,
  loadErr,
  getRandom,
  setPhone,
} = require("../../config/index");
const { getSign, isToken, getFindList } = require("../function/index");

const router = express.Router();

router.post("/findList", (req, res) => {
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
      if (data.code) getFindList(res, data.data);
    });
  });
});

module.exports = router;
