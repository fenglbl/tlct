<template>
	<view class="login" :style="{'background-image': 'url('+image+')'}">
		<view class="logo">
			<view>T</view>
			<view>L</view>
			<view class="logo-c">C</view>
			<view>T</view>
		</view>
		<!-- 进度条 -->
		<view class="pmgressbar" :style="{width:pmgressbarWidth,'transition-duration':pmgressbarTransition}"></view>
		<!-- 登录样式的盒子 -->
		<view class="login-box">
			<!-- 标题 -->
			<view class="title">
				登录
			</view>
			<!-- 表单 -->
			<view class="form">
				<!-- 顶部可选登录方式样式 -->
				<view class="tab-bar" @click="setLoginType">
					<view class="item" :class="{active:loginType==1}" data-type = "1">
						验证码快捷登录
					</view>
					<view class="item" :class="{active:loginType==2}" data-type = "2">
						账号密码登录
					</view>
				</view>
				<!-- 表单内容 -->
				<view class="content">
					<!-- 手机验证码登录 -->
					<view class="item" v-if="loginType==1">
						<view class="user">
							<view class="lab">
								<uni-icons type="phone" size="24" ></uni-icons>
							</view>
							<input class="input" type="text" maxlength="11"  placeholder="请输入手机号" v-model="uPhone" @blur="phone"  placeholder-class="pl-input"/>
							<view class="phone-err" v-if="phoneErr">
								手机号格式不正确
							</view>
						</view>
						
						<view class="auth-code">
							<view class="lab">
								<image src="../../static/login/auth.png" style="width: 24px;height: 24px;" mode="aspectFill"></image>
							</view>
							<input class="input" type="text" placeholder="验证码" maxlength="4" @blur="auth" v-model="uAuth" placeholder-class="pl-input"/>
							<view class="btn" @click="sendAuth" :class="{dis:authBtnDis}">
								{{autnBtnText}}
							</view>
						</view>
						<view class="btn btn-login" @click="login('auth')">
							登&nbsp;录
						</view>
					</view>
					<!-- 账号密码登录 -->
					<view class="item" v-else>
						<view class="user">
							<view class="lab">
								<uni-icons type="contact" size="24" ></uni-icons>
							</view>
							<input class="input" type="text" placeholder="请输入用户名或手机号" @blur='user' v-model="uUser" placeholder-class="pl-input"/>
						</view>
						<view class="user">
							<view class="lab">
								<uni-icons type="locked" size="24" ></uni-icons>
							</view>
							<input class="input" type="text" :password="true" placeholder="请输入密码" @blur="pwd" v-model="uPwd" placeholder-class="pl-input"/>
						</view>
						
						<view class="btn btn-login" @click="login('upwd')">
							登&nbsp;录
						</view>
					</view>
				</view>
				<!-- 其他提示 -->
				<view class="test">
					<view class="ftp" @click="forget">
						忘记密码
					</view>
					<view class="to-reg">
						还没有账号？
						<text class="to-reg-text" @click="reg">去注册</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 滑动验证 -->
		<direction v-if="showVerifySuccessfully" pagetype='login'></direction>
		<!-- 登录遮罩，不透明 -->
		<view class="is-login" v-if="isLogin">
			<view class="loading">
			</view>
		</view>
		<!-- 加载中 -->
		<w-loading text="加载中……" mask="false" ref="loading"></w-loading>
	</view>
</template>

