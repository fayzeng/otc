<template>
    <div class="msg">
        <otc-head title="出售">
        	<template slot="header">
        		<i class="iconfont slj-fanhui left otc-back"></i>
        	</template>        
        </otc-head>
        <div class="wrapper">
            <div class="num-box">
				<div class="curr-data">
					<div class="choose-pay">
						<h4>选择售卖币种</h4>
						<div class="money-type">
							<span v-tap="{methods: showpick}">{{selectType.text}} <i class="iconfont slj-xiangyou"></i> </span>
						</div>
					</div>
					<div class="account-num">
						<h1>当前可售卖数量</h1>
						<p>{{selectType.num}}</p>
                	</div>
				</div>
                
                <ul class="sell-input">
                    <li v-show="isPrice">
                        <input type="number" :value="price" placeholder="输入卖出价格（单价）" disabled="disabled" />
                    </li>
					<li v-show="!isPrice">
                        <input type="number" v-model="price" placeholder="输入卖出价格（单价）"  />
                    </li>
                    <li>
                        <input type="number" v-model="num" placeholder="输入卖出数量"/>
                    </li>					
                    <li class="sellout-box">
                        <span class="left">卖出比例{{percentage}}%</span>
						<span class="right" v-tap="{methods: allSell}">全部卖出</span>
                    </li>
                </ul>
                
                <slider @getData="sellMoney" :totalNum="totalNum" :numb="num"></slider>

				<ul  class="sell-input">
					<li class="sellout-box">
						<span class="left">合计</span>
						<span class="right">{{(price * num).toFixed(2)}}(CNY)</span>
					</li>
					<li class="sellout-box">
						<span class="left">手续费</span>
						<span class="right">{{(price * num * poundage * 0.01).toFixed(2)}}(CNY)</span>
					</li>
				</ul>
				<div class="buy-inter">
					<p class="buy-text">买入区间</p>
					<div class="buy-info">
						<input type="number" class="left" v-model="minNum" placeholder="最低买入数量">
						<div class="line"></div>
						<input type="number" name="" id="" class="right" v-model="maxNum" placeholder="最高买入数量">
					</div>
				</div>
				<div class="choose-colle">
					<p class="colle-text">选择收款方式</p>
					<ul class="option-list selected">
					<input type="hidden" id="payType" name="payType" value="1" />
					<li v-for="(value, key) in payIcon" :key='value.id' v-tap="{methods: choose, params: key}">
						<p>
							<i class="iconfont" :class="value.icont_font"></i>
							<span>{{value.type_text}}</span>
						</p>
						<p class="right" v-if="value.choose">
							<i class="iconfont slj-chenggong-yin"></i>
						</p>
					</li>
				</ul>
				</div>
                    <div class="all_button" v-tap.stop.prevent="{methods: sell}" id="all_button">
						<button>确认</button>
                    </div>
            </div>
        </div>
		<type-picker :selectItems='billType' ref="codePicker" @getData='getData'></type-picker>
		<pay-password :isDisplay="isDisplay" @getData="getPwd" ref="pwd"></pay-password>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import payPassword from '../../components/pay-password'
