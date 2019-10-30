<template>
	<div class="msg">
		<otc-head title="售卖详情">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
				<span class="right" v-if="msgshelf.status == '10' " v-tap="{methods: offLoading}">取消售卖</span>
			</template>
		</otc-head>

		<div class="wrapper">
			<div class="shelf login">
				<div class="shelf-amout">
					<div class="shelf-amout-money">
						<div class="shelf-amout-state">
							<span class="iconfont slj-gouwucheman"> <span>{{msgshelf.statusText}}</span></span>
						</div>
						<div class="zhuanhuan"><i class="iconfont slj-zhuanhuan"></i></div>
						<div class="all-amount">
							<h1>{{msgshelf.currency_all_num}} <span>({{msgshelf.character}})</span></h1>
							<h4>{{msgshelf.amount}}(CNY)</h4>
						</div>
					</div>
				</div>
				<ul>
					<li>
						<span>已售</span>
						<p>{{msgshelf.currency_sale_num}}({{msgshelf.character}})</p>
					</li>
					<li>
						<span>上架时间</span>
						<p>{{msgshelf.create_time}}</p>
					</li>
					<li>
						<span>手续费</span>
						<p>{{msgshelf.currency_blocked_proccess_num}}</p>
					</li>
					<li>
						<span>单价</span>
						<p>{{msgshelf.unit_price}}(CNY)</p>
					</li>
				</ul>

			</div>

			<div class="home-title">
				<span>详细信息</span>
			</div>

			<div class="bigbox">
				<mt-loadmore :bottom-method="loadBottom"  :bottomPullText="'上拉加载'" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="controlAuto">
					<ul class="del-box br" v-for="item in exchange" :key="item.ids">
						<li>
							<div class="user-img">
								<img :src="item.head_img_src || headimg" >
								<span>{{item.nickname}}</span>
							</div>
							
							<!-- <p class="time">{{item.create_time}}</p> -->
							<p> <span class="qwer">{{item.trade_info_id}}</span> <span class="qwe">{{item.create_time}}</span> </p>
						</li>
						<li>
							<span class="amount">{{item.currency_num}} <span>({{msgshelf.character}})</span><i> ({{item.amount}} CNY)</i></span>
							<p>{{item.statusTop}}</p>
						</li>
						<li>
							<span>交易方式</span>
							<p class="look">{{item.payText}}</p>
						</li>
						<li v-if="item.get_trade_list.status != '40' ">
							<!-- <span class="wait-pay">12:00:10</span> -->
							<p>{{item.statusText}}</p>
						</li>
						<li v-if="item.get_trade_list.status == '40' ">
							<span class="paid">买家已付款至您的支付宝账号，请确认收到货款后发货。</span>
						</li>
						<li v-if="item.get_trade_list.status == '40' ">
							<button v-tap="{methods: deliveryGoods, data: item}">确认发货</button>
							<!-- <input type="text" value="确认发货" readonly="readonly" /> -->
						</li>
					</ul>
				</mt-loadmore>
			</div>
			
		</div>


	</div>
