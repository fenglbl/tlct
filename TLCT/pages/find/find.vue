<template>
	<view class="find">
		<!-- 设置背景 -->
		<view class="pages-bg" style="position: fixed;z-index: -1;background-color: #EEEEEE;width: 100%;height: 100%;"></view>
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
		<!-- 加载中 -->
		<w-loading text="加载中……" mask="false" ref="loading"></w-loading>
	</view>
</template>

<script>
	import {findList} from "../../apis/index.js"
	export default {
		name:'find',// 发现
		data() {
			return {
				list:[],
			};
		},
		onLoad() {
			
		},
		onReady() {
			this.$refs.loading.open()
			this.pageShow()
		},
		onShow() {
			
			
		},
		methods:{
			// 页面进入
			pageShow(){
				
				findList()
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
						console.log(this.list)
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
			pagesTo(url){
				uni.navigateTo({
					url:url
				})
			}
		}
	}
</script>

<style lang="scss">
.find{
	.list-bar{
		height: 15upx;
	}
}
</style>