import slider from '../../components/slider'
import { Toast, MessageBox, Checklist } from 'mint-ui';	
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public.js';
import typePicker from '../../components/picker'
import md5 from 'md5';
export default{
	name: 'sell_out',
	components:{otcHead, payPassword, slider, typePicker},
    data(){
        return{
			totalNum: 0,				// 总量
			totalPrice: 0,				// 总价
			price: '',					// 卖出单价
			num: '',					// 卖出数量
			minNum: '',					// 最低购买数量
			maxNum:'',					// 最大购买数量
			w: '',						// 进度条宽高
			totalW: '',					// 背景条宽高
			percentage: 0,				// 百分比
			saleCurrencyId: '1000011',	// 收入币种
			moneyId:'',					// 卖出币种的ID
			isDisplay: false,			// 控制密码框的开关
			password:'',				// 用户输入的密码
			isPrice: false,
			currencyPrice: 0,
			payIcon: [{'id': 10,  'type': 10, 'type_text': '支付宝', 'icont_font': 'slj-zhifubao1', choose: true}, 		// 收款方式的样式合集
			{'id': 20, 'type': 20, 'type_text': '微信', 'icont_font': 'slj-weixin-copy', choose: false}, 
			{'id': 40, 'type': 40, 'type_text': '银联', 'icont_font': 'slj-yinlian', choose: false}],
			selectType: '',			  // 币种选择框 	
			billType: '',		 // 币种所有集合
			poundage: '',        // 手续费汇率
			allPay: [],			 // 所有支付方式的合集
			canPay: [],			 // 用户可用支付方式
         }
    },
	mounted(){
		const isPlus = Toolkit.checker.isPlus();
		isPlus.then(() => {
			let currency  = Toolkit.storage.getItem('OTC_ACCOUNT');
			let localpay  = Toolkit.storage.getItem('OTC_RECEIVEINFO');
			
			this.self = Toolkit.win.getWebview();
			otc.init();
			this.billType = currency.map((item, index) => {
				let obj = {};
				obj.text = item.character;
				obj.value = item.currency_id;
				obj.phnumber = Toolkit.update.fixed(item.amount - 0); 
				return obj;
			})
			this.selectType = this.billType[0];
			this.selectType.num = this.selectType.phnumber;
			this.totalNum = this.selectType.num;
			for(let i = 0; i< this.payIcon.length; i++){
				for(let j =0; j< localpay.length; j++){
					if(this.payIcon[i].type == localpay[j].type){
						this.payIcon[i].id = localpay[j].id;
						this.canPay.push(this.payIcon[i]);
					}
				}
			}
			this.payIcon = this.canPay;
			this.allPay  = this.payIcon[0].id;


			this.$nextTick(() => {
				this.getTradeFee();
			})
			
			

			
		})
	},
	methods:{
		setToFixed: function(num){									// 币种数量的小数位
			return Toolkit.storage.setToFixed(num);
		},
		
		getPwd(d){												// 输完密码之后的操作
			this.password = d.pwd.join('');
			this.putOnShelves();
		},
		putOnShelves(){											// 上架
			Ajax(apis.putOnShelves, {
				username:Toolkit.storage.getUserInfo('username'),
				token:Toolkit.storage.getUserInfo('token'),   
				number: this.num - 0,						// 数量
				unitPrice: this.price,						// 单价
				currencyId: this.selectType.value,					// 币种ID
				password: md5(this.password),
				minimum_purchasing: this.minNum - 0,		// 最低购买数量
				maximum_purchasing: this.maxNum - 0,		// 最高购买数量
				receipts: this.allPay							// 付款方式合集
			}).then(res => {
				Toolkit.win.toast(res.info);
				this.$refs.pwd.tips(true);
				Toolkit.win.evalID('homepage.html', 'freshAjax');
				Toolkit.win.evalID('transaction.html', 'freshAjax');
				// Toolkit.win.evalID('transaction_list.html', 'getExchangeList');
				this.self.close();
			}, d => {
				if(d.code == '5030') this.$refs.pwd.tips(false);
				else Toolkit.win.toast(d.info);
			})			
		},
		// 获取交易手续费
		getTradeFee(){
			Ajax(apis.getTradeFee, {
				cid: this.selectType.value,
				username:Toolkit.storage.getUserInfo('username'),
				token:Toolkit.storage.getUserInfo('token'),
				type: '30'
			}).then(res => {
				this.poundage = res.data.process_percent_fee;
			}, d =>{
				Toolkit.win.toast(d.info);
			})
		},
		sell(){
			Toolkit.dom.blur();
			if(!this.price){
				Toolkit.win.toast('请输入单价');
				return false;
			}  
			if(this.num<=0){
				Toolkit.win.toast('请输入正确的卖出数量');
				return false;
			} 
			if((this.num - 0) > (this.totalNum - 0)){
				Toolkit.win.toast('卖出数量不能大于总数量');
				return false;						
			}
			if(!this.minNum){
				Toolkit.win.toast('请输入最低购买数量');
				return false;
			}
			if(!this.maxNum){
				Toolkit.win.toast('请输入最大购买数量');
				return false;
			}					
			if(!this.minNum || (this.minNum - 0) > (this.num - 0)){
				Toolkit.win.toast('最低购买数量不能大于卖出数量');
				return false;
			}
			if((this.maxNum - 0) < (this.minNum - 0)){
				Toolkit.win.toast('最大购买数量不能小于最低购买数量');
				return false;
			}	
			if((this.maxNum - 0) > (this.num - 0)){
				Toolkit.win.toast('最大购买数量不能大于卖出数量');
				return false;
			}					
			var state = Toolkit.storage.getItem('OTC_PAYPASS');
			if(!state){
				MessageBox.confirm('您未设置支付密码，是否前往设置', 提示).then(action => {
					Toolkit.win.openWV('psd-paySet.html');
				});
			}else{
				this.$refs.pwd.open(true);											
			}
		},
		sellMoney(d){
			this.percentage = d.percentage;
			this.num = d.num;
		},
		allSell(){
			if(this.selectType.num <=0){
				Toolkit.win.toast('可售量为0');
				return;
			}
			this.num = this.selectType.num;
		},
		// 选择收款方式
		choose(data){								
			Toolkit.dom.blur();
			this.allPay = [];
			// let payIcons = this.payIcon;
			this.payIcon[data.params].choose = !this.payIcon[data.params].choose;
			for(var i = 0; i< this.payIcon.length; i++){
				if(this.payIcon[i].choose){
					this.allPay.push(this.payIcon[i].id);
				}
			}
			this.allPay = this.allPay.join(',');
			// this.allPay = this.payIcon.map((item, index) => {
			// 	if(item.choose) return item.id;
			// }).join(',')
		},
		// 打开状态选择
		showpick() {
			this.$refs.codePicker.open(); // 父组件调用子组件里的方法
		},
		// 选择完币种后的操作
		getData(d){
			this.selectType = d;
			this.totalNum = d.num;
			this.getTradeFee();
		},

	}
}
</script>
<style lang="less">
@assets: '../../assets';
@import '@{assets}/less/import';		
	.num-box{ background: #00152A; margin-top: .714rem; padding: 0 1.429rem;
		.curr-data{width: 100%; overflow: hidden;
			.choose-pay{width: 100%; margin-top: 1.786rem; overflow: hidden; text-align: center;
				h4{color: #fff; font-size: 1.071rem;}
				.money-type{margin-top: .714rem; width: 100%; height: 1.429rem; line-height: 1.429rem; font-size: 1.071rem; color: #0075EB;
						i{ color: #6b6d78;}
				}
			}
			.account-num{ padding: .714rem 0; text-align: center; color: #fff;
            	p{ font-size: 2rem;}
        	}
		}
		.account-num{ padding: .714rem 0; text-align: center; color: #fff;
            	p{ font-size: 2rem;}
        	}
        
        .sell-input { padding-bottom: 2.143rem;
            li {border-bottom: .071rem solid #244b72;
                input{width: 80%;height: 4rem;line-height: 4rem;font-size: 1.286rem; background: none; color: #fff;line-height: 1.143rem;}
				label{ color: #fff;}
				.left{float: left;}
				.right{float: right;}
            }
            .sellout-box {padding: 2.143rem 0 .714rem 0;font-size: 1.071rem;color: #fff; border: none !important;
                .sell-two {float:right;}
            }
		}
		.buy-inter{width: 100%; overflow: hidden; color: #fff; font-size: 1rem;
			.buy-text{text-align: center; width: 100%; height: 1.786rem; line-height: 1.786rem;}
			.buy-info{width: 100%; padding: 0 1.429rem; position: relative;
				input{border-bottom: .071rem solid #0075EB; height: 2.857rem; line-height: 2.857rem; width: 7.143rem; text-align: center;}
				.inputPlaceCol(#9BA6B3);
				.left{float: left;}
				.right{float: right;}
				.line{position: absolute; width: 10%; height: .357rem; border-bottom: .071rem solid #0075EB; top: 1.357rem; left: 45%;}
			}

		}
		.choose-colle{width: 100%; overflow: hidden; padding-top: 1.429rem; color: #fff;
			.colle-text{text-align: center; font-size: 1.071rem; height: 2.143rem; line-height: 2.143rem; color: #fff;}
			.option-list{width: 100%;	margin-top: 10px;
				li{width: 100%;height: 55px;background: #003468; /*TODO 颜色值*/border-radius: 5px;margin-bottom: 10px;line-height: 55px;padding: 0 14px;
					p{float: left;text-align: left;width: 50%;
						i{font-size: 26px;vertical-align: middle;}
					}
					.right{float: right;text-align: right; 
						i{font-size: 22px;}
					}
					.cur,.selected li:hover{cursor: pointer;	background: #0075eb;}
				}
			}
		}
    }
</style>