<template>
	<div class="msg">
		<otc-head :title="buyselltiele">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
			</template>
		</otc-head>

		<div class="wrapper">

			<div class="login" v-if="billDetail">
				<div class="iconfont" :class="setIcon(billDetail.status)"> </div>
				<p>{{addDel(billDetail.type, billDetail.sonType)}}<em>{{Fixed(billDetail.currency_num)}}</em></p>
			</div>

			<ul class="pualic_detail_list" v-if="billDetail">
				<li>
					<h3>交易单号</h3>
					<span>{{billDetail.id}}</span>
				</li>
				<li>
					<h3>交易类型</h3>
					<span>{{tradeType(billDetail.type, billDetail.sonType)}}</span>
				</li>
				<li>
					<h3>交易时间</h3>
					<span>{{billDetail.create_time}}</span>
				</li>
				<li>
					<h3>交易状态</h3>
					<span class="yt01id">{{resultType(billDetail.status)}}</span>
				</li>
				<li>
					<h3>手续费</h3>
					<span>{{Fixed(billDetail.process_fee)}}</span>
				</li>
				<li>
					<h3>相关商品ID</h3>
					<span>{{billDetail.exchange_id}}</span>
				</li>
				<li>
					<h3>交易币种</h3>
					<span>{{tradeMoney(billDetail.currency_id)}}</span>
				</li>
			</ul>
		</div>
	</div>

</template>
<script>
	import otcHead from '../../components/head';
	import {Ajax, Toolkit, otc, Vc} from '../../components/public';
	import {
		Toast,
		Picker,
		Popup,
		MessageBox
	} from 'mint-ui';
	import mtPopup from '../../components/picker'
	export default {
		data() {
			return {
				billDetail: '',
				buyselltiele: '',
				registertype: true
			}
		},
		mounted() {
			this.openwv = Toolkit.win;
			this.isPlus = Toolkit.checker.isPlus();
			this.isPlus.then(() => {
				otc.init();
				
				this.self = Toolkit.win.getWebview();
				this.billDetail = this.self.billDetail;
				console.log('买入详情页面状态' + JSON.stringify(this.billDetail) )
				if (this.billDetail.type == '30') {
					if (this.billDetail.sonType == '10') {
						this.buyselltiele = '买入详情';
					}
					if (this.billDetail.sonType == '20') {
						this.buyselltiele = '卖出详情';
					}
				} else if (this.billDetail.type == '40') {
					if (this.billDetail.sonType == '10') {
						this.buyselltiele = '转出详情'
					}
					if (this.billDetail.sonType == '20') {
						this.buyselltiele = '转入详情'
					}
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
				if (type == '10' || type == '41' || type == '42' || type == '40') {
					return '等待交易';
				} else if (type == '10') {
					return '已取消'
				} else if (type == '99') {
					return '交易成功';
				} else {
					return '交易失败';
				}
			},
			
			setIcon(type) {
				if (type == '10') return 'slj-shenhezhong1';
				if (type == '20') return 'slj-shenheshibai';
				if (type == '99') return 'slj-shenhechenggong01';
			},
			tradeType(type, twoType) {
				if (type == '30') {
					if (twoType == '10') return '买入';
					if (twoType == '20') return '卖出';
				} else if (type == '40') {
					if (twoType == '10') return '转出';
					if (twoType == '20') return '转入';
				}
			},
			tradeMoney(moneyType) {
				return Toolkit.storage.getObtain(moneyType).character;
			},
			addDel(type, twoType) {
				if (type == '30') {
					if (twoType == '10') return '+';
					if (twoType == '20') return '-';
				} else if (type == '40') {
					if (twoType == '10') return '-';
					if (twoType == '20') return '+';
				}

			}
		}
	}
</script>
<style lang="less">
	@assets: '../../assets';
	@import '@{assets}/less/import';

	.rhidden {display: none;}
	.login {width: 100%;height: 10.572rem;text-align: center;
		.iconfont {display: inline-block;width: 2.858rem;height: 2.858rem;line-height: 2.858rem;border-radius: 50%;background: #61D342;color: #fff;font-size: 22px;text-align: center;margin-top: 1.786rem;}
		p {font-size: 1.858rem;font-weight: bold;margin-top: .715rem;line-height: 100%;color: #fff;}
		h5 {margin-top: .715rem;}
	}
	.yt01id {color: #ff8b64;}
</style>