<script>
	import direction from "../../components/verification/verification.vue"
	import {getAuth,auth,isLogin,login} from "../../apis/index.js"
	export default {
		components:{
			direction
		},
		name:'login',//登录
		data() {
			return {
				loginType:1,//登录方式 1:验证码登录 2:账号密码登录
				showVerifySuccessfully:false,//验证窗口
				uPhone:'',//手机号
				phoneErr:false,//手机号验证
				uUser:'',//用户名
				uPwd:"",//密码
				uAuth:'',//验证码
				image:'https://picsum.photos/400/700',//图片临时路径
				pmgressbarWidth:'0%',//进度条宽度
				pmgressbarTransition:'0s',
				autnBtnText:"获取验证码",
				authBtnDis:false,//验证码按钮禁用
				authBtnTime:60,//验证码倒计时
				imgbgTime:'',//背景图片的时钟
				isLogin:false,//是否登录
			};
		},
		onReady() {
			// 监听人类验证结果
			uni.$on('verifySuccessfully-login',(res)=>{
				if(this.loginType==1){
					this.showVerifySuccessfully=false
					if(res&&!this.showVerifySuccessfully){
						this.getAuth()
					}
				}else{
					this.showVerifySuccessfully=false
					this.setLogin()
				}
			})
			// 验证登录状态
			this.getIsLogin()
			let _this = this
			// 获取网络状态
			uni.getNetworkType({
				success(type) {
					if(type.networkType=='wifi'||type.networkType=='ethernet'||type.networkType=='unknown'){
						// 当网络为wifi或者有线网络时才切换图片
						_this.setBgImg()
					}
					
				}
			})
		},
		methods:{
			// 提交登录
			setLogin(){
				uni.showLoading({
					title:"登录中..."
				})
				login({user:this.uUser,pwd:this.uPwd})
				.then(res=>{
					let [err,{data}] = res;
					uni.hideLoading()
					if(err){
						uni.showToast({
							title:'网络错误',
							icon:"none"
						})
						return;
					}
					if(data.code==0){
						/**
						 * 登录成功
						 */ 
						uni.setStorage({
							key:'userInfo',
							data:JSON.stringify(data.data),
							success() {
								let uid = data.data.uid
								uni.setStorageSync("uid",uid)
								uni.setStorageSync('sign',data.data.sign)
								uni.showToast({
									title:data.msg,
									duration:1500,
									success() {
										uni.switchTab({
											url:"../index/index"
										})
									}
								})
							}
						})
					}else{
						uni.showToast({
							title:data.msg,
							icon:"none"
						})
					}
				})
			},
			// 查看登录状态
			getIsLogin(){
				let sign = uni.getStorageSync('sign')
				if(sign){
				let userInfo = uni.getStorageSync('userInfo')
				userInfo=JSON.parse(userInfo)
					this.isLogin=true
					isLogin({
						uid:userInfo.uid,
						sign
					}).then(res=>{
						let [err,{data}] = res;
						this.isLogin=false
						if(err){
							uni.showToast({
								title:'网络错误',
								icon:"none"
							})
							return;
						}
						if(data.code==0){
							uni.switchTab({
								url:"../index/index"
							})
						}else{
							uni.removeStorageSync('sign')
							uni.showToast({
								title:data.msg,
								icon:"none",
								duration:2000
							})
						}
					})
					return;
				}
			},
			// 获取验证码
			getAuth(){
				let phone = this.uPhone
				let type = 'login'
				uni.showLoading({
					title:'获取中'
				})
				getAuth({phone,type})
				.then(res=>{
					let [err,{data}] = res;
					uni.hideLoading()
					if(err){
						uni.showToast({
							title:'网络错误',
							icon:"none"
						})
						return;
					}
					if(data.code==0){
						/**
						 * 验证码获取成功
						 * 正式版本没有提示
						 */
						uni.showToast({
							title:data.data,
							duration:3000
						})
						this.uAuth=data.auth
						if(!this.authBtnDis||!this.uPhone){
							this.authSetTime()
						}
					}else{
						uni.showToast({
							title:data.msg,
							icon:"none"
						})
					}
				})
			},
			// 验证码倒计时
			authSetTime(){
				this.authBtnDis=true
				this.autnBtnText=this.authBtnTime+"秒后获取"
				let timer =setInterval(()=>{
					// console.log(this.authBtnTime)
					this.authBtnTime--
					this.autnBtnText=this.authBtnTime+"秒后获取"
					if(this.authBtnTime<=1){
						clearInterval(timer)
						this.autnBtnText="获取验证码"
						this.authBtnTime=60
						this.authBtnDis=false
					}
					
				},1000)
			},
			// 跟换背景图
			setBgImg(){
				uni.downloadFile({
					url:'https://picsum.photos/400/700',
					
				}).then(res=>{
					let [err,data] = res
					this.pmgressbarTransition='10s'
					this.pmgressbarWidth="100%"
					this.imgbgTime= setTimeout(()=>{
						this.image=data.tempFilePath
						this.pmgressbarTransition='0s'
						this.pmgressbarWidth="0%"
						clearTimeout(this.imgbgTime)
						this.setBgImg()
					},10000)
					
				})
			},
			// 登录方式切换
			setLoginType(e){
				this.loginType = e.target.dataset.type
			},
			// 手机号input失去焦点
			phone(){
				let reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/ig
				if(reg.test(this.uPhone)){
					this.phoneErr=false
				}else{
					this.phoneErr=true
				}
			},
			// 验证码input失去焦点
			auth(){
				// console.log(this.uAuth)
			},
			// 发送验证码按钮被点击
			sendAuth(){
				if(this.uPhone!=''&&!this.phoneErr){
					if(!this.authBtnDis){
						uni.showLoading({
							title:'加载中'
						})
						setTimeout(()=>{
							uni.hideLoading()
							this.showVerifySuccessfully=true
						},800)
					}else{
						uni.showToast({
							title:this.autnBtnText,
							icon:"none"
						})
					}
					
				}else{
					uni.showToast({
						title:'手机号格式不正确',
						icon:"none"
					})
				}
			},
			// 用户名input失去焦点
			user(){
				// console.log(this.uUser)
			},
			// 密码input失去焦点
			pwd(){
				// console.log(this.uPwd)
			},
			// 登录按钮被点击
			login(type){
				if(type=='auth'){
					if(!this.uPhone||this.phoneErr){
						uni.showToast({
							title:"请输入完整的手机号",
							icon:"none"
						})
						return
					}
					if(!this.uAuth){
						uni.showToast({
							title:"请输入验证码",
							icon:"none"
						})
						return
					}
					uni.showLoading({
						title:'登录中'
					})
					let uauth = this.uAuth
					let phone = this.uPhone
					let type = 'login'
					auth({auth:uauth,phone,type})
					.then(res=>{
						let [err,{data}] = res;
						uni.hideLoading()
						if(err){
							uni.showToast({
								title:'网络错误',
								icon:"none"
							})
							return;
						}
						if(data.code==0){
							/**
							 * 验证码验证成功
							 */ 
							uni.setStorage({
								key:'userInfo',
								data:JSON.stringify(data.data),
								success() {
									let uid = data.data.uid
									uni.setStorageSync("uid",uid)
									uni.setStorageSync('sign',data.data.sign)
									uni.showToast({
										title:data.msg,
										duration:1500,
										success() {
											uni.switchTab({
												url:"../index/index"
											})
										}
									})
								}
							})
						}else{
							uni.showToast({
								title:data.msg,
								icon:"none"
							})
						}
					})
					
					
				}else{
					if(!this.uUser){
						uni.showToast({
							title:"请输入用户名",
							icon:"none"
						})
						return
					}
					if(!this.uPwd){
						uni.showToast({
							title:"请输入密码",
							icon:"none"
						})
						return
					}
					uni.showLoading({
						title:'加载中'
					})
					setTimeout(()=>{
						uni.hideLoading()
						this.showVerifySuccessfully=true
					},800)
					
				}
			},
			// 忘记密码被点击
			forget(){
				uni.navigateTo({
					url:"../forgetPwd/forgetPwd"
				})
			},
			// 去注册被点击
			reg(){
				uni.navigateTo({
					url:"../reg/reg"
				})
			}
		},
		watch:{
			isLogin(){
				if(this.isLogin){
					this.$refs.loading.open()
				}else{
					this.$refs.loading.close()
				}
			}
		},
		// 页面卸载
		onUnload() {
			uni.$off('verifySuccessfully-login')
			clearTimeout(this.imgbgTime)
		}
	}
