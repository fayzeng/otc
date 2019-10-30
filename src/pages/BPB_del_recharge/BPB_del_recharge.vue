<template>
	<div class="msg">
		<otc-head title="登记">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
			</template>
		</otc-head>

		<div class="wrapper">
			<div class="num-box">
				<div class="account-num">
					<h3>登记数量</h3>
					<div class="money-box">
						<input type="number" name="" id="" value="" v-model="money" @blur="moneytest"/>
					</div>
				</div>
				
				<div class="all_button">
					<button v-tap="{methods: pay}">确认登记</button>
				</div>
			</div>
			
		</div>
	</div>

</template>
<script>
import otcHead from '../../components/head';
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public';
import mtPopup from '../../components/picker'
import {Toast} from 'mint-ui'
export default {
	components: {
		otcHead,
	},
	data() {
		return {
			money: '',
			currencyId: '',
		}
	},
	mounted() {
		this.openwv = Toolkit.win;
		this.isPlus = Toolkit.checker.isPlus();
		this.isPlus.then(() => {
			otc.init();
			this.self = Toolkit.win.getWebview();
			this.currencyId = this.self.currencyId
		})
	},
	methods: {
		moneytest(amt){
			if(!Vc.ismoney(this.money)) {
				Toolkit.win.toast('请输入正确数量');
				return false;
			}
		},
		pay(){
			Toolkit.dom.blur();
			let reg = /^\d+(\.\d{1,4})?$/;
			if(!reg.test(this.money)){
				Toolkit.win.toast('请输入正确的数量');
				return false;
			}
			if(this.money.substr(-1, 1) == '.'){
				this.money = this.money.substr(0, this.money.length-1);
			}					
			this.getpay();
		},
		getpay() {
			Ajax(apis.rechargeForeignCurrency, {
				username: Toolkit.storage.getUserInfo('username'),
				token: Toolkit.storage.getUserInfo('token'),
				amount: this.money,
				currencyId: this.currencyId,
				walletId: ''
			}).then(res => {
				Toolkit.win.toast(res.info);
				this.openwv.evalID('homepage.html', 'freshAjax');
				this.money = '';
				Toolkit.win.getWebview().close();
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
.num-box{ padding: 0 20px; background: #002041; color: #fff; padding-bottom: 20px;
	.account-num{ border-bottom: 1px solid #244b72; text-align: center; padding: 10px 0;
		h3{ line-height: 40px; font-size: 16px;}
		.money-type{ line-height: 40px; padding-bottom: 10px; font-size: 16px; color: #0075EB;}
		.money{
			span{font-size: 15px; font-weight: bold;}
			i {padding-left: 10px;}
		}
		.money-box{
			input{width: 100%;height: 140px;line-height: 100%;font-size: 40px;background: #032F5B;border-radius: 10px;padding: 0 30px;}
			input::-moz-placeholder,textarea::-moz-placeholder{color:#ccc; font-size: 24px;}
		}
	}
	.account-num:last-child{ border-bottom: none;}
}
</style>
