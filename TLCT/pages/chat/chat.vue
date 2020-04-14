<template>
	<view class="chat">
		<!-- 设置背景 -->
		<view class="pages-bg" style="position: fixed;z-index: -1;background-color: #EEEEEE;width: 100%;height: 100%;"></view>
		<!-- 消息队列 -->
		<view class="msg-box" ref="msgBox">
			<msg-item v-for="(item,index) of msgList" :key="index" :msg="item" :uidType="item.msgType" :msgResult="msgResultList" :sendUid="sendUid"></msg-item>
			<!-- <msg-item v-for="(item,index) of msgList" :key="index" :msg="item" :uidType="1" :msgResult="msgResultList[item.msgSign]"></msg-item> -->
		</view>
		
		<!-- 底部输入框盒子 -->
		<view class="input-box">
			<!-- 语音盒子 -->
			<view class="record-btn">
				<image v-if="inputType==0" class="image" src="../../static/chat/keyboard.png" mode="scaleToFill" @click="keyboard"></image>
				<image v-if="inputType==1" class="image" src="../../static/chat/record.png" mode="scaleToFill" @click="record"></image>
			</view>
			<!-- 输入框 -->
			<view class="inpue">
				<!-- <input v-if="inputType==1" type="text" v-model="content" /> -->
				<textarea class="content" v-if="inputType==1" v-model="content" maxlength="-1" :auto-height="true"></textarea>
				<view class="record-send-btn" v-if="inputType==0">
					按住&nbsp;说话
				</view>
			</view>
			<!-- 其他 -->
			<view class="rest">
				<!-- 表情 -->
				<view class="face">
					<image style="width: 100%;height: 100%;" src="../../static/chat/face.png" mode="scaleToFill"></image>
				</view>
				<!-- 更多 -->
				<view class="more" :style="{opacity:content?'0':'1',width:content?'0':'1.2em' }">
					<image style="width: 100%;height: 100%;" src="../../static/chat/more.png" mode="scaleToFill"></image>
				</view>
				<view class="send-btn" :style="{opacity:content?'1':'0' ,width:content?'2em':'0',padding:content?'0.5em 1em':'0'}" @click="send">
					发送
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getMsgs} from "../../apis/index.js"
	export default {
		name:'chat',//聊天窗口
		data() {
			return {
				content:'',//输入的内容
				inputType:1,//输入类型 0文字输入 1语音输入
				sendUid:"100009",//接收者的uid
				ws:{},//ws对象
				msgList:[],//消息列表
				msgResultList:{},//消息结果列表
				msgType:1,//默认为好友
			};
		},
		onLoad(opition) {
			this.sendUid = opition.uid
		},
		onReady() {
			// 读取vuex中的ws对象，用于消息发送
			this.ws = this.$store.getters.ws
			// 传递收到消息方法到index页面
			uni.$emit('msg',this.onMsg)
			// 初始化页面滚动高度
			this.$store.commit('setChatTop',{top:0,uid:this.sendUid})
			this.lodemord()
		},
		methods:{
			// 创建页面
			lodemord(){
				getMsgs(this.sendUid,this.msgType).then(res=>{
					let [err,{data}] = res;
					if(err){
						uni.showToast({
							title:'网络错误',
							icon:"none"
						})
						return;
					}
					if(data.code==0){
						uni.setNavigationBarTitle({
							title:data.data.recUser.userName
						})
						let msgs = data.msgs
						msgs.map(item=>{
							item.msgType = 2
							this.msgList.push(item)
						})
					}else{
						uni.showToast({
							title:data.msg,
							icon:"none"
						})
					}
				})
			},
			// 监听收到消息
			onMsg(msg){
				if(msg.code == 1){// 收到消息
					let msgItem = msg.msg
					console.log('mdg.data',msgItem)
					if(msgItem.uid==this.sendUid){
						msgItem.msgType = 1
						this.msgList.push(msgItem)
					}
				}else if(msg.code == 2){// 返回消息发送成功事件
					this.content='' 
					let index = this.msgResultList[msg.msgSign]
					this.msgList[index].msgResult=msg
				}else if(msg.code == 100){// 消息发送错误事件
					this.content=''
					let index = this.msgResultList[msg.msgSign]
					this.msgList[index].msgResult=msg
				}
			},
			// 发送按钮点击 
			send(){
				let sign = uni.getStorageSync('sign')
				let uid = uni.getStorageSync('uid')
				let time = new Date().getTime()
				// let msgContent = encodeURI(this.content)
				let msgContent = this.content
				let data = {uid,recid:this.sendUid,type:1,msg:msgContent,time,msgType:0}
				let msgSign = this.md5(JSON.stringify(data))
				data.msgSign = msgSign
				data.msgResult={}
				let index = this.msgList.push(data)
				this.msgResultList[msgSign]=index-1
				let key = uni.getStorageSync('key')
				let msg = {code:1,data,key}
				msg = JSON.stringify(msg)
				msg = this.aes.encryp(msg)
				// msg = decodeURI(msg)
				this.ws.send({data:msg})	
				console.log(msg)
			},
			// 语音输入被点击
			record(){
				this.inputType=0
			},
			// 键盘输入被点击
			keyboard(){
				this.inputType=1
			},
			
		}
	}
</script>

<style lang="scss">
.chat{
	.msg-box{
		padding: 20upx 20upx;
		margin-bottom: 50upx;
	}
	// 输入框
	.input-box{
		position: fixed;
		width: 100%;
		min-height: 65upx;
		background-color: #f6f6f6;
		bottom: 0;
		display: flex;
		padding: 10upx 0;
		align-items: flex-end;
		// 语音
		.record-btn{
			bottom: 10upx;
			width: 10%;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom:8upx;
			.image{
				width: 1.2em;
				height: 1.2em;
			}
		}
		.inpue{
			width: 67%;
			display: flex;
			align-items: center;
			input,.content{
				width: 100%;
				min-height: 2em;
				max-height: 8em;
				border-radius: 10upx;
				background-color: #FFFFFF;
				padding: 0 20upx;
			}
			.record-send-btn{
				width: 100%;
				height: 80%;
				border-radius: 10upx;
				background-color: #FFFFFF;
				font-size: 24upx;
				text-align: center;
				line-height: 56upx;
			}
		}
		.rest{
			width: 23%;
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin-bottom:8upx;
			.face{
				width: 1.2em;
				height: 1.2em;
			}
			.more{
				width: 1.2em;
				height: 1.2em;
				transition: .3s;
			}
			.send-btn{
				width: 2.4em;
				height: 1.2em;
				background-color: $tlct-main-bg-color;
				color: $tlct-W-font-color;
				font-size: 24upx;
				padding: 0.5em 1em;
				border-radius: 10upx;
			}
		}
	}
}
</style>
