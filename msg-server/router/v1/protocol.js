// 获取用户协议，隐私政治，版权声明
const express = require("express");
const { pool, jwt, loadErr } = require("../../config/index");

const router = express.Router();
router.get("/protocol", (req, res) => {
  let id = req.query.id;
  if (!id) {
    res.send({ code: 401, msg: "参数不正确" });
    return;
  }
  let sql = `select id,name,content from protocol where id = ?`;
  pool.query(sql, id, (err, relect) => {
    if (err) loadErr("protocol", "mysql", err);
    if (relect && relect.length > 0) {
      res.send({ code: 0, msg: "成功", data: relect[0] });
    }
  });
});

module.exports = router;
