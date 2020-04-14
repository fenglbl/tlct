import Vue from 'vue'
import App from './App'
import Amap from './config/js/amap-wx.js'
import {amapKey,aes} from "./config/index.js"
import md5 from "./config/js/md5.js"
import store from "store"

Vue.prototype.$store = store
Vue.prototype.md5 = md5
Vue.prototype.aes = aes

console.log(aes.encryp('5555',amapKey))
Vue.config.productionTip = false

Amap.AMapWX({key:amapKey})
.then(res=>{
	let {data,location} = res
	if(data.infocode==10000){
		let locationInfo = {}
		locationInfo.location= data.regeocode
		locationInfo.city = data.regeocode.addressComponent.city||data.regeocode.addressComponent.province
		Vue.prototype.locationInfo=locationInfo
		console.log(this.location)
	}
})



uni.getSystemInfo({
	success(info) {
		info.titleBarHeight = 0
		// #ifdef H5 || MP
		info.titleBarHeight = 44
		// #endif
		info.tabBarHeight = 50
		Vue.prototype.systemInfo = info
	}
})
// #ifdef MP
uni.authorize({
	scope:"scope.userLocation"
})
// #endif

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
