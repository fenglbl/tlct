// 引入模块
const express = require("express");
const body = require("body-parser");
const cors = require("cors");
// 引入配置
// const { pool, jwt, loadErr } = require("./config/index");

// 引入路由
const login = require("./router/v1/login");
const protocol = require("./router/v1/protocol");
const auth = require("./router/v1/auth");
const reg = require("./router/v1/reg");
const findList = require("./router/v1/findList");
const user = require("./router/v1/user");
const chat = require("./router/v1/chat");
const getMsgList = require("./router/v1/msgList");
const friend = require("./router/v1/friend");

// 测试
const test = require("./router/v1/test");

// 创建服务对象
const app = express();
app.listen(83, "0.0.0.0");
app.use(body.json());
app.use(body.urlencoded());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// 设置路由
app.use("/v1", login);
app.use("/v1", protocol);
app.use("/v1", auth);
app.use("/v1", reg);
app.use("/v1", findList);
app.use("/v1", user);
app.use("/v1", chat);
app.use("/v1", getMsgList);
app.use("/v1", friend);

app.use("/v1", test);

// 静态目录挂载
app.use("/", express.static(__dirname + "/www"));
