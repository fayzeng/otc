<template>
	<div class="msg">
		<mt-tabbar v-model="selected"  fixed>
			<mt-tab-item id="homepage.html">
				<span class="iconfont slj-wodeqianbao"></span>
				<span class="foot_tab">钱包</span>
			</mt-tab-item>
			<mt-tab-item id="transaction.html">
				<span class="iconfont slj-jiaoyixianxing"></span>
				<span class="foot_tab">交易</span>
			</mt-tab-item>
			<mt-tab-item id="my_index.html">
				<span class="iconfont slj-wode"></span> 
				<span class="foot_tab">我的</span>
			</mt-tab-item>
		</mt-tabbar>
	</div>
</template>
<script>
import {Ajax, Toolkit, otc, apis} from '../../components/public';
import { Toast, Tabbar, TabItem } from 'mint-ui';
export default {
	data() {
		return {
			wvs: ['homepage.html', 'transaction.html', 'my_index.html'],
			selected: '',
			styles: {
				render: 'always',
				top: '0',			// 设置距离顶部的距离
				bottom: '50px'		// 设置距离底部的距离
			}
		}
	},
	mounted() {
		this.win =  Toolkit.win;
		this.isPlus =  Toolkit.checker.isPlus();
		this.isPlus.then(() => {
			this.selected = 'homepage.html';
 
			this._self = this.win.getWebview();
			// this._self.opener().close('none'); // 关闭上一个页面
			
			

			otc.init({
				isBack: true,
				isHome: true,
				// preload: [{
				// 	id: 'transaction.html',
				// 	style: this.styles
				// },{
				// 	id: 'my_index.html',
				// 	style: this.styles
				// }]
			});
		})
	},
	methods: {
		
	},
	watch: {
		// 监听底部按键，打开对应的页面
		selected(viewId){
			const sub = this.win.getWebview(viewId);
			
			if(sub) plus.webview.show(sub);
			else {
				this.win.waitToggle(true);
				const newSub = Toolkit.win.create(viewId, viewId, this.styles);
				setTimeout(() => {
					this._self.append(newSub);
				}, 50);
				
				newSub.onloaded = () => {
					this.win.waitToggle(false);
				}
			}
		}
	}
}
</script>
<style lang="less">
	@assets: '../../../src/assets';
	@import '@{assets}/less/import';
	// @import '@{assets}/font/iconfont.css';
.mint-tabbar {
	background: #002041; -webkit-box-shadow: 0 0 2px rgba(0,0,0,.3); box-shadow: 0 0 2px rgba(0,0,0,.3); -webkit-backface-visibility: hidden; backface-visibility: hidden;
	a {color: #0075EB;}
  .mint-tab-item.is-selected {background:none; color: #fff;}
	.iconfont {
			position: relative;display: block; margin: 0 auto;font-size: 1.572rem;width: 1.572rem; height: 2.143rem;
	}
	.foot_tab {
			display: block; font-size: 0.858rem;
	}
}
	.arrow {
		.box(#000);
		.complete(#000, red);
	}
</style>
