<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			
		},
		onShow: function() {
			
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	// 设置整个站的背景色
	.uni-app--showtabbar{
		// background-color: $tlct-pages-bg;
	}
	// 设置列表左侧图标上下居中
	.uni-list-item__icon{
		display: flex;
	}
	// 设置搜索搜索左边宽度
	.search-user{
		
		.uni-navbar__header-btns.uni-navbar__content_view{
			width: 60upx !important;
		}
		.uni-navbar__header-btns-left.uni-navbar__header-btns{
			width: 105upx !important;
		}
	}
	
</style>
