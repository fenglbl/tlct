const md5 = require("md5");
const request = require("request");
const {
  pool,
  jwt,
  loadErr,
  getRandom,
  setPhone,
} = require("../../config/index");
const _this = {
  // 数组平铺
  arrOut(arr, key) {
    let newArr = [];
    arr.map((item) => {
      newArr.push(item[key]);
    });
    return newArr;
  },
  // 查询当前用户sign是否对应
  getSign(res, uid, sign) {
    return new Promise((resolve, reject) => {
      let sql = "select id as uid,sign,userName from user where id = ?";
      pool.query(sql, uid, (err, relect) => {
        if (err) loadErr("login/islogin/user/sign", "mysql:select", err);
        if (relect && relect.length > 0) {
          let usign = relect[0].sign;
          let userName = relect[0].userName;
          if (sign == usign) {
            resolve({ userName, sign });
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
  },
  // 根据sign查询token
  isToken(res, userName, sign) {
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
              resolve({ code: true, data });
            } else {
              resolve({ code: false });
              res.send({ code: 412, msg: "登录过期，请重新登录" });
            }
          });
        } else {
          resolve({ code: false });
          res.send({ code: 411, msg: "sign不存在，请重新登录" });
        }
      });
    });
  },
  // 获取find列表
  getFindList(res, data) {
    let sql =
      "select id,title,icon,url,isRight,type,rightType,rightImage,rightText,rightBadgeNum,rightBadgeType,rightTextStyle from findList where page = 2";
    pool.query(sql, (err, relect) => {
      if (err) loadErr("login/islogin/token", "mysql:select", err);
      if (relect && relect.length > 0) {
        let typeArr = _this.arrOut(relect, "type");
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
        res.send({ code: 414, msg: "发现内容为空", data });
      }
    });
  },
  // 获取聊天历史记录
  getMsgs(res, uids, data) {
    let { uid, sendid, type } = uids;
    if (type == 1) {
      let sql =
        "SELECT id,uid,recid,type,msg,time,recTime,msgSign FROM msg WHERE recid = ? AND uid = ? AND type = ? ";
      pool.query(sql, [uid, sendid, type], (err, relect) => {
        if (err) loadErr("msg/getMsgs/list", "mysql:select", err);
        if (relect && relect.length > 0) {
          res.send({ code: 0, msg: "成功", data, msgs: relect });
        } else {
          res.send({ code: 415, msg: "消息内容为空", data });
        }
      });
    }
  },
  // 获取用户信息
  getUser(res, uid, recid) {
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
              res.send({ code: 417, msg: "获取信息失败" });
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
              res.send({ code: 417, msg: "获取信息失败" });
            }
          });
        }),
      ]).then((res) => {
        let [user, recUser] = res;
        rel({ user, recUser });
      });
    });
  },
  // 获取用户信息
  getUserInfo(res, info) {
    let { uid, fid, type } = info;
    return new Promise((resolve, reject) => {
      if (type == 1) {
        let sql =
          "select id as uid,user,avatar,gender,userName,`key`,city from user where id = ?";
        pool.query(sql, uid, (err, relect) => {
          if (err) loadErr("ws/userInfo/get", "mysql:select", err);
          if (relect && relect.length > 0) {
            resolve(relect[0]);
          } else {
            res.send({ code: 417, msg: "获取信息失败" });
          }
        });
      } else {
        let sql =
          "select id as fid,uid,owner,name,background,avatar,time from user where id = ?";
        pool.query(sql, fid, (err, relect) => {
          if (err) loadErr("ws/userInfo/get", "mysql:select", err);
          if (relect && relect.length > 0) {
            resolve(relect[0]);
          } else {
            res.send({ code: 417, msg: "获取信息失败" });
          }
        });
      }
    });
  },
  // 获取首页对话列表
  getMsgList(res, uid) {
    Promise.all([
      // 获取置顶列表
      new Promise((resolve, reject) => {
        let sql =
          "SELECT id,uid,flid,fid,type,shield,time,shieldTime,stick,stickTime,count,newMsg FROM msgList WHERE uid = ? AND stick = ? ORDER BY stickTime DESC";
        pool.query(sql, [uid, 1], (err, relect) => {
          if (err) loadErr("ws/msgList/get/stick", "mysql:select", err);
          let arr = [];
          relect = relect || [];
          relect.map((item) => {
            arr.push(
              new Promise((rel, rjt) => {
                _this
                  .getUserInfo(res, {
                    uid: item.flid,
                    fid: item.fid,
                    type: item.type,
                  })
                  .then((result) => {
                    item.userInfo = result;
                    _this
                      .getNewMsg(res, {
                        uid,
                        sendid: item.flid,
                        type: item.type,
                      })
                      .then((res) => {
                        item.newMsg = res;
                        rel(item);
                      });
                  });
              })
            );
          });
          Promise.all(arr).then((result) => {
            resolve(relect);
          });
        });
      }),
      // 消息列表
      new Promise((resolve, reject) => {
        let sql =
          "SELECT id,uid,flid,fid,type,shield,time,shieldTime,stick,stickTime,count,newMsg FROM msgList WHERE uid = ? AND stick = ? ORDER BY stickTime DESC";
        pool.query(sql, [uid, 0], (err, relect) => {
          if (err) loadErr("ws/msgList/get/stick", "mysql:select", err);
          let arr = [];
          relect = relect || [];
          relect.map((item) => {
            arr.push(
              new Promise((rel, rjt) => {
                _this
                  .getUserInfo(res, {
                    uid: item.flid,
                    fid: item.fid,
                    type: item.type,
                  })
                  .then((result) => {
                    item.userInfo = result;
                    _this
                      .getNewMsg(res, {
                        uid,
                        sendid: item.flid,
                        type: item.type,
                      })
                      .then((res) => {
                        item.newMsg = res;
                        rel(item);
                      });
                  });
              })
            );
          });
          Promise.all(arr).then((result) => {
            resolve(relect);
          });
        });
      }),
    ]).then((result) => {
      let [stick, msgList] = result;
      res.send({ code: 0, msg: "成功", data: { stick, msgList } });
    });
  },
  // 获取最新一条消息
  getNewMsg(res, uids) {
    return new Promise((resolve, reject) => {
      let { uid, sendid, type } = uids;
      console.log(uids);
      if (type == 1) {
        let sql =
          "SELECT id,uid,recid,type,msg,time,recTime,msgSign FROM msg WHERE recid = ? AND uid = ? AND type = ? ORDER BY time DESC LIMIT 0,1";
        pool.query(sql, [uid, sendid, type], (err, relect) => {
          if (err) loadErr("msg/getMsgs/newMsg", "mysql:select", err);
          if (relect && relect.length > 0) {
            resolve(relect[0]);
          } else {
            resolve({});
          }
        });
      }
    });
  },
  // 搜索用户
  searchUser(res, uids, wd) {
    let { uid, sign } = uids;
    let sql =
      "select id as uid,user,avatar,gender,userName,city from user where id LIKE ? or user = ? or phone = ? or userName LIKE ?";
    pool.query(sql, ["%" + wd + "%", wd, wd, "%" + wd + "%"], (err, relect) => {
      if (err) loadErr("msg/searchUser/list", "mysql:select", err);
      res.send({ code: 0, data: relect, wd });
    });
  },
  // 获取用户ip地址
  getClientIp(req) {
    return (
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress
    );
  },
  // 获取客户ip地址
  getCityIp(req, res, uid) {
    return new Promise((resolve, reject) => {
      let ip = _this.getClientIp(req);
      let url = "http://ip-api.com/json/" + ip + "?lang=zh-CN";
      request({ url }, (err, code, data) => {
        if (!err && code.statusCode == 200) {
          data = JSON.parse(data);
          if (uid) {
            let city =
              data.status == "success"
                ? data.regionName + "-" + data.city
                : "未知";
            let sql = "UPDATE user SET ip = ?,city = ? WHERE id = ?;";
            pool.query(sql, [ip, city, uid], (err, relect) => {
              if (err) loadErr("set/ip/city/uid", "mysql:UPDATE", err);
              if (relect && relect.affectedRows > 0) {
                resolve({ data, ip });
              } else {
                reject();
              }
            });
          } else {
            resolve(data);
          }
        }
      });
    });
  },
  // 添加登录记录
  addLogin(req, res, uid) {
    _this.getCityIp(req, res).then((data) => {
      let city;
      let country;
      let ip = _this.getClientIp(req);
      let location;
      let time = new Date().getTime();
      if (data.status == "success") {
        city = data.regionName + "-" + data.city;
        country = data.country;
        location = data.lat + "," + data.lon;
      } else {
        city = "未知";
        country = "中国";
        location = "0,0";
      }
      let sql = "INSERT INTO cityList VALUES (NULL, ?, ?, ?, ?, ?, ?)";
      pool.query(sql, [uid, ip, city, country, time, location]);
    });
  },
};

module.exports = _this;
