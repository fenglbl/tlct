<template>
	<view class="me">
		<!-- 设置背景 -->
		<view class="pages-bg" style="position: fixed;z-index: -1;background-color: #EEEEEE;width: 100%;height: 100%;"></view>
		<!-- 个人信息 -->
		<view class="user">
			<!-- 头像 -->
			<view class="avatar">
				<image class="image" :src="userData.avatar" mode="scaleToFill"></image>
			</view>
			<!-- 信息 -->
			<view class="desc">
				<!-- 昵称 -->
				<view class="nick">
					{{userData.userName}}
				</view>
				<!-- uids -->
				<view class="uids">
					<!-- uid -->
					<view class="uid">
						{{userData.uid}}
					</view>
					<!-- 结束 -->
					<view class="end">
						<!-- 二维码 -->
						<view class="qr">
							<image class="image" src="../../static/me/qr.png" mode="scaleToFill"></image>
						</view>
						<!-- 箭头 -->
						<view class="icon">
							<uni-icons type="arrowright"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 个人信息 end -->
		<view class="list-bar"></view>
		<!-- 列表 -->
		<view class="list-item" v-for="(item,index) of list" :key="index">
			<uni-list>
				<uni-list-item v-for="(it,idx) of item" :title="it.title" :thumb="it.icon" :showBadge="it.rightType=='badge'" :badgeType="it.rightBadgeType" :badgeText="it.rightBadgeNum" @click="pagesTo(it.url)">
					<template v-slot:right="" v-if="it.isRight">
						<image v-if="it.rightType=='image'" :src="it.rightImage" mode="widthFix" style="width: 40px;height: 40px;"></image>
						<text style="font-size: 24upx;" v-if="it.rightType=='text'" :style="{color:it.rightTextStyle}">{{it.rightText}}</text>
						
					</template>
				</uni-list-item>
			</uni-list>
			<view class="list-bar"></view>
		</view>
		<!-- 退出登录 -->
		<view class="outLogin" @click="outLogin">
			退出登录
		</view>
		<!-- 加载中 -->
		<w-loading text="加载中……" mask="false" ref="loading"></w-loading>
	</view>
</template>

<script>
	import {isLogin,userList,ouLogin} from "../../apis/index.js"
	export default {
		name:'me',//我
		data() {
			return {
				userData:{},//用户信息
				list:[],//列表
			};
		},
		onReady() {
			this.$refs.loading.open()
			this.getIsLogin()
		},
		methods:{
			// 登录状态取数据
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
						this.$refs.loading.close()
						this.$refs.loading.open()
						this.pageShow()
						this.isLogin=false
						if(err){
							uni.showToast({
								title:'网络错误',
								icon:"none"
							})
							return;
						}
						if(data.code==0){
							this.userData = data.data
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
			// 获取列表
			pageShow(){
				userList()
				.then(res=>{
					let [err,{data}] = res;
					this.$refs.loading.close()
					if(err){
						uni.showToast({
							title:'网络错误',
							icon:"none"
						})
						return;
					}
					if(data.code==0){
						this.list=data.findList
					}else{
						uni.showToast({
							title:data.msg,
							icon:"none"
						})
						setTimeout(()=>{
							uni.reLaunch({
								url:"../login/login"
							})
						},1500)
					}
				})
				.catch(err=>{
					uni.showToast({
						title:'请先登录',
						icon:"none",
						duration:1500,
						success() {
							setTimeout(()=>{
								uni.reLaunch({
									url:"../login/login"
								})
							},1500)
						}
					})
					
				})
			},
			outLogin(){
				ouLogin().then(res=>{
					let [err,{data}] = res;
					if(err){
						uni.showToast({
							title:'网络错误',
							icon:"none"
						})
						return;
					}
					if(data.code==0){
						uni.showToast({
							title:"退出登录成功",
							success() {
								uni.reLaunch({
									url:'../login/login'
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
			}
		}
	}
</script>

<style lang="scss">
.me{
	.user{
		background-color: $tlct-W-font-color;
		padding: 32upx;
		display: flex;
		.avatar{
			width: 120upx;
			height: 120upx;
			.image{
				width: 100%;
				height: 100%;
				border-radius: 12upx;
			}
		}
		.desc{
			flex: 1;
			margin-left: 20upx;
			position: relative;
			padding: 10upx 0;
			.nick{
				font-size: 28upx;
				font-weight: 600;
			}
			.uids{
				position: absolute;
				bottom: 10upx ;
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				.uid{
					font-size: 24upx;
				}
				.end{
					display: flex;
					.qr{
						width: 30upx;
						height: 30upx;
						margin-right: 40upx;
						.image{
							display: flex;
							width: 100%;
							height: 100%;
						}
					}
					.icon{
						display: flex;
						align-items: center;
					}
				}
			}
			
		}
	}
	.list-bar{
		height: 15upx;
	}
	.outLogin{
		background-color: $tlct-W-font-color;
		text-align: center;
		margin: 15upx;
		padding: 15upx 0;
		border-radius: 12upx;
		font-size: 30upx;
		color: #333333;
	}
}
</style>
