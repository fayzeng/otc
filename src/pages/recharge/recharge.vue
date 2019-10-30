<template>
	<div class="msg">
		<otc-head title="充值">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
			</template>
		</otc-head>

		<div class="wrapper">
			<div class="rcg-box">
				<h3>充值地址</h3>

				<div class="rcg-addr">
					{{adress}}
					<span v-tap="{methods: copy}">复制</span>
				</div>

				<div class="rcg-code" id="code">
					<img :src="codeUrl" >
				</div>

				<p class="rcg-note">或通过其他第三方钱包识别上方二维码完成充值</p>

				<div class="rcg-bg-bottom"></div>
			</div>
		</div>

	
	</div>
</template>
<script>
	import otcHead from '../../components/head';
	import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public';
	import {Toast,Picker,Popup,MessageBox} from 'mint-ui';
	import ScanCode from '../../assets/js/scanCode';

	export default {
		components: {otcHead},
		data() {
			return {
				adress: 'SDFSD24SD6FE2SDF456WE',
				codeUrl: ''
			}
		},
		mounted() {
			this.openwv = Toolkit.win;
			this.isPlus = Toolkit.checker.isPlus();
			this.isPlus.then(() => {
				otc.init();
				this.self = Toolkit.win.getWebview();
				// this.getChannel(); 
				
				ScanCode.qrcode(this.adress, (url) => {
					this.codeUrl = url;
				})
			})

		},
		methods: {
			copy(){
				var bank = this.adress.replace(/\s/g, ""); //清除所有空格
				
				if(!window.plus) return;
				if(plus.os.name == 'Android') {
					var Context = plus.android.importClass("android.content.Context");
					
					var main = plus.android.runtimeMainActivity();
					var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
					Toolkit.win.toast("复制成功");
					return plus.android.invoke(clip, "setText", bank);
				} else {
					var UIPasteboard = plus.ios.importClass("UIPasteboard");
					var generalPasteboard = UIPasteboard.generalPasteboard();
					// 设置/获取文本内容:
					generalPasteboard.setValueforPasteboardType(bank, "public.utf8-plain-text");
					var _val = generalPasteboard.valueForPasteboardType("public.utf8-plain-text");
					//应用在后台的时候获取剪切版数据被系统限制了，只有在app内才能访问接口
					var _val = generalPasteboard.plusCallMethod({
						valueForPasteboardType: "public.utf8-plain-text"
					});
					Toolkit.win.toast("复制成功");
					return _val || '';
				}
			},

			getChannel() {
				Ajax(apis.rechargegetChannel, {
					username: Toolkit.storage.getUserInfo('username'),
					token: Toolkit.storage.getUserInfo('token'),
				}).then(res => {
					for (var i = 0; i < res.data.length; i++) {
						var obj = {};
						if (res.data[i].status == '99') {
							obj.text = res.data[i].name;
							obj.value = res.data[i].code;

						}
						this.chanList.push(obj);
					}
					this.text = this.chanList[0].text; // 设置默认第一张的id
					this.code = this.chanList[0].value;
				}, d => {
					Toolkit.win.toast(d.info);
				})
			}
		}
	}
</script>
<style lang="less">
@assets: '../../assets';
@import '@{assets}/less/import';

.rcg-box{ margin: 1.429rem; background: #fff; border-radius: .714rem .714rem 0 0; position: relative;
	h3{ height: 5rem; line-height: 5rem; text-align: center; font-size: 1.071rem; border-bottom: 1px #f3f3f3 solid;}

	.rcg-addr{ margin-top: 2.143rem; text-align: center; font-size: 1.071rem;
		span{ color: #0075eb; font-size: .857rem;}
	}

	.rcg-code{ width: 14.286rem; height: 14.286rem; margin: 0 auto; margin-top: 1.429rem;
		img{ width: 100%; height: 100%;}
	}

	.rcg-note{ padding: .714rem; text-align: center; font-size: .857rem;}

	.rcg-bg-bottom{ width: 100%; height: 12px; background: url('@{assets}/images/rcg_bg.png') repeat-x; 
		position: absolute; bottom: -11px; background-position: top center;
	}
}
</style>
