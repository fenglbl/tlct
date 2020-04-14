const { pool, loadErr, aes } = require("../../config/index");
const fun = {
  // 保存连接设备的对象
  conArr: {},
  // 将key保存到数据库
  setUserKey(app, user) {
    new Promise((resolve, reject) => {
      let sql =
        "select id as uid,user,avatar,gender,userName,`key`,sign from user where id = ?";
      pool.query(sql, user.uid, (err, relect) => {
        if (err) loadErr("ws/userInfo/get", "mysql:select", err);
        if (relect && relect.length > 0) {
          let sign = relect[0].sign;
          if (sign == user.sign) {
            resolve(relect[0]);
          } else {
            this.errMsg(app, 412, "登录过期，请重新登录");
          }
        } else {
          this.errMsg(app, 405, "用户不存在");
        }
      });
    }).then((res) => {
      let sql = "UPDATE user SET `key` = ? WHERE id = ?";
      pool.query(sql, [user.key, res.uid], (err, relect) => {
        if (err) loadErr("ws/userInfo/key", "mysql:UPDATE", err);
        if (relect && relect.affectedRows > 0) {
        } else {
          this.errMsg(app, 101, "连接错误");
        }
      });
    });
  },
  // 错误信息发送
  errMsg(app, code, msg, msgSign) {
    let sendMsg = { code, msg, msgSign };
    sendMsg = JSON.stringify(sendMsg);
    sendMsg = aes.encryp(sendMsg);
    app.sendText(sendMsg);
  },
  // 收到用户正常的通讯消息
  onMsg(app, msg) {
    let data = msg.data;
    let { uid, recid, type, time, msgSign } = data;
    let content = data.msg;
    let recTime = new Date().getTime();
    let sql = "INSERT INTO msg VALUES (NULL, ?, ?, ?, ?, ?, ?, ?);";
    pool.query(
      sql,
      [uid, recid, type, content, time, recTime, msgSign],
      (err, relect) => {
        if (err) loadErr("ws/recMsg/1", "mysql:INSERT", err);
        if (relect && relect.affectedRows > 0) {
          /**
           * 这里进行消息转发和其他操作
           */
          // 回馈消息发送结果

          this.getUser(app, uid, recid, msgSign).then((userInfo) => {
            let sendMsg = {
              code: 2,
              msg: "发送成功",
              msgSign,
              userInfo,
            };
            if (msg.data.type == 1) {
              // 好友消息
              this.sendUser({ msg: msg.data, userInfo, key: msg.key });
            } else if (msg.data.type == 2) {
              // 群消息
              this.sendAll(msg.data, userInfo, msg.key);
            }
            // console.log(sendMsg);
            sendMsg = JSON.stringify(sendMsg);
            sendMsg = aes.encryp(sendMsg);
            app.sendText(sendMsg);
          });
        } else {
          this.errMsg(app, 100, "消息错误", msgSign);
        }
      }
    );
  },
  // 获取用户信息
  getUser(app, uid, recid, msgSign) {
    return new Promise((rel, rjt) => {
      Promise.all([
        new Promise((resolve, reject) => {
          let sql =
            "select id as uid,user,avatar,gender,userName,`key` from user where id = ?";
          pool.query(sql, uid, (err, relect) => {
            if (err) loadErr("ws/userInfo/get", "mysql:select", err);
            if (relect && relect.length > 0) {
              resolve(relect[0]);
            } else {
              this.errMsg(app, 100, "消息错误", msgSign);
            }
          });
        }),
        new Promise((resolve, reject) => {
          let sql =
            "select id as uid,user,avatar,gender,userName,`key` from user where id = ?";
          pool.query(sql, recid, (err, relect) => {
            if (err) loadErr("ws/userInfo/get", "mysql:select", err);
            if (relect && relect.length > 0) {
              resolve(relect[0]);
            } else {
              this.errMsg(app, 100, "消息错误", msgSign);
            }
          });
        }),
      ]).then((res) => {
        let [user, recUser] = res;
        rel({ user, recUser });
      });
    });
  },
  // 消息广播
  sendAll(msg, userInfo, key) {
    msg.userInfo = userInfo;
    let content = { code: 1, msg };
    for (let con in this.conArr) {
      if (this.conArr[con].con.key != key) {
        content = JSON.stringify(content);
        content = aes.encryp(content);
        this.conArr[con].con.sendText(content);
      }
    }
  },
  // 一对一消息
  sendUser(data) {
    let { msg, userInfo, key } = data;
    console.log(this.conArr[userInfo.recUser.key]);
    if (this.conArr[userInfo.recUser.key]) {
      let content = { code: 1, msg };
      content = JSON.stringify(content);
      content = aes.encryp(content);
      this.conArr[userInfo.recUser.key].con.sendText(content);
    }
  },
};

module.exports = fun;
