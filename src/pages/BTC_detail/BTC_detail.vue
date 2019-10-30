<template>
	<div class="msg">
		<otc-head :title="btcdetailtitle">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
			</template>
		</otc-head>

		<div class="wrapper">

			<div class="login">
				<div class="iconfont">{{character}} </div>
				<p>{{addDel(billDetail.sonType)}}<em>{{Fixed(billDetail.currency_num)}}</em></p>
			</div>

			<ul class="pualic_detail_list">
				<li>
					<h3>交易单号</h3>
					<span>{{billDetail.id}}</span>
				</li>

				<li>
					<h3>交易单价</h3>
					<span>{{Fixed(billDetail.unit_price)}}</span>
				</li>
				<li>
					<h3>交易类型</h3>
					<span>{{tradeType(billDetail.sonType)}}</span>
				</li>
				<li>
					<h3>交易状态</h3>
					<span class="yt01id">{{resultType(billDetail.status)}}</span>
				</li>
				<li>
					<h3>手续费（CNY）</h3>
					<span>{{Fixed(billDetail.process_fee)}}</span>
				</li>
				<li>
					<h3>相关商品ID</h3>
					<span>{{billDetail.exchange_id}}</span>
				</li>
				<li>
					<h3>对方BTC钱包地址</h3>
					<span class="copy-text" v-tap="{methods: copy}">复制</span>
					<span class="omit" id="omit">{{billDetail.trade_address}}</span>
				</li>
				<!--卖出-->

				<li v-if="billDetail.sonType == '20' ">
					<h3>交易时间</h3>
					<span>{{billDetail.create_time}}</span>
				</li>
				<!--买入-->
				<li v-if="billDetail.sonType == '10' ">
					<h3>下单时间</h3>
					<span>{{billDetail.create_time}}</span>
				</li>
				<li v-if="billDetail.sonType == '10' ">
					<h3>交易时间</h3>
					<span>{{billDetail.update_time}}</span>
				</li>
			</ul>

			<div class="bPB_footer" v-if="(billDetail.sonType == '10' && billDetail.status == '41') ||  (billDetail.sonType == '20' && billDetail.status == '40') ">
				<p v-if="billDetail.sonType == '10' && billDetail.status == '41'">待确认收货</p>
				<p v-else>待确认发货</p>
				<div class="foot-but">
					<div class="pay payone" v-if="billDetail.sonType == '10' && billDetail.status == '41'" v-tap="{methods: collect}">确认收货</div>
					<div class="pay" v-tap="{methods: delivery}" v-else>确认发货</div>
				</div>
			</div>
		</div>
	</div>

