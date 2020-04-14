// let wsUrl = 'ws://192.168.0.103:84'; //测试环境
let wsUrl = 'ws://tlctws.bolefx.xyz:84'; //上线环境
import crypto from 'crypto'



const config={
		wsUrl,
		amapKey:'30f12f6523683abad6d7d85f81bb0dcf',
		aesKey:'30f12f6523683abad6d7d85f81bb0dcf',
		code:{
			0:"成功",
			1:"接收到msg消息",
			2:"发送成功",
			100:"消息错误",
			101:"连接失败",
			200:"首次握手成功",
			201:'返回用户信息',
			300:"接口无效", 
			301:"用户名格式不正确，请输入8-16位字母或数字",
			302:"手机号格式不正确",
			303:"密码格式不正确，请输入8-64位字符",
			304:"两次密码不一致",
			305:"手机号已存在",
			306:"用户名已存在",
			307:'账号或密码错误',
			401:"参数不正确",
			402:"手机号格式不正确",
			403:"验证码获取失败",
			404:"验证码不正确",
			405:"用户不存在",
			406:"验证码已失效，请重新获取",
			407:"注册失败",
			408:"注册成功，登录失败，请重试",
			409:'登录失败，token异常，请重试',
			410:"登录失败，请重试",
			411:"sign不存在，请重新登录",
			412:"登录过期，请重新登录",
			413:"账号被挤出，请注意修改账号密码，防止账号被盗",
			414:"发现内容为空",
			415:"我的页面列表为空",
			416:'退出登录失败',
			417:"获取信息失败"
			
		},
		newWss(getMsgArr){
			return new Promise((resolve,reject)=>{
				let ws = getws() 
				function getws(){
					return uni.connectSocket({
						url:wsUrl,
						header: {
							'content-type': 'application/json',
						},
						success(){
							uni.showLoading({
								title:'正在连接服务器……'
							})
							console.log('创建成功')
						},
						fail() {
							console.log('连接失败，正在重连')
							ws = getws()
							// reject('连接错误')
						}
					})
				}
				
				ws.onOpen(()=>{
					console.log('连接成功')
					uni.hideLoading()
					ws.onMessage(({data})=>{
						// console.log('ss',data)
						// data=data.replace(/ /g, "+");
						data=config.aes.decryp(data)
						// console.log('dd',config.aes.decryp(data))
						let msg = JSON.parse(data)
						getMsgArr.map(item=>{
							item(msg)
						})
					})
					resolve(ws)
				})
				ws.onClose(function(){
					uni.showToast({
						title:'断开，正在重连'
					})
					console.log('连接断开，正在重连')
					ws = getws() 
				})
				ws.onError((err)=>{
					console.log('连接错误')
					console.log(err)
				})
			})
		},
		// aes加密解密
		aes:{
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
		}
	}


module.exports =config