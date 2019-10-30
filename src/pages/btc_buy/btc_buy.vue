<template>
    <div>
       <otc-head title="买入">
       	<template slot="header">
       		<i class="iconfont slj-fanhui left otc-back"></i>
       	</template>        
       </otc-head>
        <div class="wrapper">
			<div class="num-box">
				<div class="buy-explain">
					<h1>可买入区间</h1>
					<p>{{selfData.minimum_purchasing}}--{{selfData.maximum_purchasing}}({{selfData.symbol}})</p>
				</div>
			</div>
			
			<div class="explain-num">
				<h3>买入数量</h3>
				<div class="money-box">
					<input type="number"  v-model="num" placeholder="0" />
				</div>
				<div class="all-num">
					<span class="left">合计</span>
					<span class="right">{{(num * selfData.unit_price).toFixed(2)}}（CNY）</span>
				</div>
			</div>
			<div class="all_button">
				<button v-tap="{methods: payMoney}">去付款</button>
			</div>    
        </div>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import payPassword from '../../components/pay-password'
import { Toast, MessageBox} from 'mint-ui';	
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public.js';
import md5 from 'md5';
export default {
	name: 'btc_buy',
	components:{otcHead, payPassword},
	data(){
		return{
			selfData: '',				// 交易列表传过来的数据
			num: '',					// 购买数量

		}
	},
	mounted(){
		const isPlus = Toolkit.checker.isPlus();
		isPlus.then(() => {
			otc.init();
			this.self = Toolkit.win.getWebview();
			this.selfData = this.self.data;
		})	
	},
	methods:{
		// 点击购买
		payMoney(){
			Toolkit.dom.blur();
			if(!this.num){
				Toolkit.win.toast('请输入购买数量');
				return false;
			}
			if( (this.num - 0) < (this.selfData.minimum_purchasing - 0) ){
				Toolkit.win.toast('不能低于最低购买数量');
				return false;
			}
			if( (this.num - 0 ) > (this.selfData.maximum_purchasing - 0)){
				Toolkit.win.toast('不能多于最大购买数量');
				return false;
			}
			this.prePurchase();
		},
		// 预购买接口
		prePurchase(){
			Ajax(apis.prePurchase, {
				username:Toolkit.storage.getUserInfo('username'),
				token:Toolkit.storage.getUserInfo('token'),   
				exchangeId: this.selfData.id,
				number: this.num,
			}).then(res => {
				this.selfData.allPrice = (this.num * this.selfData.unit_price).toFixed(2);
				Toolkit.win.toast(res.info);
				Toolkit.win.openWV('btc_payment.html', {data: this.selfData, payid: res.data.id}, true);
			}, d => {
				Toolkit.win.toast(d.info);
			})
		}
	},
}
</script>
<style lang='less'>
@assets: '../../assets/';
@import '@{assets}/less/import';
	.num-box{width: 100%; padding: 0 .714rem;}
	.buy-explain{padding: 0 0 1.071rem; text-align: center; border-bottom: 2px solid #244567; width: 100%;
		h1{height: 2.857rem; line-height: 2.857rem; font-size: 1.071rem; color: #6b6d78;}
		p{color: #fff; height: 2.857rem; line-height: 2.857rem; font-size: 1.429rem;}
	}
	.explain-num{width: 100%; padding: 1.786rem .714rem 0;  text-align: center;
		h3{color: #6d6d78; font-size: 1.071rem; }
		.money-box{width: 100%; overflow: hidden; margin-top: .714rem;
			input{width: 100%; padding: 0 1.429rem; height: 10.429rem; line-height: 100%; font-size: 2.857rem; color: #fff; background: #093D73; border-radius: .714rem;}
			input::-moz-placeholder,textarea::-moz-placeholder{color:#ccc; font-size: 2.857rem;}
			input:-ms-input-placeholder,textarea:-ms-input-placeholder{color:#ccc; font-size: 2.857rem;}
			input::-webkit-input-placeholder,textarea::-webkit-input-placeholder{color:#ccc; font-size: 2.857rem;}
		}
		.all-num{width: 100%; overflow: hidden; margin-top: 1.429rem;
			span{color: #fff; font-size: 1rem;}
			.left{float: left;}
			.right{float: right;}
		}
	}
</style>

