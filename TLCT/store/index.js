import Vue from 'vue'
import Vuex from 'vuex'
import config from "../config/index.js"


Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		ws:{},
		chatMsgItem:{},//每条消息的对象，用来保存消息数据
		chatTop:{},//用来存储蕾西队列的高度
	},
	mutations: {
		// 创建连接
		getWs(state,onMsg) {
			uni.getStorage({
				key:'sign',
				success({data}){
					let sign = data
					uni.getStorage({
						key:"userInfo",
						success({data}){
							
							let userInfo = JSON.parse(data)
							loadMare()
						}
					})
				}
			})
			function loadMare(){
				config.newWss([onMsg])
				.then(ws=>{
					state.ws = ws
				})
			}
		},
		// 修改聊天框的高度
		setChatTop(state,{top,uid}){
			if(!state.chatTop[uid]){
				state.chatTop[uid]={}
			}
			state.chatTop[uid].top=top
		}
	},
	getters:{
			ws(state){
				return state.ws
			},
			// 获取高度
			getChatTop(state){
				return state.chatTop
			}
	},
	
})

export default store