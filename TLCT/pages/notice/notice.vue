<template>
	<view class="notice" v-html="content">
		
	</view>
</template>

<script>
	import {protocol} from "../../apis/index.js"
	export default {
		data() {
			return {
				content:''
			};
		},
		onLoad(data) {
			let id = data.id
			uni.showLoading({
				title:'加载数据中'
			})
			protocol(id)
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
					uni.setNavigationBarTitle({
						title:data.data.name
					})
					this.content = data.data.content
				}else{
					uni.showToast({
						title:data.msg,
					})
				}
			})
		}
	}
</script>

<style lang="scss">
.notice{
	margin: 40upx 10upx;
}
</style>
