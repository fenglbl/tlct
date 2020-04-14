<template>
	<view class="reg">
		<!-- logo -->
		<view class="logo">
			<view>T</view>
			<view>L</view>
			<view class="logo-c">C</view>
			<view>T</view>
		</view>
		<!-- 表单 -->
		<view class="form">
			<!-- 用户名 -->
			<view class="user">
				<view class="lab">
					<uni-icons type="contact" size="24" ></uni-icons>
				</view>
				<input class="input" type="text" placeholder="请输入用户名" @blur="user" v-model="uUser" placeholder-class="pl-input"/>
				<view class="err" v-if="userErr">
					{{userConten}}
				</view>
			</view>
			<!-- 手机号 -->
			<view class="user item">
				<view class="lab">
					<uni-icons type="phone" size="24" ></uni-icons>
				</view>
				<input class="input" type="text" maxlength="11"  placeholder="请输入手机号" v-model="uPhone" @blur="phone"  placeholder-class="pl-input"/>
				<view class="err" v-if="phoneErr">
					{{phoneConten}}
				</view>
			</view>
			<!-- 验证码 -->
			<view class="auth-code item">
				<view class="lab">
					<image src="../../static/login/auth.png" style="width: 24px;height: 24px;" mode="aspectFill"></image>
				</view>
				<input class="input" type="text" placeholder="验证码" maxlength="4" @blur="auth" v-model="uAuth" placeholder-class="pl-input"/>
				<view class="btn" @click="sendAuth"  :class="{dis:authBtnDis}">
					{{autnBtnText}}
				</view>
			</view>
			<!-- 密码 -->
			<view class="pwd user item">
				<view class="lab">
					<uni-icons type="locked" size="24" ></uni-icons>
				</view>
				<input class="input" type="text" :password="true" placeholder="请输入密码" @blur="pwd" v-model="uPwd" placeholder-class="pl-input"/>
				<view class="err" v-if="pwdErr">
					密码格式不正确
				</view>
			</view>
			<!-- 重复密码 -->
			<view class="upwd user item">
				<view class="lab">
					<uni-icons type="locked" size="24" ></uni-icons>
				</view>
				<input class="input" type="text" :password="true" placeholder="请再次输入密码" @blur="upwd" v-model="uuPwd" placeholder-class="pl-input"/>
				<view class="err" v-if="upwdErr">
					密码不一致
				</view>
			</view>
			<!-- 用户须知 -->
			
			<view class="notice">
				<checkbox-group @change="checkbox">
					<label>
						<checkbox style="transform:scale(0.6);" :value="'notice'" />
						<text class="title">我已阅读并接受</text>
					</label>
				</checkbox-group>
				<text class="link" @click="toNotice(1)">《用户协议》</text>
				<text>
				</text>
				<text class="link" @click="toNotice(2)">《隐私政策》</text>
				<text>
				</text>
				<text class="link" @click="toNotice(3)">《版权声明》</text>
			</view>
			<!-- 注册按钮 -->
			<view :class="{disabled:!notice}" class="reg-btn" @click="reg">
				注&nbsp;册
			</view>
		</view>
		<direction v-if="showVerifySuccessfully" pagetype='reg'></direction>
	</view>
</template>

