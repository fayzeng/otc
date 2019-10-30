<template>
	<div class="msg">
		<otc-head title="订单详情">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
			</template>
		</otc-head>

		<div class="wrapper">
			<div class="detail-box">
				<div class="second-box">
					<p class="det-head"> <span class="left">订单号 {{orderData.trade_info_id}}</span> <time class="right">{{orderData.get_purchase_record && orderData.get_purchase_record.create_time}}</time> </p>
					<div class="det-body">
						<div class="user-info">
							<div class="left"> <img :src="orderData.head_img_src" > </div>
							<div class="right">{{orderData.nickname}}</div>
						</div>
						<div class="curr-info"> <span class="one">{{orderData.all_fee}}</span> <span class="two">(CNY)</span> <span>{{orderData.currency_num}}({{orderData.get_currency_info && orderData.get_currency_info.character}})</span> </div>
						<p class="mer-info">{{orderData.orStyle}}</p>
					</div>
					<div class="det-main">
						<div class="order-pro" v-for="(item, index) in proGress" :class="[index == '3' ? 'none' : '']" :key="item.ids">
							<div class="cirle" :class="[item.time ? 'solid' : '']" > <i class="iconfont slj-dui-copy"></i> </div>
							<div class="order-text">{{item.time}} <span>{{item.text}}</span> </div>
						</div>
					</div> 
					<ul class="det-foot">
						<li>
							<span class="left">交易币种</span>
							<span class="right">{{orderData.get_currency_info && orderData.get_currency_info.character}}</span>
						</li>
						<li>
							<span class="left">卖方收款方式</span>
							<span class="right">{{orderData.payText}}</span>
						</li>
						<li class="none" v-if="orderData.payType == '40' ">
							<span class="left">收款详情</span>
							<span class="right">{{orderData.payInfo}}</span>
						</li>
					</ul>

					<div class="orderImg" v-if="orderData.payType != '40' ">
						<p>收款详情</p>
						<img :src="orderData.payInfo">
					</div>
				</div>
				
			</div>

			 <div class="det-input" v-if="orderData.bigStyle == '10' ">
				<p> <span class="wait">等待付款</span> </p>
				<button v-tap="{methods: checkParams}">已付款</button>
			</div> 
			<div class="det-input" v-if="orderData.bigStyle == '40' && orderData.smallStyle == '0' ">
				<p> <span class="wait">等待发货</span> </p>
				<button v-tap="{methods: remindSellerToDelivery}">提醒发货</button>
			</div> 
		</div>
	</div>
</template>
<script>
	import otcHead from '../../components/head';
	import {Ajax, Toolkit, apis, otc} from '../../components/public';
	import typePicker from '../../components/picker'
	import {Toast } from 'mint-ui';

	export default {
		components: {otcHead,typePicker},
		data() {
			return {
				headimg: require('../../assets/images/03.jpg'),
				proGress:[{text: '订单发起', time: ''}, {text: '确认支付', time: ''},{text: '确认发货',time: ''},{text: '交易完成', time: ''}],
				orderData: '',
			}
		},
		mounted() {
			this.isPlus = Toolkit.checker.isPlus();
			this.isPlus.then(() => {
				otc.init();
                this.self = Toolkit.win.getWebview();
				this.orderData = this.self.data;
				let getRecord = this.orderData.get_purchase_record;
				if(getRecord.user_receive_info){
					this.orderData.payText = getRecord.user_receive_info.type_text;		// 收款方式
					this.orderData.payInfo = getRecord.user_receive_info.info;				// 收款详情
					this.orderData.payType = getRecord.user_receive_info.type;				// 收款类型判断
				}else{
					this.orderData.payText = '系统异常';
					this.orderData.payInfo = '';
					this.orderData.payType = '';
				}
				this.orderData.bigStyle = getRecord.status;
				this.orderData.smallStyle = getRecord.outtime_flag;
				this.proGress[0].time = getRecord.create_time;
				this.proGress[1].time = getRecord.pay_time;
				this.proGress[2].time = getRecord.step_time;
				if(getRecord.status == '99'){this.proGress[3].time = getRecord.update_time;}


			})
		},
		methods: {
			// 点击已付款
			checkParams(){
				Ajax(apis.purchase, {
					username:Toolkit.storage.getUserInfo('username'),
					token:Toolkit.storage.getUserInfo('token'),    
					tradeId: this.orderData.trade_info_id,
					pay_way: this.orderData.get_purchase_record.user_receive_info.id,
				}).then(res => {
					Toolkit.win.toast(res.info);
					Toolkit.win.evalID('buy_order.html', 'freshAjax');
					plus.webview.close(this.self, 'none', 0);
				}, d => {
					Toolkit.win.toast(d.info)
				})
			},
			// 提醒卖家发货
			remindSellerToDelivery(){
				Ajax(apis.remindSellerToDelivery, {
					username:Toolkit.storage.getUserInfo('username'),
					token:Toolkit.storage.getUserInfo('token'),    
					tid: this.orderData.trade_info_id
				}).then(res => {
					Toolkit.win.toast(res.info);
					Toolkit.win.evalID('buy_order.html', 'freshAjax');
					plus.webview.close(this.self, 'none', 0);
				}, d => {
					Toolkit.win.toast(d.info)
				})
			}
		}
	}
