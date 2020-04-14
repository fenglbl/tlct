const { pool, loadErr, aes } = require("../config/index");
const md5 = require("md5");
const wsFun = require("./config/index");

const ws = require("nodejs-websocket");
const server = ws.createServer((app) => {
  app.on("text", (data) => {
    try {
      data = aes.decryp(data);
    } catch (error) {
      errMsg(app, 100, "消息解析错误");
    }
    let msg = JSON.parse(data);
    let key = app.key;
    if (msg.code == 200) {
      // 收到用户的握手包及用户信息
      wsFun.setUserKey(app, msg.user);
    } else if (msg.code == 1) {
      // 收到用户信息
      wsFun.onMsg(app, msg);
    } else {
      // 消息异常
      wsFun.errMsg(app, 221, "消息异常");
    }
  });
  // 连接关闭
  app.on("close", (code) => {
    console.log("关闭连接", code);
  });
  app.on("error", (code) => {
    // 某些情况如果客户端多次触发连接关闭，会导致connection.close()出现异常，这里try/catch一下
    try {
      console.log(44);
      // app.close();
    } catch (error) {
      loadErr("ws/close/关闭异常", "ws:close:" + code, error);
    }
  });
});

server.on("connection", (con) => {
  let key = con.key;
  wsFun.conArr[key] = {};
  wsFun.conArr[key].con = con;
  wsFun.conArr[key].user = {};
  // 发送连接成功握手包
  let msg = { code: 200, msg: "连接成功", user: wsFun.conArr[key].user, key };
  msg = aes.encryp(JSON.stringify(msg));
  con.sendText(msg);
});

server.listen(84, () => {
  console.log("ws://192.168.0.109:84");
});
