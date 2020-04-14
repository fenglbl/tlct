<template>
	<view class="nearby">
		{{JSON.stringify(location)}}
		<!-- 加载中 -->
		<w-loading text="定位中" mask="false" ref="loading"></w-loading>
	</view>
</template>

<script>
	
	export default {
		name:"nearby",//附近的人
		data() {
			return {
				location:{}
			};
		},
		onReady() {
			this.$refs.loading.open()
			let _this = this
			// 只有小程序支持获取权限，不包括支付宝
			// #ifdef MP
			// #ifndef MP-ALIPAY
			uni.authorize({
				scope:"scope.userLocation",
				success() {
					_this.loadMore()
				}
			})
			// #endif 
			// #endif
			// 非小程序，或支付宝
			// #ifndef MP
			this.loadMore()
			// #endif
			// #ifdef MP-ALIPAY
			this.loadMore()
			// #endif
		},
		methods:{
			loadMore(){
				this.$refs.loading.close()
				uni.setNavigationBarTitle({
					title:"附近的人【"+this.locationInfo.city+"】"
				})
			}
		}
	}
</script>

<style lang="scss">
.nearby{
	
}
</style>
