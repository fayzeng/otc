<template>
	<div class="msg">
		<otc-head title="提币">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
			</template>
		</otc-head>

		<div class="wrapper">
			<div class="write-box">
				<ul class="write-list">
					<li><input type="text" v-model="address" placeholder="提币地址"></li>
					<li><input type="number" v-model="paynumber" placeholder="提币数量" maxlength="8" @blur="getfee"></li>
				</ul>
				<div class="write-remack">
					<span class="l">手续费</span>
					<span class="r">{{process_fee || '0.00'}}({{character}})</span>
				</div>
			</div>

			<div class="all_button">
				<button v-tap="{methods: checkParams}">确认提币</button>
			</div>
			<pay-password :isDisplay="isDisplay" ref="payPassword" @getData="getData"> </pay-password>
		</div>
	</div>
</template>
<script>
	import otcHead from '../../components/head';
	import md5 from 'md5';
	import payPassword from '../../components/pay-password'
	import {Ajax, Toolkit, Vc, otc, apis} from '../../components/public';
	import {Popup, MessageBox} from 'mint-ui';
	import mtPopup from '../../components/picker'
	export default {
		components: {
			mtPopup,
			otcHead,
			payPassword
		},
		data() {
			return {
				address: '', 						// 提币地址
				paynumber: '', 						// 提币数量
				isDisplay: false, 					// 控制密码框的开关
				character: '',
				process_fee: '' 					// 手续费
			}
		},
		mounted() {
			this.openwv = Toolkit.win;
			this.isPlus = Toolkit.checker.isPlus();
			this.isPlus.then(() => {
				otc.init();
				this.self = Toolkit.win.getWebview();
				this.currencyId = this.self.currencyId;
				this.character = Toolkit.storage.getObtain(this.currencyId).character;
			})
		},
		methods: {
			openUrl(d) {
				Toolkit.win.openWV(d.url);
			},
			checkParams() {
				let reg = /^\d+(\.\d{1,2})?$/;
				Toolkit.dom.blur();
				if (!reg.test(this.paynumber)) {
					Toolkit.win.toast('请输入提币数量');
					return false;
				}
				if (this.paynumber.substr(-1, 1) == '.') {
					this.paynumber = this.paynumber.substr(0, this.paynumber.length - 1);
				}
				if (!this.address){
					Toolkit.win.toast('请输入提币地址');
					return false;
				}
				var state = localStorage.getItem('OTC_PAYPASS');
				if (!state) {
					MessageBox.confirm('', {
						message: '您未设置支付密码，是否前往设置',
						title: '提示'
					}).then(action => {
						if (action == 'confirm') {
							this.openwv.openWV('psd_payset.html');
						}
					}).catch(err => {
						if (err == 'cancel') {}
					});
				} else {
					//打開密碼組件
					this.isDisplay = true;
					this.$refs.payPassword.open(true);
				}
			},
			//确认支付
			getData(d){
				this.password = d.pwd.join('');
				this.withdrawMoney();
			},
			// 提现
			withdrawMoney() {
				Ajax(apis.withdrawCash, {
					username: Toolkit.storage.getUserInfo('username'),
					token: Toolkit.storage.getUserInfo('token'),
					addr: this.address,
					num: this.paynumber,
					cid: this.currencyId,
					wid:'',
					password: md5(this.password),
				}).then(res => {
					Toolkit.win.toast(res.info);
					this.$refs.payPassword.tips(true);
					setTimeout(function(){
						Toolkit.win.evalID('homepage.html', 'freshAjax');
						Toolkit.win.evalID('BPB_detail.html', 'freshAjax');	
						Toolkit.win.getWebview().close();
					}, 1000)
				}, d => {
					Toolkit.win.toast(d.info);
					this.$refs.payPassword.tips(true);
				})

			},
			// 提币数量手续费计算
			getfee() {
				Ajax(apis.getTradeFee, {
					username: Toolkit.storage.getUserInfo('username'),
					token: Toolkit.storage.getUserInfo('token'),
					cid: this.currencyId
				}).then(res => {
					this.process_fee = (this.paynumber * res.data.process_percent_fee / 10000 + (res.data.process_fixed_fee - 0)).toFixed(4);
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
	.write-box{ padding: 1.143rem;
		li{ border-bottom: 1px solid #244b72;
			input {flex-wrap: nowrap;text-align: left;height: 3.929rem;line-height: 1.572rem;font-size: 1.286rem;color: #fff;}
        	input:disabled{color:#999;}
		}

		.write-remack{ height: 2.857rem; line-height: 2.857rem; color: #fff;
			span.l{display: inline-block; float: left;}
			span.r{display: inline-block; float: right;}
		}
	}
</style>
