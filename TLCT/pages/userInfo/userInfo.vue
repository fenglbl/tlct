<template>
	<view class="user-info">
		<!-- 设置背景 -->
		<view class="pages-bg" style="position: fixed;z-index: -1;background-color: #EEEEEE;width: 100%;height: 100%;"></view>
		<!-- 头 -->
		<view class="header">
			<view class="img">
				<image style="width: 100%;height: 100%;" :src="userData.avatar" mode="scaleToFill"></image>
			</view>
			<view class="desc">
				<view class="title">
					{{userData.userName}}
				</view>
				<view class="city">
					地区：{{userData.city}}
				</view>
			</view>
		</view>
		<!-- 设置备注 -->
		<view class="remark">
			设置备注和标签
			<view class="icon">
				<uni-icons type="arrowright"></uni-icons>
			</view>
		</view>
		<!-- 来源 -->
		<view class="">
			
		</view>
		<!-- 添加按钮 -->
		<view class="add-btn" @click="addUser">
			添加好友
		</view>
		<!-- 加载中 -->
		<w-loading text="加载中……" mask="false" ref="loading"></w-loading>
	</view>
</template>

<script>
	import {getUserInfo} from '../../apis/index.js'
	export default {
		data() {
			return {
				opction:{},
				userData:{},//用户信息
				userType:'',//用户类型
			};
		},
		onLoad(opction) {
			this.opction = opction
			
		},
		onReady() {
			this.$refs.loading.open()
			let {uid,type} = this.opction
			this.userType = type
			getUserInfo(uid,1).then(res=>{
				let [err,{data}] = res
				this.$refs.loading.close()
				if(err){
					uni.showToast({
						title:'网络错误',
						icon:"none"
					})
					return;
				}
				if(data.code==0){
					this.userData = data.data
				}
			})
		},
		methods:{
			addUser(){
				uni.navigateTo({
					url:"../addSend/addSend?flid="+this.userData.uid+"&nick="+this.userData.userName
				})
			}
		}
	}
</script>

<style lang="scss">
.user-info{
	.header{
		background-color: $tlct-W-font-color;
		padding: 50upx 20upx ;
		display: flex;
		border-bottom: 0.5upx solid $uni-border-color;
		.img{
			width: 100upx;
			height: 100upx;
			border-radius: 12upx;
			overflow: hidden;
		}
		.desc{
			font-size: 24upx;
			margin-left: 20upx;
			.title{
				font-size: 32upx;
				font-weight: 600;
			}
			.city{
				margin-top: 10upx;
			}
		}
	}
	.remark{
		display: flex;
		padding: 30upx 20upx;
		justify-content: space-between;
		align-items: center;
		font-size: 26upx;
		// margin-left: 20upx;
		margin-bottom: 16upx;
		background-color: $tlct-W-font-color;
	}
	.add-btn{
		background-color: $tlct-W-font-color;
		padding: 30upx 20upx;
		font-size: 26upx;
		text-align: center;
		font-weight: 600;
		color: $tlct-main-bg-color;
	}
}
</style>