</template>
<script>
	import otcHead from '../../components/head';
	import {Toast,MessageBox,Loadmore} from 'mint-ui';
	import {Ajax,Toolkit,otc,Vc,apis} from '../../components/public.js'
	export default {
		name: 'sellout_del_delite',
		components: {otcHead},
		data() {
			return {
				msgshelf: '', // 交易记录的数据
				headimg: require('../../assets/images/03.jpg'),
				exchange: [],
				PAGE: 1,
				size: 10,
				controlAuto: true,
				allLoaded: false, // 上拉加载功能的开关

			}
		},
		mounted() {
			const isPlus = Toolkit.checker.isPlus();
			isPlus.then(() => {
				otc.init();
				this.self = Toolkit.win.getWebview();
				this.msgshelf = this.self.data;
				this.msgshelf.character = this.msgshelf.get_currency_info.character;
				this.msgshelf.amount = Toolkit.update.fixed(this.msgshelf.amount);
				this.msgshelf.currency_blocked_proccess_num = Toolkit.update.fixed(this.msgshelf.currency_blocked_proccess_num);
				this.getTradeList();
			})
		},
		methods: {
			// 下拉加载
			loadBottom(){
				if (this.exchange.length > 1) { // methods的loadBottom方法会先于mounted运行。
					this.PAGE++;
					this.getTradeList();
				}
			},
			sellStatus: function(s) { // 货币的售卖状态
				if (s == '10') return '售卖中';
				if (s == '20') return '已下架';
				if (s == '99') return '已售完';
			},
			getCurrency: function(id) { // 获取币种符号
				return Toolkit.storage.getObtain(id).character;
			},
			openUrl(d) { // 点开交易记录
				d.params.unit_price = this.msgshelf.unit_price;
				d.params.type = '20';
				Toolkit.win.openWV(d.url, {
					billDetail: d.params
				}, true);
			},
			offLoading() { // 下架
				Ajax(apis.offLoading, {
					username: Toolkit.storage.getUserInfo('username'),
					token: Toolkit.storage.getUserInfo('token'),
					sign: '',
					exchangeId: this.msgshelf.id,
				}).then(res => {
					Toolkit.win.toast(res.info);
					Toolkit.win.evalID('sale_management.html', 'freshAjax');
					this.self.close();
				}, d => {
					Toolkit.win.toast(d.info);
				})
			},
			// 确认发货
			deliveryGoods(d){
				Ajax(apis.deliveryGoods, {
					username: Toolkit.storage.getUserInfo('username'),
					token: Toolkit.storage.getUserInfo('token'),
					sign: '',
					tradeInfoId: d.data.trade_info_id
				}).then(res => {
					Toolkit.win.toast(res.info);
					this.self.close();
				}, d => {
					Toolkit.win.toast(d.info);
				})
			},
			getTradeList(isRead) { // 上架详情
				Ajax(apis.getTradeList, {
					username: Toolkit.storage.getUserInfo('username'),
					token: Toolkit.storage.getUserInfo('token'),
					exchangeId: this.msgshelf.id,
					size: this.size,
					page: this.PAGE
				}).then(res => {
					const length = res.data.length;
					if(this.PAGE == 1){
						this.exchange = [];
					}
					if(isRead) this.exchange = this.dealData(res.data);
					else this.exchange.push(...this.dealData(res.data));
					if(length < 10){
						this.allLoaded = true;
					}else{
						this.allLoaded = false;
					}
					this.$refs.loadmore.onBottomLoaded();   // 对组件重新定位，就是让下面的加载字样消失
					if(this.PAGE == 1){
						this.$nextTick(() => {
							document.getElementsByClassName('wrapper')[0].scrollTop = 0;
						})
					}
					
				}, d => {
					Toolkit.win.toast(d.info);
					this.allLoaded = true;                  // 数据取完了让上拉加载的效果消失
					this.$refs.loadmore.onBottomLoaded();   // 对组件重新定位，就是让下面的加载字样消失
				})
			},
			sellNum(num) { // 售出笔数
				return num.length;
			},
			// 处理下面的列表数据
			// 卖方是乘以all_fee,买方是behave_fee bv       
			dealData(d){
				return d.map((item, index) => {
					item.all_fee = Toolkit.update.fixed(item.all_fee);
					item.amount = Toolkit.update.fixed(item.amount);
					item.currency_num = Toolkit.update.fixed(item.currency_num);
					if(item.get_trade_list.status == '10') item.statusText = '买家已下单，等待付款'; item.statusTop =  '等待买家付款';
					if(item.get_trade_list.status - 0 > 41) item.statusText = '已确认发货';
					if(item.get_trade_list.status == '40') item.statusTop =  '等待发货';
					if(item.get_trade_list.status == '99') item.statusTop =  '交易完成';
					if(item.get_trade_list.status == '41' || item.get_trade_list.status == '80' || item.get_trade_list.status == '81') item.statusTop =  '已发货';
					if(item.get_trade_list.user_receive_info){
						item.payText = item.get_trade_list.user_receive_info.type_text;
					} else{
						item.payText = '';
					}
					return item;
				})
			},
		},


	}
