const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const key = "TLCT";
let config = {
  // aes加密的密钥
  aesKey: "30f12f6523683abad6d7d85f81bb0dcf",
  // 生成mysql连接池对象
  pool: mysql.createConnection({
    host: "139.159.246.11",
    user: "TLCT",
    password: "4Reyr6SzfDmr84ij",
    database: "TLCT",
    connectionLimit: 20,
  }),
  // token管理
  jwt: {
    sign(data) {
      return new Promise((resolve, reject) => {
        jwt.sign(data, key, { expiresIn: "10d" }, (err, token) => {
          if (err) {
            resolve({ code: -1, err });
          } else {
            resolve({ code: 0, token });
          }
        });
      });
    },
    verify(token) {
      return new Promise((resolve, reject) => {
        jwt.verify(token, key, (err, data) => {
          if (err) {
            resolve({ code: -1, err });
          } else {
            resolve({ code: 0, data });
          }
        });
      });
    },
  },
  // 服务端出现错误
  loadErr(page, type, content) {
    console.log(page, type, content.sql);
    // console.log(this);
  },
  // 取随机值（数字，小写字母，大写字母）
  getRandom(leng, isnum = true, big = false, sm = false) {
    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    let biglett = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
    let smlett = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "g",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];
    let arr = [];
    if (isnum && !big && !sm) {
      arr = arr.concat(nums);
    } else if (big && !isnum && !sm) {
      arr = arr.concat(biglett);
    } else if (sm && !isnum && !big) {
      arr = arr.concat(smlett);
    } else if (isnum && big && !sm) {
      arr = arr.concat(biglett);
      arr = arr.concat(nums);
    } else if (isnum && sm && !big) {
      arr = arr.concat(smlett);
      arr = arr.concat(nums);
    } else if (big && sm && !isnum) {
      arr = arr.concat(biglett);
      arr = arr.concat(smlett);
    } else {
      arr = arr.concat(biglett);
      arr = arr.concat(smlett);
      arr = arr.concat(nums);
    }
    let num = [];
    num[0] = arr[parseInt(Math.random() * arr.length - 1)];
    for (let i = 1; i < leng; i++) {
      num[i] = arr[parseInt(Math.random() * arr.length)];
    }
    return num.join("");
  },
  // 修改手机号，隐藏手机号
  setPhone(phone) {
    if (phone && phone.length == 11) {
      let arr = phone.split("");
      arr[3] = "*";
      arr[4] = "*";
      arr[5] = "*";
      arr[6] = "*";
      arr[7] = "*";
      return arr.join("");
    } else {
      return phone;
    }
  },
  // aes加密解密
  aes: {
    encryp(data, key, iv) {
      //加密
      key = key || config.aesKey;
      iv = iv || "";
      let cipher = crypto.createCipher("aes192", key);
      let enc = cipher.update(data, "utf8", "hex"); //编码方式从utf-8转为hex;
      enc += cipher.final("hex"); //编码方式从转为hex;
      return enc;
    },
    decryp(data, key) {
      //解密
      if (!data) {
        return "";
      }
      key = key || config.aesKey;
      let decipher = crypto.createDecipher("aes192", key);
      let dec = decipher.update(data, "hex", "utf8"); //编码方式从hex转为utf-8;
      dec += decipher.final("utf8"); //编码方式从utf-8;
      return dec;
    },
  },
};

module.exports = config;
