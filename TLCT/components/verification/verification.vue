<template>
	<view class="verification">
		<view class="bg"></view>
		<movable-area class="box">
			<movable-view direction="all" class="mov" :x="movX" :y="movY" @change="movable">
				<image class="image" src="../../static/login/fruits.png" mode="aspectFill"></image>
			</movable-view>
			<view class="end" :style="{top:endY+'px',left:endX+'px'}">
				<image class="image" src="../../static/login/dish.png" mode="aspectFill"></image>
			</view>
		</movable-area>
		<view class="desc">
			<view class="btns">
				<uni-icons type="arrowthinleft" @click="back"></uni-icons>
				<uni-icons type="reload" @click="refresh"></uni-icons>
			</view>
			<view class="right">
				请将水果移到盘子中间
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			pagetype:{
				type:String,
				default:()=>'login'
			}
		},
		data() {
			return {
				endX:parseInt(Math.random()*220),
				endY:parseInt(Math.random()*220),
				movX:parseInt(Math.random()*260),
				movY:parseInt(Math.random()*260),
				verifySuccessfully:false,//验证成功？
			};
		},
		mounted() {
			this.verifySuccessfully=false
		},
		methods:{
			// 位置改变判断是否成功
			movable(e){
				let _this = this
				if(e.detail.x>this.endX&&e.detail.y>this.endY){
					if(e.detail.x<this.endX+20&&e.detail.y<this.endY+20){
						if(!this.verifySuccessfully){
							this.verifySuccessfully=true
							uni.showToast({
								title:'验证成功',
								success() {
									let timer = setTimeout(()=>{
										clearTimeout(timer)
										uni.$emit('verifySuccessfully-'+_this.pagetype,true)
									},800)
								},
								duration:800,
							})
						}
						
					}
				}
			},
			// 刷新位置
			refresh(){
				this.endX=parseInt(Math.random()*220)
				this.endY=parseInt(Math.random()*220)
				this.movX=parseInt(Math.random()*240)
				this.movY=parseInt(Math.random()*240)
			},
			// 返回
			back(){
				uni.$emit('verifySuccessfully-'+this.pagetype,false)
			}
		}
	}
</script>

<style lang="scss">
.verification{
	$box-width:280px;
	$box-height:280px;
	$box-margin-left:-140px;
	$box-top:16%;
	$end-width:60px;
	$end-height:60px;
	$mov-width:40px;
	$mov-height:40px;
	$desc-height:80upx;
	// 背景
	.bg{
		top: 0;
		position: fixed;
		width: 100%;
		height: 100%;
		opacity: 0.6;
		background-color: $uni-text-color;
		backdrop-filter: blur(5px);
	}
	// 验证盒子
	.box{
		box-shadow: 1px -1px 5px #888888;
		position: fixed;
		width: $box-width;
		height: $box-height;
		border-top-left-radius: 20upx;
		border-top-right-radius: 20upx;
		background-color: $tlct-W-font-color;
		background-image: url(../../static/reg/bg.jpg);
		background-size: auto 100%;
		z-index: 1004;
		left: 50%;
		margin-left: $box-margin-left;
		top: $box-top;
		border-bottom: $tlct-main-font-color;
		.end{
			position: absolute;
			width: $end-width;
			height: $end-height;
			top: 20upx;
			border-radius: 50%;
			transition: .3s;
			.image{
				width: 120%;
				height: 120%;
				margin: -3px 0 0 -3px;
			}
		}
		.mov{
			width: $mov-width;
			height: $mov-height;
			border-radius: 50%;
			z-index: 20;
			.image{
				width: 130%;
				height: 130%;
				margin: -3px 0 0 -3px;
			}
		}
	}
	.desc{
		box-shadow: 1px 1px 5px #888888;
		position: fixed;
		left: 50%;
		margin-left: $box-margin-left;
		top: $box-top;
		width: $box-width;
		margin-top: $box-height;
		border-bottom-left-radius: 20upx;
		border-bottom-right-radius: 20upx;
		// border:1upx solid $tlct-main-bg-color;
		background-color: $tlct-W-font-color;
		height: $desc-height;
		text-align: center;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.right{
			margin-right: 20upx;
			font-size: 24upx;
			color: $tlct-main-bg-color;
		}
		.btns{
			margin-left: 20upx;
			font-size: 24upx;
			width: 20%;
			display: flex;
			justify-content: space-around;
		}
	}
	
	
}
</style>
