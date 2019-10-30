<template>
	<div class="msg">
		<otc-head title="提现">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
			</template>
		</otc-head>

		<div class="wrapper">
			<div class="public_box">
				<div class="public_num">
					<h3>选择币种</h3>
					<div class="money-type">
						<mt-popup :selectItems='paytype' ref="mtPopup" v-on:getData='childval'></mt-popup>
						<span id="Moneytype" v-tap="{methods: showpick}">{{moneyName}}<i class="iconfont slj-more"></i></span>
					</div>
				</div>
				<div class="public_num">
					<h3>提现金额</h3>
					<div class="money_box">
						<input type="number" v-model="payMoney" maxlength="8" placeholder="输入提现金额" />
					</div>
				</div>
			</div>

			<ul class="public_input">
				<li>
					<span>姓名</span>
					<input type="text" v-model="bankName" placeholder="请填写持卡人姓名">

				</li>
				<li>
					<span>银行卡号</span>
					<input type="text" v-model="bankNum" placeholder="请填写银行卡号码">
				</li>

			</ul>

			<div class="list_bank">
				<p>最近输入的卡号: <span></span> </p>
				<p class="bankNo" v-for=" item in bankList" v-tap="{methods: copyList, banknum: item.bank_num}">{{item.bank_num}}</p>
			</div>
			<div class="all_button">
				<button v-tap="{methods: checkParams}">确认支付</button>
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
			otcHead,
			payPassword
		},
		data() {
			return {
				allArray: '',
				moneyName: '', //币种
				moneyId: '', //币种ID
				bankName: '', //姓名
				bankNum: '', //银行卡号
				payMoney: '', //提现金额
				bankList: '', //银行卡列表
				allCurrent: '',
				isDisplay: false,		// 控制密码框的开关
				paytype: []
			}
		},
		created(){ 
			this.allCurrent = Toolkit.storage.getUserAccount('10');
			for (var i = 0; i < this.allCurrent.length; i++) {
				var o = {};
				o.phnumber = this.allCurrent[i].get_currency_info.id;
				o.text = this.allCurrent[i].get_currency_info.character;
				this.paytype.push(o);
			}
			this.moneyName = this.paytype[0].text;
			this.moneyId = this.paytype[0].phnumber;
			
		},
		mounted() {
			this.openwv = Toolkit.win;
			this.isPlus = Toolkit.checker.isPlus();
			this.isPlus.then(() => {
				otc.init();
				this.getUserBankList();
				this.self = Toolkit.win.getWebview();
			})
		},
		methods: {
			showpick() {
				this.$refs.mtPopup.open(); // 父组件调用子组件里的方法
			},
			childval(d) {
				this.moneyName = d.text; // 选择后的回调
				this.moneyId = d.num;
			},
			
			openUrl(d) {
				Toolkit.win.openWV(d.url);
			},
			copyList(x) {
				this.bankNum = x.banknum;
			},
			checkParams() {
				let reg = /^\d+(\.\d{1,2})?$/;
				Toolkit.dom.blur();
				if (!reg.test(this.payMoney)) {
					Toolkit.win.toast('请输入正确的金额');
					return false;
				}
				if (this.payMoney.substr(-1, 1) == '.') {
					this.payMoney = this.payMoney.substr(0, this.payMoney.length - 1);
				}
				if (!this.bankName) {
					Toolkit.win.toast('请输入持卡人姓名');
					return false;
				}
				if (!Vc.isBank(this.bankNum)) {
					Toolkit.win.toast('请输入正确的银行卡号');
					return false;
				}
				var state = localStorage.getItem('OTC_PAYPASS');
				if (!state) {
					MessageBox.confirm('', {
						message: '您未设置支付密码，是否前往设置',
						title: '提示',
						showConfirmButton: true,
						showCancelButton: true,
						cancelButtonClass: 'cancelButton',
						confirmButtonClass: 'confirmButton',
						confirmButtonText: '是',
						cancelButtonText: '否'
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
				this.cash();
			},
			// 提现
			cash() {
				Ajax(apis.cash, {
					username: Toolkit.storage.getUserInfo('username'),
					token: Toolkit.storage.getUserInfo('token'),
					bankAccount: this.bankNum,
					bankUserName: this.bankName,
					currencyId: this.moneyId,
					money: this.payMoney,
					password: md5(this.password),
				}).then(res => {
					Toolkit.win.toast(res.info);
					this.$refs.payPassword.tips(true);
					this.openwv.evalID('homepage.html', 'freshAjax');
					this.self.close('pop-out');	
				}, d => {
					let amount = d.info.replace(/^\s+|\s+$/g, '');
					if(amount == "余额不足"){
						Toolkit.win.toast(d.info);
						this.$refs.payPassword.tips(true);
					}else{
						if(d.code == '5030') this.$refs.pwd.tips(false);
						else Toolkit.win.toast(d.info);
					}
				})

			},
			// 提现通道列表
			getUserBankList() {
				Ajax(apis.getUserBankList, {
					username: Toolkit.storage.getUserInfo('username'),
					token: Toolkit.storage.getUserInfo('token')
				}).then(res => {
					let array = [];
					if (res.data.length > 3) {
						for (var i = 0; i < 3; i++) {
							array.push(res.data[i]);
						}
						this.bankList = array;
					} else {
						this.bankList = res.data;
					}
				}, d => {
					Toolkit.win.toast(d.info);
				})

			},
		}
	}
</script>
<style lang="less">
	@assets: '../../assets';
	@import '@{assets}/less/import';

	.list_bank {
		width: 100%;
		background: #002041;
		padding: 0 1.429rem;
		margin-top: .715rem;
		color: #fff;

		p {
			line-height: 2.144rem;
			font-size: 1.144rem;
		}

		.bankNo {
			line-height: 3.572rem;
			text-indent: 2rem;
			font-size: 16px;
			width: 100%;
		}
	}
</style>
