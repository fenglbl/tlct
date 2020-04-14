<template>
	<view class="index">
		<!-- 设置背景 -->
		<view class="pages-bg" style="position: fixed;z-index: -1;background-color: #EEEEEE;width: 100%;height: 100%;"></view>
		<!-- 列表 -->
		<view class="list-box">
			<uni-swipe-action>
				<uni-swipe-action-item :options="options" class="swipe-action stick" @click="itemBtn({id:item.id,flid:item.flid,fid:item.fid,type:item.type},$event)" v-for="(item,index) of msgList" :key="index" >
					<view class="item" @click="toChat({id:item.id,flid:item.flid,fid:item.fid,type:item.type},$event)">
						<view class="avatar">
							<image style="width: 100%;height: 100%;border-radius: 50%;"  :src="item.userInfo.avatar" mode="scaleToFill"></image>
						</view>
						<view class="content">
							<view class="title">
								{{item.userInfo.userName}}
							</view>
							<view class="text">
								{{item.newMsg.msg}}
							</view>
						</view>
						<view class="end">
							<view class="time">
								{{item.time | setTime}}
							</view>
							<view class="msg-num">
								<uni-badge v-if="item.count" :text="item.count" type="error"></uni-badge>
							</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
	</view>
</template>

<script>
	import config from "../../config/index.js"
	import {getMsgList} from "../../apis/index.js"
	export default {
		name:'index',//首页
		data() {
			return {
				userInfo:'',//用户登录信息
				sign:'',//用户登录sign
				msgFun:null,//接收消息函数
				ws:{},//ws对象
				options:[//设置列表滑动的样式
					{
							text: '置顶',
							style: {
									backgroundColor: '#ffaa00'
							}
					}, {
							text: '删除',
							style: {
									backgroundColor: '#dd524d'
							}
					}
				],
				// stick:[],//置顶列表
				msgList:[],//收到消息队列
				msgListIndex:{},//消息队列索引
			}
		},
		onLoad() {
			uni.$on('msg',(msg)=>{
				this.msgFun = msg
			})
			this.ws = this.$store.getters.ws
			// 获取本地登录的用户
			let _this = this;
			uni.getStorage({
				key:'sign',
				success({data}){
					_this.sign = data
					uni.getStorage({
						key:"userInfo",
						success({data}){
							_this.userInfo = JSON.parse(data)
							_this.loadMare()
						}
					})
				}
			})
		},
		// 下拉刷新事件
		onPullDownRefresh(){
			this.loadMare()
			this.getMsgList()
		},
		// 时间方法
		methods: {
			// 划开的按钮被点击
			itemBtn(userData){
				let {id,flid,fid,type} = userData
				console.log(userData)
			},
			// 跳转到
			toChat(userData,e){
				let {id,flid,fid,type} = userData
				let key = flid+fid+type
				let index = this.msgListIndex[key]
				this.msgList[index].count=0
				let uid = type==1?flid.toString():fid.toString()
				uni.navigateTo({
					url:'../chat/chat?uid='+uid
				})
			},
			// 初始化
			loadMare(){
				this.$store.commit('getWs',msg=>{
					// 将收到的聊天界面
					uni.stopPullDownRefresh()
					if(this.msgFun) this.msgFun(msg);
					let ws = this.$store.getters.ws
					if(msg.code==200){
						console.log("key",msg)
						uni.setStorageSync('key',msg.key)
						// 我收成功，发送用户信息握手包到服务
						let sendMsg={code:200,user:{key:msg.key,uid:this.userInfo.uid,sign:this.sign}}
						sendMsg=JSON.stringify(sendMsg)
						sendMsg = this.aes.encryp(sendMsg)
						// sendMsg = decodeURI(sendMsg)
						ws.send({data:sendMsg})
					}
					if(msg.code == 1){
						let key = msg.msg.uid+msg.msg.type
						let index = this.msgListIndex[key]
						this.msgList[index].count++
						this.msgList[index].newMsg = msg.msg
					}
				})
				this.getMsgList()
			},
			// 获取消息列表
			getMsgList(){
				getMsgList().then(res=>{
					let [err,{data}] = res;
					if(err){
						uni.showToast({
							title:'网络错误',
							icon:"none"
						})
						return;
					}
					if(data.code==0){
						this.msgList=data.data.stick
						data.data.msgList.map(item=>{
							this.msgList.push(item)
						})
						for (let i = 0;i<this.msgList.length;i++) {
							let key = this.msgList[i].flid+this.msgList[i].fid+this.msgList[i].type
							this.msgListIndex[key]=i
						}
						console.log('m',this.msgListIndex)
					}
				})
			}
		},
		// 过滤器
		filters:{
			setTime(val){
				// 处理时间
				val = Number(val)
				val = new Date(val)
				val = val.getHours()+':'+val.getMinutes()
				console.log(val,typeof val)
				return val
			}
		},
		// 页面卸载事件
		onUnload() {
			uni.$off('msg') 
		}
	}
</script>

<style lang="scss">
.index{
	.list-box{
		padding: 20upx;
		.swipe-action{
			border-radius: 15upx;
			margin-bottom: 20upx;
			
		}
		.item{
			display: flex;
			width: 100%;
			padding: 12upx ;
			.avatar{
				width: 80upx;
				height: 80upx;
			}
			.content{
				margin: 0 24upx;
				width: 100%;
				flex: 1;
				position: relative;
				.title{
					font-size: 26upx;
					font-weight: 600;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.text{
					position: absolute;
					width: 100%;
					bottom: 0;
					font-size: 24upx;
					color: $uni-text-color-grey;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.end{
				width: 80upx;
				height: 80upx;
				position: relative;
				.time{
					font-size: 22upx;
				}
				.msg-num{
					position: absolute;
					bottom: 0;
				}
			}
		}
	}
}
</style>
