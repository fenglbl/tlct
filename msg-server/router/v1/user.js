const express = require("express");
const md5 = require("md5");
const {
  pool,
  jwt,
  loadErr,
  getRandom,
  setPhone,
} = require("../../config/index");
const { arrOut, getUserInfo, getSign, isToken } = require("../function/index");

const router = express.Router();

router.post("/user/list", (req, res) => {
  let { uid, sign } = req.body;
  if (!sign) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  if (!uid) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  getSign(res, uid, sign);
  // 查询当前用户sign是否对应
  function getSign(res, uid, sign) {
    return new Promise((resolve, reject) => {
      let sql = "select id as uid,sign,userName from user where id = ?";
      pool.query(sql, uid, (err, relect) => {
        if (err) loadErr("login/islogin/user/sign", "mysql:select", err);
        if (relect && relect.length > 0) {
          let usign = relect[0].sign;
          let userName = relect[0].userName;
          if (sign == usign) {
            // 调用验证token函数
            isToken(res, userName);
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
  function isToken(res, userName) {
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
              data.userName = userName;
              getFindList(res, data);
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
  // 获取find列表
  function getFindList(res, data) {
    let sql =
      "select id,title,icon,url,isRight,type,rightType,rightImage,rightText,rightBadgeNum,rightBadgeType,rightTextStyle from findList where page = 3";
    pool.query(sql, (err, relect) => {
      if (err) loadErr("login/islogin/token", "mysql:select", err);
      if (relect && relect.length > 0) {
        let typeArr = arrOut(relect, "type");
        let maxType = Math.max(...typeArr);
        let find = [];
        for (let i = 0; i <= maxType; i++) {
          let arr = [];
          relect.map((item) => {
            if (item.type == i) {
              item.rightBadgeNum = item.rightBadgeNum.toString();
              arr.push(item);
            }
          });
          find.push(arr);
        }
        res.send({ code: 0, msg: "成功", data, findList: find });
      } else {
        res.send({ code: 415, msg: "我的页面列表为空", data });
      }
    });
  }
});

router.post("/user/info", (req, res) => {
  let { uid, sign, flid, type } = req.body;
  if (!sign) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  if (!uid) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  if (!type) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  if (!flid) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  getSign(res, uid, sign).then((rel) => {
    // 调用验证token函数
    let { userName, sign } = rel;
    isToken(res, userName, sign).then((data) => {
      if (data.code) {
        getUserInfo(res, { uid: flid, type }).then((result) => {
          res.send({ code: 0, data: result });
        });
      }
    });
  });
});
module.exports = router;
