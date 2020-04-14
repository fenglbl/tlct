<template>
	<view class="user-search-item" @click="userInfo(item)">
		<view class="avatar">
			<image style="width: 100%;height: 100%;" :src="item.avatar" mode="scaleToFill"></image>
		</view>
		<view class="content">
			<view class="title">
				<view class="userName" v-html="setInfo(item.userName)"></view>
				<view class="uid" v-html="'('+setInfo(item.uid)+')'"></view>
			</view>
			<view class="desc">
				<image style="height: 16px;width: 16px;" :src="`../../static/me/${item.gender}.png`" mode="scaleToFill"></image>
				<!-- {{ item.gender | setGender}} -->
				<text style="margin-left: 12upx;">{{item.city}}</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			item:{
				type:Object,
				default:{}
			},
			wd:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			// 用户详细信息
			userInfo(item){
				uni.navigateTo({
					url:"../../pages/userInfo/userInfo?uid="+item.uid+"&type=add"
				})
			},
			// 用户信息过滤器
			setInfo(val){
				if(val){
					val=val.toString()
					let reg = new RegExp(this.wd,'gi')
					console.log(val)
					let html = `<text style="color: #FF7043;">${this.wd}</text>`
					val = val.replace(reg,html)
				}
				return val;
			}
		},
		filters:{
			// 修改
			setGender(val){
				return val?'女':'男'
			}
		}
	}
</script>

<style lang="scss">
.user-search-item{
	background-color: $tlct-W-font-color;
	display: flex;
	// margin-bottom: 10upx;
	border-bottom: 1upx solid $uni-text-color-disable;
	padding: 20upx 15upx;
	.avatar{
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		overflow: hidden;
	}
	.content{
		margin-left: 20upx;
		flex: 1;
		font-size: 26upx;
		.title{
			display: flex;
			.userName{
				
			}
			.uid{
				color: $uni-text-color-disable;
			}
		}
		.desc{
			margin-top: 8upx;
			display: flex;
			align-items: center;
		}
	}
}
</style>
