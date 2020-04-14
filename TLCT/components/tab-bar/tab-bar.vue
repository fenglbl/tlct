<template>
	<view class="tab-bar">
		<!-- 背景 -->
		<view class="tab-bg"></view>
		<!-- 导航盒子 -->
		<view class="tab-box" :style="{top:systemInfo.titleBarHeight+'px'}">
			<view class="tab-item" :class="{active:selectActive==item.id}" @click="change(item.id)" v-for="(item,index) of opction" :key="index" :style="{color:selectActive==item.id?styleOpction.selectColor:styleOpction.color}" >
				{{item.title}}
			</view>
			<view class="tab-item-gb" :style="{'background-color':styleOpction.selectBgColor,width:selectBgWidth+'px',left:selectBgLeft+'px'}">
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"tab-bar",//顶部导航栏组件
		props:{
			opction:{
				type:Array,
				default:()=>[{id:0,title:'好友'},{id:1,title:'群聊'},{id:2,title:'新朋友'}]
			},
			styleOpction:{
				type:Object,
				default:()=>{return {color:'#333333',selectColor:'#FF7043',selectBgColor:"#FFCCBC"}}
			},
			active:{
				type:Number,
				default:1
			}
			
		},
		data(){
			return{
				selectActive:this.active,//当前选中项
				selectBgWidth:0,//背景宽度
				selectBgLeft:0,//背景左边位置
				timer:null,//延迟时钟对象
				systemInfo:this.systemInfo,//系统信息
			}
		},
		mounted() {
			this.timer = setTimeout(this.getLeft,80)
		},
		methods:{
			change(act){
				this.selectActive = act
				this.$emit('change',act,this.opction[act])
				this.timer = setTimeout(this.getLeft,80)
			},
			getLeft(){
				clearTimeout(this.timer)
				let query = uni.createSelectorQuery().in(this)
				query.select('.tab-item.active').boundingClientRect().exec((doc)=>{
					let {left,width} = doc[0]
					this.selectBgWidth = width*0.6
					this.selectBgLeft = left+(width-width*0.6)/2
				})
			}
		},
		watch:{
			active(){
				this.selectActive=this.active
				this.timer = setTimeout(this.getLeft,80)
			}
		}
	}
</script>

<style lang="scss">
.tab-bar{
	$height:50;

	height: upx($height+10);
	.tab-bg{
		width: 100%;
		height: upx($height+10);
	}
	.tab-box{
		position: fixed;
		z-index: 9999;
		
		left: 0;
		width: 100%;
		height: upx($height+10);
		display: flex;
		align-items: center;
		.tab-item{
			transition: 0.3s;
			line-height: upx($height+10);
			font-size: 26upx;
			flex: 1;
			text-align: center;
		}
		.tab-item-gb{
			position: fixed;
			z-index: -1;
			height: upx($height - 10);
			width: 30%;
			transition: 0.3s;
			border-radius: 30upx;
		}
	}
}
</style>
