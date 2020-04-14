const express = require("express");
const md5 = require("md5");
const {
  pool,
  jwt,
  loadErr,
  getRandom,
  setPhone,
} = require("../../config/index");
const { getSign, getMsgs, isToken, getUser } = require("../function/index");

const router = express.Router();

router.post("/getMsgs", (req, res) => {
  let { uid, recid, sign, type } = req.body;
  console.log(req.body);
  if (!sign) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  if (!uid) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  if (!recid) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  if (!type) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  getSign(res, uid, sign).then((rel) => {
    // 调用验证token函数
    let { userName, sign } = rel;
    isToken(res, userName, sign).then((result) => {
      if (result.code) {
        getUser(res, uid, recid).then((userData) => {
          getMsgs(res, { uid, sendid: recid, type }, userData);
        });
      }
    });
  });
});

module.exports = router;
