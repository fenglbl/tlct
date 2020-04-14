// const rootUrl = 'http://192.168.0.104:83/v1'; // 测试环境
const rootUrl = 'http://tlct.bolefx.xyz/v1'; // 正式环境

const apis = { 
	// 账号密码登录
	login(params){
		return uni.request({
			url:rootUrl+'/login',
			data:params,
			method:"POST"
		})
	},
	// 退出登录
	ouLogin(){
		let sign = uni.getStorageSync('sign')
		let uid = uni.getStorageSync('uid')
		if(sign&&uid){
			return uni.request({
				url:rootUrl+'/outLogin',
				method:"POST",
				data:{
					sign:sign,
					uid:uid
				}
			})
		}else{
			return new Promise((resolve, reject)=>{
				reject()
			});
		}
	},
	// 注册新用户 
	register(params){
		return uni.request({
			url:rootUrl+'/register',
			data:params,
			method:"POST"
		})
	},
	// 验证用户名和手机号是否可以注册
	isRegister(params,type){
		return uni.request({
			url:rootUrl+'/register/'+type,
			data:params,
			method:"POST"
		})
	},
	// 验证用户登录状态
	isLogin(params){
		return uni.request({
			url:rootUrl+'/login/isLogin',
			data:params,
			method:"POST",
		})
	},
	// 获取用户协议等
	protocol(id){
		return uni.request({
			url:rootUrl+"/protocol",
			data:{id}
		})
	},
	// 获取验证码
	getAuth(params){
		return uni.request({
			url:rootUrl+'/auth/get',
			method:"POST",
			data:params
		})
	},
	// 验证验证码
	auth(params){
		return uni.request({
			url:rootUrl+'/auth',
			method:"POST",
			data:params
		})
	},
	// 获取发现列表
	findList(){
		let sign = uni.getStorageSync('sign')
		let uid = uni.getStorageSync('uid')
		if(sign&&uid){
			return uni.request({
						url:rootUrl+'/findList',
						method:"POST",
						data:{
							sign:sign,
							uid:uid
						}
					})
		}else{
			return new Promise((resolve, reject)=>{
				reject()
			});
		}
	},
	// 获取我的列表
	userList(){
		let sign = uni.getStorageSync('sign')
		let uid = uni.getStorageSync('uid')
		if(sign&&uid){
			return uni.request({
						url:rootUrl+'/user/list',
						method:"POST",
						data:{
							sign:sign,
							uid:uid
						}
					}) 
		}else{
			return new Promise((resolve, reject)=>{
				reject()
			});
		}
	},
	// 获取消息内容列表
	getMsgs(recid,msgType){
		let sign = uni.getStorageSync('sign')
		let uid = uni.getStorageSync('uid')
		if(sign&&uid){
			return uni.request({
				url:rootUrl+'/getMsgs',
				method:"POST",
				data:{
					sign:sign,
					uid:uid,
					recid:recid,
					type:msgType
				}
			})
		}else{
			return new Promise((resolve, reject)=>{
				reject()
			});
		}
	},
	// 获取首页消息列表
	getMsgList(){
		let sign = uni.getStorageSync('sign')
		let uid = uni.getStorageSync('uid')
		if(sign&&uid){
			return uni.request({
				url:rootUrl+'/getMsgList',
				method:"POST",
				data:{
					sign:sign,
					uid:uid
				}
			})
		}else{
			return new Promise((resolve, reject)=>{
				reject()
			});
		}
	},
	// 搜索好友
	searchUser(wd){
		let sign = uni.getStorageSync('sign')
		let uid = uni.getStorageSync('uid')
		if(sign&&uid){
			return uni.request({
				url:rootUrl+'/searchUser',
				method:"POST",
				data:{
					sign:sign,
					uid:uid,
					wd:wd
				}
			})
		}else{
			return new Promise((resolve, reject)=>{
				reject()
			});
		}
	},
	// 获取用户信息
	getUserInfo(flid,type){
		let sign = uni.getStorageSync('sign')
		let uid = uni.getStorageSync('uid')
		if(sign&&uid){
			return uni.request({
				url:rootUrl+'/user/info',
				method:"POST",
				data:{
					sign:sign,
					uid:uid,
					type,
					flid
				}
			})
		}else{
			return new Promise((resolve, reject)=>{
				reject()
			});
		}
	}
}

module.exports = apis