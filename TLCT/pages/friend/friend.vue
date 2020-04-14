<template>
	<view class="friend">
		<!-- 设置背景 -->
		<view class="pages-bg" style="position: fixed;z-index: -1;background-color: #EEEEEE;width: 100%;height: 100%;"></view>
		<!-- 顶部tab -->
		<view class="">
			<tab-bar @change ='change' :opction="tabList" :styleOpction="tabStyle" :active="tabActive"></tab-bar>
		</view>
		<!-- 内容 -->
		<swiper :style="{height:contentHeight+'px'}" @change="contentChang"  :current="tabActive">
			<swiper-item v-for="(item,index) of tabList" :key="index">
				<scroll-view scroll-y="true" style="height: 100%;">
					<button type="default" @click="toSearch">搜索好友</button>
					<!-- <uni-indexed-list :options="list" :showSelect="false" @click="bindClick"></uni-indexed-list> -->
				</scroll-view>
			</swiper-item>

		</swiper>
	</view>
</template>

<script>
	export default {
		name:'friend',//好友
		data() {
			return {
				tabActive:0,
				tabList:[{id:0,title:'好友'},{id:1,title:'群聊'},{id:2,title:'新朋友'},{id:3,title:'新朋友'}],
				tabStyle:{color:'#5d5d5d',selectColor:'#FF7043',selectBgColor:"#FFCCBC"},
				contentHeight:0,// 设置内容区域高度
				tabBarHeight:0,// 导航栏高度
			};
		},
		onReady() {
			this.getTabBarHeight()
			
			this.contentHeight =this.systemInfo.windowHeight- this.tabBarHeight - this.systemInfo.titleBarHeight - this.systemInfo.tabBarHeight-110
			// #ifdef H5 || MP
			this.contentHeight =this.systemInfo.windowHeight - this.tabBarHeight - this.systemInfo.titleBarHeight - this.systemInfo.tabBarHeight
			// #endif
		},
		methods:{
			toSearch(){
				uni.navigateTo({
					url:'../searchUser/searchUser'
				})
			},
			// 导航栏变化
			change(id,obj){
				this.tabActive = id
			},
			// 内容改变
			contentChang(e){
				this.tabActive = e.detail.current
			},
			// 取导航栏tab-bar高度
			getTabBarHeight(){
				let query = uni.createSelectorQuery()
					query.select('.tab-bar').boundingClientRect().exec((doc)=>{
						let {height} = doc[0]
						this.tabBarHeight = height
					})
			}
		},
		
	}
</script>

<style lang="scss">
.friend{
	
}
</style>
