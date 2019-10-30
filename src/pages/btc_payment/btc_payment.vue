<template>
	<div class="msg">
		<otc-head title="付款">
			<template slot="header">
				<i class="iconfont slj-fanhui left" v-tap="{methods: cancelOrder}"></i>
			</template>
		</otc-head>
		<div class="wrapper">
			<div class="rcg-box">
				<h3>二维码收款</h3>
				<div class="cae-box">
					<div class="wx-box" v-if="selectType.num == '10' || selectType.num == '20' ">
						<p class="collection-text">对方{{selectType.text}}收款码，付款金额</p>
						<div class="collection-money"><i class="iconfont slj-qian"></i>{{selfData.allPrice}}</div>
						<div class="rcg-code" id="code">
							<img :src="currentPay.info" >
						</div>
						<p class="collection-explain">{{selectType.text}}扫描上方收款码进行收款，付款成功后请上传付款凭证，付款凭证可上传转账信息详情截图，最多可上传三张，并点击下方 <span>“已付款，提醒发货”</span>按钮。</p>
					</div>
					<div class="bank-box" v-if="selectType.num == '40'">
						<p class="collection-text">付款金额</p>
						<div class="collection-money"><i class="iconfont slj-qian"></i>{{selfData.allPrice}}</div>
						<p class="bank-text">对方银行卡信息</p>
						<div class="bank-card">
							<div class="card-people">
								<img :src="selfData.head_img_src || headimg">
								<p>{{currentPay.name}}</p>
							</div>
							<div class="card-num">银行卡号 {{currentPay.info}}</div>
						</div>
					</div>
				</div>
				<div class="choose-pay">
					<h4>选择支付方式</h4>
					<div class="money-type">
						<span v-tap="{methods: showpick}">{{selectType.text}} <i class="iconfont slj-xiangyou"></i> </span>
					</div>
				</div>
				<div class="copy-text">
					<p class="copy-head"> <span class="left">备注说明</span> <span class="right">复制</span> </p>
					<p class="copy-body">123132546</p>
				</div>
				<div class="rcg-bg-bottom"></div>
			</div>
			<div class="all_button">
				<button v-tap="{methods: checkParams}">已付款，提醒卖家发货</button>
			</div> 
		</div>
		<div class="collection-exit" v-if="cancel">
			<div class="cancel-box">
				<h1>提示</h1>
				<h3>返回将取消订单，确认取消？</h3>
				<div class="cancel-prompt"><i class="iconfont slj-jinggao"></i>取消后需重新购买 </div>
				<ul class="cancel-text">
					<li class="none" v-tap="{methods: canPay}">确认取消</li>
					<li v-tap="{methods: conPay}">继续支付</li>
				</ul>
			</div>
		</div>
		<type-picker :selectItems='billType' ref="codePicker" @getData='getData'></type-picker>
	</div>