</script>

<style lang="scss">
.login{
	position: fixed;
	width: 100%;
	height: 100%;
	background-color: $tlct-main-bg-color;
	background-size: 100% 100% ;
	background-position: center;
	background-repeat:no-repeat;
	transition: .6s;
	.is-login{
		position: fixed;
		width: 100%;
		height: 100%;
		z-index: 1001;
		top: 0;
		text-align: center;
		line-height: 100%;
		background-color: $tlct-W-font-color;
		.loading{
			height: 30%;
			width: 100%;
			position: absolute;
			top: 30%;
			z-index: 1002;
			.image{
				width: 100%;
			}
		}
	}
	// LOGO
	.logo{
		font-size: 80upx;
		position: fixed;
		top: 12%;
		width: 300upx;
		left: 50%;
		margin-left: -150upx;
		text-align: center;
		color: $tlct-main-font-color;
		font-weight: 700;
		display: flex;
		z-index: 1002;
		justify-content: space-around;
		.logo-c{
			color: $tlct-main-danger-color;
		}
	}
	// 进度条
	.pmgressbar{
		position: fixed;
		height: 6upx;
		width: 0%;
		background-color: $tlct-main-bg-color;
		bottom: 0;
		transition-timing-function:linear;
	}
	// 注册盒子
	.login-box{
		box-shadow: 1px 1px 10px #333333;
		position: fixed;
		width: 80%;
		left: 10%;
		top: 25%;
		background-color: $tlct-W-font-color;
		text-align: center;
		border-radius: 30upx;
		font-size: 28upx;
		// 标题样式
		.title{
			font-size: 32upx;
			display: inline-block;
			padding: 10upx 20upx;
			border-bottom: 4upx solid $tlct-main-bg-color;
			color: $tlct-main-bg-color;
		}
		// 表单
		.form{
			margin: 30upx auto 50upx;
			width: 80%;
			overflow: hidden;
			border-radius: 12upx;
			border: 1upx solid $tlct-main-bg-color;
			.pl-input{
				font-size: 24upx;
			}
			// 登录方式导航
			.tab-bar{
				font-size: 24upx;
				display: flex;
				// 登录方式
				.item{
					width: 50%;
					height: 60upx;
					line-height: 60upx;
					transition: 0.4s;
					border-bottom: 1upx solid $tlct-main-bg-color;
					box-sizing: border-box;
					color: $tlct-main-bg-color;
				}
				// 当前登录方式
				.item.active{
					background-color: $tlct-main-bg-color;
					color: $tlct-W-font-color;
					border-bottom: none;
				}
			}
			.content{
				padding: 20upx 0;
				text-align: left;
				.item{
					color: $tlct-main-danger-color;
					.user{
						position: relative;
						display: flex;
						height: 60upx;
						padding: 0 10upx;
						margin-bottom: 20upx;
						.lab{
							width: 15%;
							height: 100%;
							line-height: 60upx;
							display: flex;
							align-items: center;
							justify-content: center;
						}
						.input{
							width: 85%;
							height: 100%;
							box-sizing: border-box;
							padding-left: 15upx;
						}
						.phone-err{
							position: absolute;
							font-size: 18upx;
							right: 10upx;
							top: 50%;
							margin-top: -15upx;
						}
					}
					.auth-code{
						margin-bottom: 20upx;
						position: relative;
						display: flex;
						height: 60upx;
						padding: 0 10upx;
						.lab{
							width: 15%;
							height: 100%;
							line-height: 60upx;
							display: flex;
							align-items: center;
							justify-content: center;
						}
						.input{
							width: 50%;
							height: 100%;
							box-sizing: border-box;
							padding-left: 15upx;
						}
						.btn{
							width: 35%;
							line-height: 60upx;
							text-align: center;
							border-radius: 10upx;
							border: 1px solid $tlct-main-font-color;
							
						}
						.btn.dis{
							border: 1upx solid $uni-text-color-grey;
							color: $uni-text-color-grey;
						}
					}
					.btn.btn-login{
						height: 60upx;
						width: 80%;
						margin: 20upx auto;
						line-height: 60upx;
						text-align: center;
						color: $tlct-W-font-color;
						background-color: $tlct-main-bg-color;
						border-radius: 32upx;
						font-weight: 600;
					}
					.btn.btn-login:hover{
						background-color: $tlct-main-danger-color;
					}
				}
			}
			.test{
				display: flex;
				margin-bottom: 20upx;
				padding: 10upx 20upx;
				justify-content: space-between;
				font-size: 24upx;
				color: $uni-text-color-grey;
				.to-reg-text,.ftp{
					color: #007AFF;
				}
			}
		}
		
	}
}
</style>
