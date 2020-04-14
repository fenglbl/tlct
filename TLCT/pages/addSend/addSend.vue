<template>
	<view class="add-send">
		<!-- 设置背景 -->
		<view class="pages-bg" style="position: fixed;z-index: -1;background-color: #EEEEEE;width: 100%;height: 100%;"></view>
		<!-- 标题 -->
		<view class="bar">
			添加好友
		</view>
		<!-- 验证信息 -->
		<view class="content">
			<view class="title">填写验证信息</view>
			<textarea class="text" v-model="content" placeholder="" />
		</view>
		
		<!-- 发送按钮 -->
		<view class="send-btn">
			<view class="btn" @click="sendAdd">
				发送
			</view>
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
				content:''
			};
		},
		onLoad(opction) {
			this.opction =opction
		},
		onReady() {
			this.$refs.loading.open()
			let {flid,nick} = this.opction
			let uid = uni.getStorageSync('uid')
			getUserInfo(uid,1).then(res=>{
				this.$refs.loading.close()
				let [err,{data}] = res
				if(err){
					uni.showToast({
						title:'网络错误',
						icon:"none"
					})
					return;
				}
				if(data.code==0){
					this.content = '我是'+data.data.userName
				}
			})
		},
		methods:{
			sendAdd(){
				console.log("发送成功")
			}
		}
	}
</script>

<style lang="scss">
.add-send{
	.bar{
		padding-top: 80upx;
		text-align: center;
		font-size: 30upx;
		padding-bottom: 40upx;
		color: $uni-text-color-grey;
	}
	.content{
		.title{
			font-size: 26upx;
			padding: 12upx 20upx;
			color: $uni-text-color-grey;
		}
		.text{
			width: 100%;
			background-color: $tlct-W-font-color;
			padding: 10upx 20upx;
		}
	}
	
	.send-btn{
		width: 100%;
		position: fixed;
		bottom: 0;
		.btn{
			background-color: $tlct-main-bg-color;
			color: $tlct-W-font-color;
			margin: 10upx;
			padding: 20upx 0;
			text-align: center;
			border-radius: 30upx;
		}
		.btn:hover{
			background-color: $tlct-main-font-color;
		}
	}
}
</style>