</template>
<script>
	import otcHead from '../../components/head';
	import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public';
	import {Toast,Picker,Popup,MessageBox} from 'mint-ui';
	import ScanCode from '../../assets/js/scanCode';
	import typePicker from '../../components/picker'

	export default {
		components: {otcHead, typePicker},
		data() {
			return {
				adress: 'SDFSD24SD6FE2SDF456WE',
				codeUrl: '',
				cancel: false,									 // 控制取消弹框
				headimg: require('../../assets/images/03.jpg'),					 // 默认头像
				selfData:'',									// 上个页面传过来的数据
				billType: '',									// 支付方式合集
				selectType: '',									//  当前显示的支付方式
				currentPay:'',  									// 当前支付方式的的资料
			}
		},
		mounted() {
			this.openwv = Toolkit.win;
			this.isPlus = Toolkit.checker.isPlus();
			this.isPlus.then(() => {
				otc.init({
					isBack: true,
					isHome: true,
				});
				this.self = Toolkit.win.getWebview();
				this.selfData = this.self.data;
				this.billType = this.selfData.user_receive_info_array.map((item, index) => {
					let obj = {};
					obj.text = item.type_text;
					obj.value = item.id;
					obj.phnumber = item.type;
					return obj;
				});
				this.selectType = this.billType[0];
				this.selectType.num = this.selectType.phnumber;
				this.getPay();
				// this.getUserReceiveInfo();
				// ScanCode.qrcode(this.adress, (url) => {
				// 	this.codeUrl = url;
				// })
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
			// 点击取消订单
			canPay(){																		
				this.self.close();
			},
			// 点击继续支付
			conPay(){																		
				this.cancel = false;
			},
			// 点击左上角返回按钮
			cancelOrder(){																	
				this.cancel = true;
			},
			// 打开状态选择
			showpick() {
				this.$refs.codePicker.open(); // 父组件调用子组件里的方法
			},
			// 选择支付方式后的操作
			getData(d){
				this.selectType = d;
				this.getPay();
			},
			// 获取卖家收款方式
			getUserReceiveInfo(){
				Ajax(apis.getUserReceiveInfo, {
					username:Toolkit.storage.getUserInfo('username'),
					token:Toolkit.storage.getUserInfo('token'),  
					eid: this.selfData.id    
				}).then(res => {
					// Toolkit.win.toast(res.info);
				}, d => {
					Toolkit.win.toast(d.info);
				})

			},
			// 点击已付款
			checkParams(){
				Ajax(apis.purchase, {
					username:Toolkit.storage.getUserInfo('username'),
					token:Toolkit.storage.getUserInfo('token'),    
					tradeId: this.self.payid,
					pay_way: this.selectType.value,
				}).then(res => {
					let _this = this;
					Toolkit.win.toast(res.info);
					Toolkit.win.closeWV(['btc_buy.html']);
					setTimeout(() => {
						_this.self.close();
					}, 500)
					// Toast(res.info);
				}, d => {
					Toolkit.win.toast(d.info)
				})
			},
			// 获取相应的付款方式
			getPay(){
				let allPay = this.selfData.user_receive_info_array;
				for(let i =0; i<allPay.length; i++){
					if(allPay[i].id == this.selectType.value){
						this.currentPay = allPay[i];
					}
				}
				console.log('currentPay' + this.currentPay);
			},
		}
	}
</script>
<style lang="less">
@assets: '../../assets';
@import '@{assets}/less/import';
.rcg-box{ margin: 1.429rem; background: #fff; border-radius: .714rem .714rem 0 0; position: relative;
	h3{ height: 5rem; line-height: 5rem; text-align: center; font-size: 1.071rem; border-bottom: 1px #f3f3f3 solid;}
	.cae-box{width: 100%; height: 28.571rem; overflow: hidden;
		.collection-text{width: 100%; text-align: center; margin-top: 2.143rem; font-size: 1rem;}
			.collection-money{width: 100%; margin: 1.429rem 0; height: 2.143rem; text-align: center; line-height: 2.143rem; color: #4199f0; font-size: 1.786rem; position: relative;
				i{font-size: .929rem; color: #444444; margin-right: 1.071rem; }
			}
		.wx-box{height: 28.571rem; width: 100%;
			.collection-explain{width: 100%; padding: .714rem; font-size: .786rem; color: #585965; text-indent: 1.786rem;
				span{color: #1a1a1a; font-weight: 800;}
			}
			.rcg-code{ width: 14.286rem; height: 14.286rem; margin: 0 auto; margin-top: 1.429rem;
				img{ width: 100%; height: 100%;}
			}
		}
		.bank-box{height: 28.571rem; width: 100%;
			.bank-text{width: 100%; text-align: center; font-size: .857rem; color: rgb(34,34,34); }
			.bank-card{width: 17.5rem; height: 7.857rem;   margin: 1.429rem auto 0;
				.card-people{background: #0075EB;height: 3.143rem; width: 100%; border-radius: .571rem .571rem 0 0;
					img{float: left; width:2.429rem; height:2.429rem; border-radius: 50%; margin-top: .357rem; margin-left: .714rem;}
					p{height:3.143rem;; line-height:3.143rem;; color: #fff; font-size: 1.071rem; float: left; margin-left: .714rem;}
				}
				.card-num{width: 100%; height: 4.714rem; border: 1px solid #F1F1F1; line-height: 4.714rem; text-align: center; font-size: 14px;  font-weight: 800; border-radius: 0 0  .571rem  .571rem;}

			}
		}
	}
	.choose-pay{width: 100%; margin-top: 1.786rem; overflow: hidden; text-align: center;
		h4{color: #6b6d78; font-size: .857rem;}
		.money-type{margin-top: .714rem; width: 100%; height: 1.429rem; line-height: 1.429rem; font-size: 1.071rem; color: #0075EB;
				i{ color: #6b6d78;}
		}
	}
	.copy-text{width: 100%; margin-top: 1.786rem;  overflow: hidden; padding: 0 .714rem;
		.copy-head{width: 100%; font-size: .857rem; line-height: 1.071rem; color: #6b6d78; height: 1.071rem;
			.left{float: left;}
			.right{float:right; color: #0075eb;}
		}
		.copy-body{width: 100%; font-size: .786rem; line-height: 1.071rem; text-align: center; color: #1a1a1a; margin: .714rem 0 1.429rem 0;}

	}
	

	.rcg-bg-bottom{ width: 100%; height: 12px; background: url('@{assets}/images/rcg_bg.png') repeat-x; 
		position: absolute; bottom: -11px; background-position: top center;
	}
}
.collection-exit{position: fixed; top: 0; left: 0; width: 100%; height: 100%; background:rgba(0,0,0,0.7); 
	.cancel-box{position: absolute; text-align: center; width: 80%; height: 14.071rem; left: 10%; top: 30%; background: #00152A; border-radius: .714rem; padding-top: 2.143rem ;color: #fff;
		h1{width: 100%; font-size: 1.286rem;  }
		h3{font-size: 1.071rem; line-height: 2.143rem; margin-top: .714rem;}
		.cancel-prompt{width: 100%; font-size: .929rem; color: #6b6d78; line-height: 1.071rem; padding-top: .357rem;
			i{margin-right: .357rem;}
		}
		.cancel-text{width: 100%; height: 3.929rem; overflow: hidden; border-top: .071rem solid #0B2541; margin-top: 1.857rem;
			li{width: 50%; height: 100%; float: left; border-left: 1px solid #0B2541; font-size: 1.286rem; line-height: 3.929rem;}
			.none{border: none; color: #6b6d78;}

		}

	}
}
</style>