</template>
<script>
	import otcHead from '../../components/head';
	import {
		Ajax,
		Toolkit, apis, otc
	} from '../../components/public';
	import {
		Toast,
		Picker,
		Popup,
		MessageBox
	} from 'mint-ui';
	import mtPopup from '../../components/picker'
	export default {
		components: {
			mtPopup,
			otcHead
		},
		data() {
			return {
				billDetail: '',
				btcdetailtitle: '',
				character:''
			}
		},
		mounted() {
			this.openwv = Toolkit.win;
			this.isPlus = Toolkit.checker.isPlus();
			this.isPlus.then(() => {
				otc.init();
				// this.billDetail = Toolkit.storage.getItem('OTC_ACCOUNT');
				this.self = Toolkit.win.getWebview();
				this.billDetail = this.self.billDetail;
				this.character = Toolkit.storage.getObtain(this.billDetail.currency_id).character;
				console.log('详情' + JSON.stringify(this.billDetail))
				if (this.billDetail.sonType == '10') {
					this.btcdetailtitle = '买入详情';
				} else {
					this.btcdetailtitle = '卖出详情';
				}
			})
		},
		methods: {
			Fixed(num) {
				if (!num) return 0.0000;
				return (num - 0).toFixed(4);
			},
			typeText(type, twoType) { //类型判断
				if (type == '50') return '奖励';
				if (type == '60') return '兑换';
				if (type == '10') {
					return '充值';
				} else if (type == '20') {
					return '提现';
				} else if (type == '40') {
					if (twoType == '10') {
						return '转出';
					} else if (twoType == '20') {
						return '转入';
					}
				}
			},
			resultType(type) { //结果判断
				if (type == '10' || type == '40' || type == '41' || type == '42') {
					return '等待交易';
				} else if (type == '10') {
					return '已取消'
				} else if (type == '99') {
					return '交易成功';
				} else if (type == '30') {
					return '交易失败';
				}
			},
			addSubtract(type, twoType) { //上面的加减
				if (type == '10') {
					return '+';
				} else if (type == '20') {
					return '-';
				} else if (type == '40') {
					if (twoType == '10') {
						return '-'
					} else if (twoType == '20') {
						return '+';
					}
				}
			},
			setIcon(type) {
				if (type == '10') return 'slj-shenhezhong1';
				if (type == '20') return 'slj-shenheshibai';
				if (type == '99') return 'slj-shenhechenggong01';

			},
			tradeType(type) {
				if (type == '10') return '买入';
				if (type == '20') return '卖出';
			},
			tradeMoney(moneyType) {
				return mds.getObtain(moneyType).character;
			},
			addDel(type) {
				if (type == '10') return '+';
				if (type == '20') return '-';
			},

			copy() {
				var banknumber = document.getElementById("omit").innerHTML;
				var bank = banknumber.replace(/\s/g, ""); //清除所有空格

				if (!window.plus) return;
				if (plus.os.name == 'Android') {
					var Context = plus.android.importClass("android.content.Context");

					var main = plus.android.runtimeMainActivity();
					var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
					Toolkit.win.toast("复制卡号成功");
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
					console.log("ios复制返回的数据是：", _val);
					Toolkit.win.toast("复制卡号成功");
					return _val || '';
				}
			},
			collect: function() { //确认收货
				this.takeDeliveryGoods();
			},
			delivery: function() { //确认发货
				this.deliveryGoods();
			},

			deliveryGoods() {
				Ajax(apis.deliveryGoods, {
					username: Toolkit.storage.getUserInfo('username'),
					token: Toolkit.storage.getUserInfo('token'),
					tradeInfoId: this.billDetail.id
				}, [], 'test').then(res => {
					let that = this;
					Toolkit.win.toast(res.info);
					this.openwv.evalID('Bpb-detail.html', 'freshAjax');
					this.openwv.evalID('homepage.html', 'freshAjax');
					this.openwv.evalID('transaction.html', ['freshAjax']);
					setTimeout(function() {
						plus.webview.close(that.self, "none", 0)
					}, 500)
				}, d => {
					Toolkit.win.toast(d.info);
				})
			},
			takeDeliveryGoods() {
				Ajax(apis.takeDeliveryGoods, {
					username: Toolkit.storage.getUserInfo('username'),
					token: Toolkit.storage.getUserInfo('token'),
					tradeInfoId: this.billDetail.id
				}).then(res => {
					let that = this;
					Toolkit.win.toast(res.info);
					this.openwv.evalID('Bpb-detail.html', 'freshAjax');
					this.openwv.evalID('homepage.html', 'freshAjax');
					this.openwv.evalID('transaction.html', ['freshAjax']);
					setTimeout(function() {
						plus.webview.close(that.self, "none", 0)
					}, 500)
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

	.login {width: 100%;height: 10.572rem;text-align: center;color: #fff;
		.iconfont {display: inline-block;width: 2.858rem;height: 2.858rem;line-height: 2.858rem;font-size: 1.572rem;padding: 0 9px;margin-top: 1.786rem;font-weight: 800;}
		p {font-size: 1.858rem;font-weight: bold;margin-top: .715rem;line-height: 100%;}
		h5 {margin-top: .715rem;}
	}
	.omit {text-overflow: ellipsis;width: 100px;overflow: hidden;}
	.copy-text {color: #64ACF3;padding: 0 10px;}
	.yt01id {color: #ff8b64;}
	.bPB_footer {width: 100%;height: 4.215rem;line-height: 4.215rem;background: #002041;padding: 0 1.429rem;
		div,p {display: inline-block;}
		p {font-size: 1.071rem;color: #fff;font-weight: bold;}
		.foot-but {float: right;
			div {height: 2.143rem;line-height: 2.143rem;padding: 0 10px;text-align: center;border: 1px solid #4341EF;border-radius: 25px;}
			.pay {width: auto;background: #452AE5;color: #fff;}
			.payone {background: none;}
		}
	}
</style>