</script>
<style lang="less">
	@assets: '../../assets';
	@import '@{assets}/less/import';
	.wrapper{margin-top: 0;}
	header{.complete(#11468b, #1f57bf);}
	.login {
		.complete(#11468b, #1f57bf);
	}

	.shelf {width: 100%;height: auto;color: #fff;font-size: 1.072rem;padding: 0 16px;

		.shelf-amout {padding-top: 1.071rem;
			.shelf-amout-title .shelf-amout-title-time {float: right;}

			.shelf-amout-money {padding-top: 1.072rem;position: relative;
				.zhuanhuan {position: absolute;top: 0;right: -16px;width: 2.929rem;height: 2.929rem;line-height: 2.929rem;background: #0075eb;border: 2px solid #147fec;border-radius: 50%;box-shadow: 0 0 5px 5px rgba(20, 127, 236, .6);text-align: center;}
				.all-amount {text-align: center;padding-top: 1.815rem;
					h1 {font-size: 2.858rem;
						span {font-size: 15px;}
					}
				}
				.shelf-amout-state {position: absolute;left: -15px;top: 0;width: 30%;height: 2.286rem;line-height: 2.286rem;background: rgba(0, 117, 235, 0.8);/* text-align: center; */border-top-right-radius: 15px;border-bottom-right-radius: 15px;padding-left: 10px;
					.slj-gouwucheman span{font-size: 13px;}
				}
			}
		}
		ul{padding-top: 2.1rem;
			li{height: 2rem;line-height: 2rem; border-bottom: 1px solid #11458b; font-size: 12px; 
				p{display: inline-block;float: right;} 


			}
		}
	}

	.home-title {height: 4.287rem;line-height: 4.287rem;padding: 0 1.429rem;
		span {font-size: 1rem;color: #fff;font-weight: bold;vertical-align: middle;border-left: 2px #0075eb solid;padding-left: 8px;}
	}
	.bigbox{
		ul.del-box {overflow: hidden;margin: .714rem;
			li {height: auto;  padding:10px;background: #002041;color: #fff;border-bottom: 2px solid #052F5A; overflow: hidden;line-height: 25px;
				.user-img{height: 3.214rem; line-height: 3.214rem;display: inline-block;
					img{width: 3.214rem; height: 3.214rem; border-radius: 50%; display: inline-block;}
					span{font-size: 1.071rem; margin-left: .714rem;}
				}
				.curr-info{height: 3.214rem;float: right; text-align: right;
					.curr-main{height: 1.571rem; line-height: 1.571rem; font-size: 1.071rem;}
					.curr-second{height: 1.571rem; line-height: 1.571rem; font-size: .857rem; padding-top: .357rem;}
				}
				.time {padding-top: 10px;}
				.amount{font-size: 22px;
					span{font-size: 15px;}
					i{font-size: 12px;color: #4876a4}
				}
				.wait-pay{color: #ff8b64;}
				.look {color: #0075eb;}
				.paid{font-size: 12px;}
				button{float: right; width: 83px;height: 35px;border: 1px solid #0075eb;text-align: center;line-height: 35px;font-size: 13px;border-radius: 25px;margin-top: 5px;}
				input {float: right; width: 83px;height: 35px;border: 1px solid #0075eb;text-align: center;line-height: 35px;font-size: 13px;border-radius: 25px;margin-top: 5px;}
				span{font-size: 12px;}
				p{float: right; font-size: .857rem;
					.qwer{display: block; text-align: right;}
					.qwe{display: block;}
				}
			}
		}
	}
	
</style>