</script>
<style lang="less" scoped>
@assets: '../../assets';
@import '@{assets}/less/import';
.detail-box{width: 100%;  padding: 0 .714rem; color: #fff; margin: 0 auto;
	.second-box{width: 100%; background: #002041;  padding: 0 .714rem; border-radius: .714rem; 
		.det-head{width: 100%; height: 3.571rem; line-height: 3.571rem;  overflow: hidden; border-bottom: .143rem solid #052F5A;
			.left{float: left; font-size: 1.071rem;}
			.right{float: right; font-size: .857rem;}
		}
		.det-body{width: 100%; padding: 1.429rem 0;  
			.user-info{height: 1.786rem; width: 100%; overflow: hidden; margin-top: .714rem;
				.left{float: left; height: 1.786rem; width: 50%;
					img{width: 1.786rem; height: 1.786rem; border-radius: 50%; float: right; }
				}
				.right{float: right; height: 1.786rem; line-height:1.786rem;  width: 50%; font-size: 1.071rem; padding-left: .714rem;}
			}
			.curr-info{ width: 100%;  text-align: center;  margin-top: 20px;
				.one{font-size: 2rem; }
				.two{font-size: 1.071rem;}
				.three{font-size:.857rem; }
			}
			.mer-info{width: 100%; padding-top: .714rem; text-align: center; font-size: .857rem; color: #6b6d78; }
		}
		.det-main{width: 100%; overflow: hidden; padding: 0 1.429rem;
			.order-pro{width: 100%; height: 2.929rem; border-left: 1px solid #fff; position: relative;
				.cirle{width: 1rem; height: 1rem; border-radius: 50%; text-align: center; line-height: 1rem; position: absolute;top:5px; left: -8px; border: 1px solid #fff;
					i{ color: #fff; font-size: .857rem;}
				}
				.solid{background: #fff;
					i{color:  #002041;}
				}
				.order-text{height: 2.143rem;  width: 100%; font-size: .857rem; padding-left: 10px; margin-top: -5px;line-height: 24px; padding: 0 20px;
					span{margin-left: .714rem;}
				}

			}
			.none{border:none; 
				// .cirle{width: 9px; height: 9px; border-radius: 50%;top: 4px; left:-4px; background: none;}
				// .order-text{line-height: 1.143rem;}
			}
		}
		.det-foot{width: 100%; overflow: hidden; 
			li{height: 2.143rem; line-height:2.143rem; border-bottom: .143rem solid #052F5A;font-size: .857rem;
				.left{float: left;}
				.right{float: right;}
				img{display: block; width: 7.857rem; height: 7.857rem;}
			}
			.none{border: none;}
		}
		.orderImg{width: 100%; padding-bottom: 1rem;
			p{height: 2.143rem; line-height:2.143rem;font-size: .857rem;}
			img{display: block; width: 7.857rem; height: 7.857rem;margin: 0 auto;}
		}
	}
	
}
.det-input{ width: 100%; left: 0; bottom: 0; height: 3.571rem; background: #052F5A; overflow: hidden; font-size: .857rem; padding: 0 .714rem; border-top: 2px solid #164C98;
	p{float: left; height: 3.571rem; line-height: 3.571rem;
		.wait{color: #6b6d78;}
		.time{margin-left: .357rem; color: #ff8b64;}
	}
	button{float: right; width: 7.857rem; height: 2.5rem; background: #164C98; color: #fff; font-size: 1.071rem; border-radius: 1.429rem; margin-top: .5rem;}
}

</style>
