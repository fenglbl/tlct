(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-userInfo-userInfo"],{"202d":function(t,a,e){"use strict";e.r(a);var n=e("b7db"),i=e("4540");for(var r in i)"default"!==r&&function(t){e.d(a,t,(function(){return i[t]}))}(r);e("5750");var o,s=e("f0c5"),c=Object(s["a"])(i["default"],n["b"],n["c"],!1,null,"cf32c7cc",null,!1,n["a"],o);a["default"]=c.exports},"25f8":function(t,a,e){"use strict";var n=e("ee27");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var i=n(e("d0af")),r=e("f2e0"),o={data:function(){return{opction:{},userData:{},userType:""}},onLoad:function(t){this.opction=t},onReady:function(){var t=this;this.$refs.loading.open();var a=this.opction,e=a.uid,n=a.type;this.userType=n,(0,r.getUserInfo)(e,1).then((function(a){var e=(0,i.default)(a,2),n=e[0],r=e[1].data;t.$refs.loading.close(),n?uni.showToast({title:"网络错误",icon:"none"}):0==r.code&&(t.userData=r.data)}))},methods:{addUser:function(){uni.navigateTo({url:"../addSend/addSend?flid="+this.userData.uid+"&nick="+this.userData.userName})}}};a.default=o},3907:function(t,a,e){"use strict";e.r(a);var n=e("6902"),i=e("e9a7");for(var r in i)"default"!==r&&function(t){e.d(a,t,(function(){return i[t]}))}(r);e("d681");var o,s=e("f0c5"),c=Object(s["a"])(i["default"],n["b"],n["c"],!1,null,"516efc47",null,!1,n["a"],o);a["default"]=c.exports},4540:function(t,a,e){"use strict";e.r(a);var n=e("e6cc"),i=e.n(n);for(var r in n)"default"!==r&&function(t){e.d(a,t,(function(){return n[t]}))}(r);a["default"]=i.a},"46a7":function(t,a,e){var n=e("a76a");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var i=e("4f06").default;i("0a604784",n,!0,{sourceMap:!1,shadowMode:!1})},4837:function(t,a,e){"use strict";var n,i=function(){var t=this,a=t.$createElement,e=t._self._c||a;return t.show?e("v-uni-view",{staticClass:"mask",class:"true"==t.mask||1==t.mask?"mask-show":"",on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.Mclose.apply(void 0,arguments)},touchmove:function(a){a.stopPropagation(),a.preventDefault(),arguments[0]=a=t.$handleEvent(a),t.preventTouchMove.apply(void 0,arguments)}}},[e("v-uni-view",{staticClass:"container"},[e("loading1")],1),e("v-uni-view",{staticClass:"title"},[t._v(t._s(t.text))])],1):t._e()},r=[];e.d(a,"b",(function(){return i})),e.d(a,"c",(function(){return r})),e.d(a,"a",(function(){return n}))},"4e27":function(t,a,e){"use strict";e.r(a);var n=e("4837"),i=e("9d1f");for(var r in i)"default"!==r&&function(t){e.d(a,t,(function(){return i[t]}))}(r);e("d598");var o,s=e("f0c5"),c=Object(s["a"])(i["default"],n["b"],n["c"],!1,null,"79be093f",null,!1,n["a"],o);a["default"]=c.exports},5750:function(t,a,e){"use strict";var n=e("46a7"),i=e.n(n);i.a},6902:function(t,a,e){"use strict";var n={"uni-icons":e("37b0").default,"w-loading":e("4e27").default},i=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("v-uni-view",{staticClass:"user-info"},[e("v-uni-view",{staticClass:"pages-bg",staticStyle:{position:"fixed","z-index":"-1","background-color":"#EEEEEE",width:"100%",height:"100%"}}),e("v-uni-view",{staticClass:"header"},[e("v-uni-view",{staticClass:"img"},[e("v-uni-image",{staticStyle:{width:"100%",height:"100%"},attrs:{src:t.userData.avatar,mode:"scaleToFill"}})],1),e("v-uni-view",{staticClass:"desc"},[e("v-uni-view",{staticClass:"title"},[t._v(t._s(t.userData.userName))]),e("v-uni-view",{staticClass:"city"},[t._v("地区："+t._s(t.userData.city))])],1)],1),e("v-uni-view",{staticClass:"remark"},[t._v("设置备注和标签"),e("v-uni-view",{staticClass:"icon"},[e("uni-icons",{attrs:{type:"arrowright"}})],1)],1),e("v-uni-view",{}),e("v-uni-view",{staticClass:"add-btn",on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.addUser.apply(void 0,arguments)}}},[t._v("添加好友")]),e("w-loading",{ref:"loading",attrs:{text:"加载中……",mask:"false"}})],1)},r=[];e.d(a,"b",(function(){return i})),e.d(a,"c",(function(){return r})),e.d(a,"a",(function(){return n}))},"88b7":function(t,a,e){var n=e("24fb");a=n(!1),a.push([t.i,'.mask[data-v-79be093f]{\r\n  /* pointer-events: none; */position:fixed;z-index:99999;top:0;left:0;right:0;bottom:0;height:100vh;width:100vw;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-flex-wrap:wrap;flex-wrap:wrap}.mask.mask-show[data-v-79be093f]{background:rgba(7,17,27,.3)}.title[data-v-79be093f]{color:#ff7043;font-size:%?28?%}\r\n/* loading加载动画的css */.container[data-v-79be093f]{height:%?28?%;width:%?200?%}.popsicle[data-v-79be093f]{height:%?180?%;width:%?120?%;border-radius:%?55?% %?55?% %?10?% %?10?%;position:relative;display:block;margin:0 auto;overflow:hidden;-webkit-animation:float-data-v-79be093f 2s ease-in infinite alternate;animation:float-data-v-79be093f 2s ease-in infinite alternate}.popsicle[data-v-79be093f]:before{content:"";height:120%;width:140%;position:absolute;left:-20%;top:-10%;background-image:-webkit-linear-gradient(bottom,#f63999 25%,#30dcf6 0,#30dcf6 50%,#f2d200 0,#f2d200 75%,#70ca5c 0);background-image:linear-gradient(0deg,#f63999 25%,#30dcf6 0,#30dcf6 50%,#f2d200 0,#f2d200 75%,#70ca5c 0);display:block;-webkit-transform:rotate(-20deg);transform:rotate(-20deg);-webkit-animation:magic-data-v-79be093f 2.5s linear infinite;animation:magic-data-v-79be093f 2.5s linear infinite}@-webkit-keyframes magic-data-v-79be093f{to{background-position:0 %?210?%}}@keyframes magic-data-v-79be093f{to{background-position:0 %?210?%}}.popsicle[data-v-79be093f]:after{content:"";position:absolute;left:%?10?%;bottom:%?10?%;width:%?13?%;height:%?120?%;border-radius:%?50?%;background:hsla(0,0%,100%,.35)}.stick[data-v-79be093f]{width:%?38?%;height:%?45?%;background:#e09c5f;border-radius:0 0 %?12?% %?12?%;display:block;margin:0 auto;-webkit-animation:float-data-v-79be093f 2s ease-in infinite alternate;animation:float-data-v-79be093f 2s ease-in infinite alternate}.stick[data-v-79be093f]:after{display:block;content:"";width:100%;height:%?14?%;background:rgba(0,0,0,.4)}@-webkit-keyframes float-data-v-79be093f{to{-webkit-transform:translateY(%?20?%);transform:translateY(%?20?%)}}@keyframes float-data-v-79be093f{to{-webkit-transform:translateY(%?20?%);transform:translateY(%?20?%)}}.shadow[data-v-79be093f]{width:%?124?%;height:%?35?%;background:rgba(0,0,0,.2);border-radius:%?60?%/%?22?%;display:block;margin:0 auto;-webkit-transform:scaleY(.7) translateY(%?30?%);transform:scaleY(.7) translateY(%?30?%);-webkit-animation:shad-data-v-79be093f 2s ease-in infinite alternate;animation:shad-data-v-79be093f 2s ease-in infinite alternate}@-webkit-keyframes shad-data-v-79be093f{to{-webkit-transform:scaleX(.9) scaleY(.7) translateY(%?30?%);transform:scaleX(.9) scaleY(.7) translateY(%?30?%)}}@keyframes shad-data-v-79be093f{to{-webkit-transform:scaleX(.9) scaleY(.7) translateY(%?30?%);transform:scaleX(.9) scaleY(.7) translateY(%?30?%)}}',""]),t.exports=a},"9bef":function(t,a,e){var n=e("24fb");a=n(!1),a.push([t.i,'@charset "UTF-8";\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */.user-info .header[data-v-516efc47]{background-color:#fff;padding:%?50?% %?20?%;display:-webkit-box;display:-webkit-flex;display:flex;border-bottom:%?0.5?% solid #c8c7cc}.user-info .header .img[data-v-516efc47]{width:%?100?%;height:%?100?%;border-radius:%?12?%;overflow:hidden}.user-info .header .desc[data-v-516efc47]{font-size:%?24?%;margin-left:%?20?%}.user-info .header .desc .title[data-v-516efc47]{font-size:%?32?%;font-weight:600}.user-info .header .desc .city[data-v-516efc47]{margin-top:%?10?%}.user-info .remark[data-v-516efc47]{display:-webkit-box;display:-webkit-flex;display:flex;padding:%?30?% %?20?%;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center;font-size:%?26?%;margin-bottom:%?16?%;background-color:#fff}.user-info .add-btn[data-v-516efc47]{background-color:#fff;padding:%?30?% %?20?%;font-size:%?26?%;text-align:center;font-weight:600;color:#ff7043}',""]),t.exports=a},"9d1f":function(t,a,e){"use strict";e.r(a);var n=e("a09a"),i=e.n(n);for(var r in n)"default"!==r&&function(t){e.d(a,t,(function(){return n[t]}))}(r);a["default"]=i.a},a09a:function(t,a,e){"use strict";var n=e("ee27");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var i=n(e("202d")),r={name:"w-loading",components:{loading1:i.default},props:{text:String,mask:Boolean|String,click:Boolean|String},data:function(){return{show:!1}},methods:{preventTouchMove:function(){console.log("stop user scroll it!")},Mclose:function(){"false"!=this.click&&0!=this.click||(this.show=!1)},open:function(){this.show=!0},close:function(){this.show=!1}}};a.default=r},a76a:function(t,a,e){var n=e("24fb");a=n(!1),a.push([t.i,".loading13[data-v-cf32c7cc]{width:%?45?%;position:relative;margin:auto}.loading13 uni-view[data-v-cf32c7cc]{display:block;position:absolute;bottom:%?0?%;width:%?9?%;height:%?5?%;background:coral;-webkit-animation:loading13-data-v-cf32c7cc 1.5s infinite ease-in-out;animation:loading13-data-v-cf32c7cc 1.5s infinite ease-in-out}.loading13 uni-view[data-v-cf32c7cc]:nth-child(2){left:%?11?%;-webkit-animation-delay:.2s;animation-delay:.2s}.loading13 uni-view[data-v-cf32c7cc]:nth-child(3){left:%?22?%;-webkit-animation-delay:.4s;animation-delay:.4s}.loading13 uni-view[data-v-cf32c7cc]:nth-child(4){left:%?33?%;-webkit-animation-delay:.6s;animation-delay:.6s}.loading13 uni-view[data-v-cf32c7cc]:nth-child(5){left:%?44?%;-webkit-animation-delay:.8s;animation-delay:.8s}@-webkit-keyframes loading13-data-v-cf32c7cc{0%{height:%?5?%;-webkit-transform:translateY(%?0?%);transform:translateY(%?0?%);background:#ff0}25%{height:%?30?%;-webkit-transform:translateY(%?15?%);transform:translateY(%?15?%);background:#ff7043}50%{height:%?5?%;-webkit-transform:translateY(%?0?%);transform:translateY(%?0?%);background:#ff7043}100%{height:%?5?%;-webkit-transform:translateY(%?0?%);transform:translateY(%?0?%);background:#ff0}}@keyframes loading13-data-v-cf32c7cc{0%{height:%?5?%;-webkit-transform:translateY(%?0?%);transform:translateY(%?0?%);background:#ff0}25%{height:%?30?%;-webkit-transform:translateY(%?15?%);transform:translateY(%?15?%);background:#ff7043}50%{height:%?5?%;-webkit-transform:translateY(%?0?%);transform:translateY(%?0?%);background:#ff7043}100%{height:%?5?%;-webkit-transform:translateY(%?0?%);transform:translateY(%?0?%);background:#ff0}}",""]),t.exports=a},b7db:function(t,a,e){"use strict";var n,i=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("v-uni-view",{staticClass:"loading13"},[e("v-uni-view"),e("v-uni-view"),e("v-uni-view"),e("v-uni-view"),e("v-uni-view")],1)},r=[];e.d(a,"b",(function(){return i})),e.d(a,"c",(function(){return r})),e.d(a,"a",(function(){return n}))},bfe9:function(t,a,e){var n=e("9bef");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var i=e("4f06").default;i("60b540f4",n,!0,{sourceMap:!1,shadowMode:!1})},d598:function(t,a,e){"use strict";var n=e("e161"),i=e.n(n);i.a},d681:function(t,a,e){"use strict";var n=e("bfe9"),i=e.n(n);i.a},e161:function(t,a,e){var n=e("88b7");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var i=e("4f06").default;i("5fcceea2",n,!0,{sourceMap:!1,shadowMode:!1})},e6cc:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var n={name:"loading13",data:function(){return{}}};a.default=n},e9a7:function(t,a,e){"use strict";e.r(a);var n=e("25f8"),i=e.n(n);for(var r in n)"default"!==r&&function(t){e.d(a,t,(function(){return n[t]}))}(r);a["default"]=i.a}}]);