<script>
	import direction from "../../components/verification/verification.vue"
	import {register,isRegister,getAuth} from "../../apis/index.js"
	export default {
		name:'reg',//注册
		components:{
			direction
		},
		data() {
			return {
				autnBtnText:'获取验证码',
				uPhone:'',//手机号，双向绑定
				uAuth:'',//验证码
				uUser:'',//用户名
				uPwd:"",//密码
				uuPwd:'',//重复密码
				showVerifySuccessfully:false,
				phoneErr:false,//手机号格式
				phoneConten:'手机号格式不正确',//手机号错误提示
				userErr:false,//用户名格式
				userConten:'用户名格式不正确',//用户名错误提示
				pwdErr:false,//密码格式
				upwdErr:false,//重复密码
				notice:false,//协议勾选
				regData:[false,false,false,false,false],//登录数据验证格式 0:user 1:phone 2:auth 3:pwd 4:uppwd
				authBtnDis:true,//验证码可用状态
				authBtnTime:60,//验证码倒计时
			};
		},
		onLoad() {
			// 监听人类验证结果
			uni.$on('verifySuccessfully-reg',(res)=>{
				this.showVerifySuccessfully=false
				if(res&&!this.showVerifySuccessfully){
						this.getAuth()
				}
			})
		},
		methods:{
			// 阅读用户协议选中
			checkbox(e){
				if(e.detail.value.length>0){
					this.notice =true
				}else{
					this.notice=false
				}
			},
			// 点击3个协议
			toNotice(e){
				uni.navigateTo({
					url:'../notice/notice?id='+e
				})
			},
			// 手机号input失去焦点
			phone(){
				let rag = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/ig
				if(rag.test(this.uPhone)){
					isRegister({phone:this.uPhone},'phone').then(res=>{
						let [err,{data}] = res;
						if(err){
							uni.showToast({
								title:'网络错误',
								icon:"none"
							})
							return;
						}
						if(data.code==0){
							this.phoneErr=false
							this.authBtnDis=false
							this.regData[1]=true
						}else{
							this.phoneConten=data.msg
							this.phoneErr=true
							this.regData[1]=false
							
						}
					})
				}else{
					this.phoneConten='手机号格式不正确'
					this.phoneErr=true
					this.regData[1]=false
				}
			},
			// 验证码input失去焦点
			auth(){
				if(this.uAuth){
					this.regData[2]=true
				}else{
					this.regData[2]=false
				}
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
					}
				}else{
					uni.showToast({
						title:this.phoneConten,
						icon:"none"
					})
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
			// 用户名input失去焦点
			user(){
				let rag = /^[A-Za-z0-9]{8,16}$/ig
				if(rag.test(this.uUser)){
					isRegister({user:this.uUser},'user').then(res=>{ 
						let [err,{data}] = res;
						if(err){
							uni.showToast({
								title:'网络错误',
								icon:"none"
							})
							return;
						}
						if(data.code==0){
							this.userErr=false
							this.regData[0]=true
						}else{
							this.userConten=data.msg
							this.userErr=true
							this.regData[0]=false
						}
					})
				}else{
					this.userConten="用户名格式不正确"
					this.userErr=true
					this.regData[0]=false
				}
			},
			// 密码input失去焦点
			pwd(){
				let rag = /^[\u4E00-\u9FA5A-Za-z0-9]{8,64}$/ig
				if(rag.test(this.uPwd)){
					this.pwdErr=false
					this.regData[3]=true
				}else{
					this.pwdErr=true
					this.regData[3]=false
				}
			},
			// 重复密码input失去焦点
			upwd(){
				if(this.uPwd===this.uuPwd&&this.uuPwd!=''){
					this.upwdErr=false
					this.regData[4]=true
				}else{
					this.upwdErr=true;
					this.regData[4]=false
				}
			},
			// 注册
			reg(){
				if(!this.notice){
					uni.showToast({
						title:'请先勾选用户协议',
						icon:"none"
					})
				}else{
					let errData = this.regData.indexOf(false)
					if(errData==-1){
						uni.showLoading({
							title:"注册中..."
						})
						// 发送请求注册
						register({
							user:this.uUser,
							phone:this.uPhone,
							auth:this.uAuth,
							pwd:this.uPwd,
							upwd:this.uuPwd
						}).then(res=>{
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
								uni.showToast({
									title:"注册成功，请前往登录"
								})
							}else{
								uni.showToast({
									title:data.msg,
									icon:"none"
								})
							}
						})
					}else{
						if(errData==0) uni.showToast({title:'用户名格式不正确',icon:"none"})
						if(errData==1) uni.showToast({title:'手机号格式不正确',icon:"none"})
						if(errData==2) uni.showToast({title:'请输入验证码',icon:"none"})
						if(errData==3) uni.showToast({title:'密码格式不正确',icon:"none"})
						if(errData==4) uni.showToast({title:'密码不一致',icon:"none"})
					}
				}
			}
		}
	}
</script>

<style lang="scss">
.reg{
	// logo
	.logo{
		font-size: 80upx;
		width: 300upx;
		margin:60upx auto ;
		text-align: center;
		color: $tlct-main-font-color;
		font-weight: 700;
		display: flex;
		justify-content: space-around;
		.logo-c{
			color: $tlct-main-bg-color;
		}
	}
	// 表单
	.form{
		margin-top: 10%;
		.err{
			transition: .5s;
			color: red;
			position: absolute;
			font-size: 18upx;
			right: 10upx;
			top: 50%;
			margin-top: -15upx;
		}
		.user,.auth-code{
			box-sizing: border-box;
			position: relative;
			display: flex;
			height: 100upx;
			// margin-bottom: 20upx;
			padding: 0 10upx;
			align-items: center;
			.lab{
				width: 15%;
				height: 100%;
				line-height: 60upx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
		.user.item  .input,.auth-code.item .input{
			// border-top: 1upx solid $tlct-main-bg-color; 
		}
		.user{
			.input{
				width: 85%;
				height: 100%;
				box-sizing: border-box;
				padding-left: 15upx;
			}
		}
		.auth-code{
			.input{
				width: 55%;
				height: 100%;
				box-sizing: border-box;
				padding-left: 15upx;
			}
			.btn{
				width: 30%;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				border-radius: 10upx;
				border: 1px solid $tlct-main-font-color;
				font-size: 26upx;
			}
			.btn.dis{
				border: 1upx solid $uni-text-color-grey;
				color: $uni-text-color-grey;
			}
		}
		.notice{
			padding: 30upx 20upx 50upx;
			display: flex;
			align-items: center;
			font-size: 24upx;
			justify-content: center;
			.title{
				color: $uni-text-color-disable;
			}
			.link{
				color: #007AFF;
				// text-decoration: underline;
				border-bottom: 1upx solid #007AFF;
				margin: 0 3upx;
			}
		}
		.reg-btn{
			width: 80%;
			margin: 0 auto;
			height: 80upx;
			line-height: 80upx;
			text-align: center;
			border: 1upx solid $tlct-main-bg-color;
			color: $tlct-main-bg-color;
			border-radius: 40upx;
		}
		.reg-btn.disabled{
			border: 1upx solid $uni-text-color-grey;
			color: $uni-text-color-grey;
		}
	}
}
</style>
