const express = require("express");
const md5 = require("md5");
const request = require("request");
const {
  pool,
  jwt,
  loadErr,
  getRandom,
  setPhone,
} = require("../../config/index");
const { getCityIp } = require("../function/index");
const wsConfig = require("../../ws/config/index");
// console.log(wsConfig);
const router = express.Router();

router.post("/getOnLine", (req, res) => {
  res.send({ code: 0, data: wsConfig.conArr });
});

router.get("/url", (req, res) => {
  // request.get(
  //   "https://pay.onespay.cn/submit/qqpay/qqpay.php?trade_no=2020041212482531686&sitename=5aO555CJ5piT5pSv5LuY",
  //   (error, response, body) => {
  //     res.send({ code: 0, error, response, body });
  //   }
  // );
  let url =
    "https://pay.onespay.cn/submit/qqpay/qqpay.php?trade_no=2020041212482531686&sitename=5aO555CJ5piT5pSv5LuY";
  request(
    {
      url,
    },
    function (error, response, body) {
      res.send({ code: 0, error, response, body });
    }
  );
});

router.get("/getIPcity", (req, res) => {
  getCityIp(req, res).then((data) => {
    res.send({ code: 0, data });
  });
});
module.exports = router;
/*
function setCookie(name, value) {
  var exp = new Date();
  exp.setTime(exp.getTime() + 60 * 60 * 1000);
  return (
    name +
    "=" +
    escape(value).replace(/\+/g, "%2B") +
    ";expires=" +
    exp.toGMTString() +
    ";path=/"
  );
}
function getCookie(name) {
  var arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
  else return null;
}
var sec_defend_time = getCookie("sec_defend_time") || 0;
sec_defend_time++;
setCookie(
  "sec_defend",
  !+[] +
    !![] +
    !![] +
    !![] +
    !![] +
    !![] +
    !![] +
    !![] +
    !![] +
    [] +
    (+{} + [])[+!![]] +
    (!+[] + !![] + !![] + !![] + !![] + []) +
    ([][[]] + [])[!+[] + !![]] +
    (![] + [])[+[]] +
    (!+[] + !![] + !![] + !![] + !![] + !![] + !![] + !![] + !![] + []) +
    (!+[] + !![] + !![] + !![] + []) +
    (!+[] + !![] + !![] + !![] + !![] + !![] + !![] + !![] + []) +
    (!+[] + !![] + !![] + !![] + !![] + !![] + !![] + []) +
    (!+[] + !![] + []) +
    ([][[]] + [])[!+[] + !![]] +
    (!+[] + !![] + !![] + !![] + !![] + []) +
    ([][[]] + [])[!+[] + !![] + !![]] +
    (!+[] + !![] + !![] + []) +
    (!+[] + !![] + !![] + []) +
    ([] + {})[!+[] + !![]] +
    ([] + {})[!+[] + !![]] +
    (+[] + []) +
    (!+[] + !![] + !![] + !![] + !![] + []) +
    (!+[] + !![] + !![] + !![] + !![] + []) +
    (!+[] + !![] + !![] + !![] + !![] + !![] + []) +
    (!+[] + !![] + []) +
    (+[] + []) +
    (!+[] + !![] + !![] + !![] + !![] + !![] + !![] + !![] + []) +
    (+!![] + []) +
    ([] + {})[!+[] + !![] + !![] + !![] + !![]] +
    (!+[] + !![] + !![] + []) +
    (![] + [])[+[]] +
    ([] + {})[!+[] + !![] + !![] + !![] + !![]] +
    ([] + {})[!+[] + !![]] +
    ([] + {})[!+[] + !![] + !![] + !![] + !![]] +
    (+!![] + []) +
    (+!![] + []) +
    (+{} + [])[+!![]] +
    (+{} + [])[+!![]] +
    (+{} + [])[+!![]] +
    (![] + [])[+[]] +
    ([][[]] + [])[!+[] + !![]] +
    (!+[] + !![] + []) +
    (!+[] + !![] + !![] + !![] + []) +
    (!+[] + !![] + !![] + !![] + !![] + !![] + !![] + !![] + []) +
    (!+[] + !![] + !![] + []) +
    ([] + {})[!+[] + !![]] +
    (+{} + [])[+!![]] +
    (!+[] + !![] + !![] + !![] + !![] + !![] + !![] + []) +
    (![] + [])[+[]] +
    (!+[] + !![] + !![] + !![] + !![] + !![] + !![] + []) +
    (!+[] + !![] + []) +
    (!+[] + !![] + !![] + !![] + !![] + !![] + []) +
    (!+[] + !![] + !![] + !![] + !![] + !![] + !![] + !![] + !![] + []) +
    (!+[] + !![] + !![] + !![] + !![] + !![] + []) +
    ([] + {})[!+[] + !![] + !![] + !![] + !![]] +
    ([][[]] + [])[!+[] + !![]] +
    ([][[]] + [])[!+[] + !![] + !![]] +
    (!+[] + !![] + !![] + !![] + !![] + !![] + !![] + !![] + !![] + []) +
    (!+[] + !![] + !![] + !![] + !![] + !![] + !![] + !![] + !![] + []) +
    (+{} + [])[+!![]] +
    (!+[] + !![] + !![] + !![] + !![] + !![] + !![] + !![] + []) +
    ([] + {})[!+[] + !![]] +
    (!+[] + !![] + !![] + !![] + !![] + !![] + []) +
    (!+[] + !![] + []) +
    (+[] + []) +
    (!+[] + !![] + !![] + []) +
    (+!![] + [])
);
setCookie("sec_defend_time", sec_defend_time);
*/
