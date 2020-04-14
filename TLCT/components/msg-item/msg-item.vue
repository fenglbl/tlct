<template>
	<view class="msg-item" >
		<!-- 时间 -->
		<view class="time" v-if="showTime">
			{{msg.recTime | setTime}}
		</view>
		<!-- 消息列表 -->
		<view class="item">
			<!-- 左侧头像 -->
			<view class="left-avatar">
				<image v-if="uidType" style="width: 100%;height: 100%;border-radius: 12upx;" src="https://picsum.photos/400/400" mode="scaleToFill"></image>
			</view>
			<!-- 内容 -->
			<view class="content">
				<!-- 左边三角形 -->
				<view class="angle angle-left" v-if="uidType"></view>
				<!-- 内容box -->
				<view class="content-box" :style="{float:uidType?'left':'right'}">
					<!-- 左边状态标签 -->
					<view class="state state-left"  v-if="!uidType" >
						<image v-if="!msgRes.code" style="width: 100%;height: 100%;display: block;" src="../../static/chat/sending.gif" mode="scaleToFill"></image>
						<image v-if="msgRes.code == 100" style="width: 100%;height: 100%;display: block;" src="../../static/chat/sendGoUnder.png" mode="scaleToFill"></image>
					</view>
					<!-- 文本内容 -->
					<view class="text">
						{{msg.msg}}
					</view>
					<!-- 右边状态标签 -->
					<!-- <view class="state state-right"  v-if="uidType">
						<image v-if="!msgRes.code" style="width: 100%;height: 100%;display: block;" src="../../static/chat/sending.gif" mode="scaleToFill"></image>
						<image v-if="msgRes.code==100" style="width: 100%;height: 100%;display: block;" src="../../static/chat/sendGoUnder.png" mode="scaleToFill"></image>
					</view> -->
				</view>
				<!-- 右边三角形 -->
				<view class="angle angle-right" v-if="!uidType"></view>
			</view>
			<!-- 右侧头像 -->
			<view class="right-avatar">
				<image v-if="!uidType" style="width: 100%;height: 100%;border-radius: 12upx;" src="https://picsum.photos/400/400" mode="scaleToFill"></image>
			</view>
		</view>
		
		<!-- 右侧 -->
	</view>
</template>

<script>
	export default {
		name:"msg-item",
		props:{
			uidType:{
				type:Number,
				default:0,//0表示自己，1表示对方
			},
			msg:{
				type:Object,
			},
			sendUid:{
				type:String,
			}
		},
		data() {
			return {
				msgRes:{},
				showTime:true
			};
		},
		mounted() {
			// 获取消息高度，进行页面滚动
			let query = uni.createSelectorQuery().in(this)
			query.select('.msg-item').boundingClientRect().exec((data)=>{
				let top = this.$store.getters.getChatTop[this.sendUid].top
				top+=data[0].bottom
				this.$store.commit('setChatTop',{top,uid:this.sendUid})
				uni.pageScrollTo({
					scrollTop:top,
					duration:100
				})
			})
			
		},
		filters:{
			setTime(val){
				let time = new Date(Number(val))
				time = time.getHours()+':'+time.getMinutes()
				return time
			}
		},
		watch:{
			// 深度监听msg对象
			msg:{
				handler(val, oldVal) {
					this.msgRes =this.msg.msgResult
				},
				deep:true,
			}
		}
	}
</script>

<style lang="scss">
.msg-item{
	.item{
		margin-bottom: 40upx;
		display: flex;
		.left-avatar{
			width: 80upx;
			height: 80upx;
		}
		.content{
			flex: 1;
			padding:0 12upx;
			font-size: 26upx;
			position: relative;
			.content-box{
				position: relative;
				background-color: $tlct-W-font-color;
				display: inline-block;
				min-height: 80upx;
				max-width: 100%;
				padding: 0 12upx;
				line-height: 60upx;
				border-radius: 10upx;
				// right: 12upx;
				float: right;
				.text{
					padding: 12upx 0;
				}
				.state{
					position: absolute;
					width: 30upx;
					height: 30upx;
					top: 50%;
					margin-top: -15upx;
				}
				.state-left{
					left: -40upx;
				}
				.state-right{
					right: -40upx;
				}
			}
			.angle{
				display: inline-block;
				height: 0;width: 0;
				border: 12upx solid rgba(0,0,0,0);
				position: absolute;
				top: 35upx;
			}
			.angle-left{
				left: -12upx;
				border-right: 12upx solid $tlct-W-font-color;
			}
			.angle-right{
				right: -12upx;
				border-left: 12upx solid $tlct-W-font-color;
			}
			
		}
		.right-avatar{
			width: 80upx;
			height: 80upx;
		}
	}
	.time{
		font-size: 22upx;
		padding: 6upx 12upx;
		width: 60upx;
		background-color: $tlct-W-font-color;
		margin: 12upx auto 24upx;
		border-radius: 10upx;
		opacity: 0.5;
		
	}
}
</style>
