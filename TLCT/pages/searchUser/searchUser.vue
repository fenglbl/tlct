<template>
	<view class="search-user">
		<!-- 设置背景 -->
		<view class="pages-bg" style="position: fixed;z-index: -1;background-color: #EEEEEE;width: 100%;height: 100%;"></view>
		
		<view v-if="statusBarHeight" :style="{'height': statusBarHeight+'px'}" style="width: 100%;position: fixed;top:0;background-color: #FFFFFF;z-index: 100;"></view>
		<!-- 自定义导航栏 -->
		<uni-nav-bar :fixed='true' leftIcon="arrowleft" leftText="返回" @clickLeft="back"  :style="{'padding-top': statusBarHeight+'px'}">
			<uni-search-bar radius="60" style="width: 100%;" bgColor="#FFFFFF" cancelButton="none" placeholder="TLCT号/账号/昵称/手机号" @input="textChange"></uni-search-bar>
			<view slot="right" class="search-btn" @click="searchUser">
				搜索
			</view>
		</uni-nav-bar>
		<!-- 用户列表 -->
		<view class="list-box"> 
			<user-search-item v-for="(item,index) of userList" :key="index" :item="item" :wd="searchContent"></user-search-item>
		</view>
		<!-- 没有搜索到 -->
		<view class="no-search" v-if="!userList.length">
			{{serchOrder}}
		</view>
	</view>
</template>

<script>
	import {searchUser} from "../../apis/index.js"
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	export default {
		components:{
			uniSearchBar
		},
		name:'search-user',//
		data() {
			return {
				searchContent:'',
				userList:[],
				statusBarHeight:this.systemInfo.statusBarHeight,//状态栏高度
				serchOrder:'',//搜索结果
			};
		},
		methods:{
			
			// 内容改变
			textChange(e){
				this.searchContent = e.value
				if(!e.value) this.userList = []
			},
			// 搜索好友
			searchUser(){
				searchUser(this.searchContent).then(res=>{
					let [err,{data}] = res
					if(err){
						uni.showToast({
							title:'网络错误',
							icon:"none"
						})
						return;
					}
					if(data.code==0){
						this.userList = data.data
						this.serchOrder = data.data.length?'':'没有找到相关结果'
					}
				})
			},
			// 返回
			back(){
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
.search-user{
	.search-btn{
		font-size: 28upx;
		color: $tlct-main-bg-color;
	}
	.no-search{
		width: 100%;
		height: upx(100);
		line-height: upx(100);
		margin-top: upx(200);
		text-align: center;
		font-size: upx(26);
		color: #3F536E;
	}
}
</style>
