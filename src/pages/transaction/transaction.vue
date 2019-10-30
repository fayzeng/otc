<template>
    <div class="msg">
        <otc-head title="交易">
        	<template slot="header">
				<span class="right" v-tap="{methods: operation}">操作</span>
        	</template>        
        </otc-head>
		<div class="operation" v-if="haveOper">
			<div class="my-operation" v-tap="{methods: openUrl, url:'sell_out.html'}"> <i class="iconfont  slj-maichu"></i> 我要售卖 </div>
			<div class="my-operation" v-tap="{methods: openUrl, url:'buy_order.html'}"> <i class="iconfont  slj-mairu"></i> 买入订单 </div>
			<div class="my-operation none" v-tap="{methods: openUrl, url:'sale_management.html'}"> <i class="iconfont  slj-shezhi"></i> 售卖管理 </div>
		</div>
		<div class="ts-choose-title">
			<div class="swiper-container">
				<ul class="swiper-wrapper">
					<li class="swiper-slide" v-tap="{methods: chCur, value: value, key: key}" v-for="(value, key) in currency" :key="key"><p :class="[isActive == key ? 'current': '']">{{value.character}}</p></li>
					
				</ul>
				<div class="swiper-pagination"></div>
			</div>
			<div class="scan-report">
				<div class="report-text">公告</div>
				<div class="notice" id="demo">
					<div class="notice-cont">
						<div class="notice-list" id="demo1">
							<!-- <marquee id="affiche" align="left" behavior="scroll"  direction="left"  scrollamount="5" scrolldelay="100" v-for="item in msg">
								{{subst(item.create_time)}} 
								成交成交{{setToFixed(item.get_trade_detail_list[0].currency_num)}} 
								{{getCurrency(item.get_trade_detail_list[0].currency_id)}}
								价格 {{setToFixed(item.all_fee)}}
							</marquee> -->
						</div>
						<div id="demo2"></div>
					</div>
				</div>
			</div>
			<div class="bpb-conditions">
				<div class="normal" v-for="(item, key) in chooseData" :class="[isname == key ? 'choose': '']" v-tap="{methods: chooseCond, type: item, style: key}" :key="item.id"> {{item.name}}  <span :class="[item.order ? 'haveRo' : 'noRo']">▼</span> </div>
			</div>
		</div>	

        <div class="wrapper">
        	<mt-loadmore :bottom-method="loadBottom"    :bottomPullText="'上拉加载'" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="controlAuto">
			<div class="box-content">
				
				<div class="trans-report" v-for="item in exchange" :key="item.id" v-tap="{methods: openUrlbuy, url: 'btc_buy.html', data: item}">
					<div class="head">
						<img :src="item.head_img_src ? item.head_img_src : headimg"> 
						<div class="head-right">
							<p class="right-name">{{item.nickname}}</p>
							<p class="right-trade">成交笔数<span>{{item.allNum}}</span></p>
						</div>
					</div>
					<ul class="body">
						<li class="left"> 	
							<p> 数量{{item.currency_sale_num}}/{{item.currency_all_num}}({{item.symbol}})</p>
							<p>限额{{item.minimum_purchasing}}/{{item.maximum_purchasing}}({{item.symbol}})</p>
						</li> 
						<li class="right">
							<div class="open">  <i class="iconfont slj-xiangyou"></i></div>
						</li>
						<li class="right">
							<p class="eight">{{item.unit_price}}(CNY)</p>
							<p class="padding" v-if="item.user_receive_info_array"><i class="iconfont" v-for="value in item.user_receive_info_array" :class="paySybol[value.type]" :key="value.id"></i></p>
						</li>
						
					</ul>
				</div>
				
				<div class="loadMore" v-if="allLoaded">— 到底了 —</div>
			</div>
			</mt-loadmore>
      	</div>

       
    </div>
</template>
<script>
import otcHead from '../../components/head';
import { Toast, MessageBox,  Swipe, SwipeItem, Loadmore  } from 'mint-ui';	
import apis from '../../axios/apis';
import {Ajax, Toolkit, otc, Vc} from '../../components/public.js';
import Swiper from 'swiper'
export default{
    data(){
        return{
			msg: '',    // 公告的数据
			orderType:'30',																													// 默认的列表顺序
			order:'desc',																													// 默认的列表顺序
			chooseData:{
				price: {	
					name: '价格',
					type: '30',																													// 按价格排序
					textColor: true,
					order: false
				},
				chance: {	
					name: '交易成功率',
					type: '20',																														// 按成功率排序
					textColor: false,
					order: false
				},
				time: {	
					name: '上架时间',
					type: '10',																															// 按时间排序
					textColor: false,
					order: false
				},
			},
			
			allLoaded: true,																										// 上拉加载功能的开关
			controlAuto: true,																										// 填充下拉框
			PAGE: 1,
			SIZE: 10,
			headimg: require('../../assets/images/03.jpg'),					 // 默认头像
			exchange: [],													 // 下面的交易数据
			haveOper: false,													 // 控制用户操作的弹框
			currency:Toolkit.storage.getItem('OTC_CURRENT'),
			curId: Toolkit.storage.getItem('OTC_CURRENT')[0].id,
			isActive: 0,														// 默认第一个选项卡
			isname: 'price',
			paySybol:{
				'10': 'slj-zhifubaozhifu',
				'20': 'slj-weixin-copy',
				'40': 'slj-iconfontjikediancanicon20',
			}
        }
    },
    mounted(){
		const isPlus = Toolkit.checker.isPlus();
		let swiper = new Swiper('.swiper-container', {
			slidesPerView: 3,
			spaceBetween: 30,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
		});
        isPlus.then(() => {
			this.getExchangeList();
			this.getLastExchangeRecord();
			window['freshAjax'] = () => {this.getExchangeList(true)};		
        })
    },	
	methods:{
		loadTop(){											// 交易所列表下拉刷新
			this.PAGE = 1;
			this.getExchangeList('top');
		},
		loadBottom(){	// 交易所列表上拉一定距离后释放					
			if(this.exchange.length > 1){						// methods的loadBottom方法会先于mounted运行。
				this.PAGE++;
				this.getExchangeList();
			}
		},
		subst(d){										// 消息快讯的截取字符串
			return d.substring(11);
		},
		setToFixed(num){					// 统一保留币种数量的小数位
			return Toolkit.storage.setToFixed(num);
		},
		getCurrency(id){						// 获取币种符号
			return Toolkit.storage.getObtain(id).character;
		},
		chooseCond(d){							// 点击上面的筛选条件
			this.orderType = this.chooseData[d.style].type;
			this.chooseData[d.style].order = !this.chooseData[d.style].order;
			this.order = this.chooseData[d.style].order ? 'asc' : 'desc';
			this.isname = d.style;
			this.PAGE = 1;
			this.getExchangeList();
		},
		judge(style){																	// 判断是正序还是倒序
			if(style == true){
					this.order = 'asc';
			}else{
				this.order = 'desc';
			}
		},
		operation(){																	// 点击操作按钮
			this.haveOper = !this.haveOper;
		},
		openUrl(d){																		// 打开不同的页面
			this.haveOper = false;
			Toolkit.win.openWV(d.url, {}, true);
		},
		openUrlbuy(d){
			this.haveOper = false;
			Toolkit.win.openWV(d.url, {data: d.data}, true);
		},
		chCur(d){																		// 点击选项卡的币种
			this.curId = d.value.id;
			this.isActive = d.key;
			this.PAGE = 1;
			this.exchange = [];
			this.getExchangeList();
		},
		dealData(d){
			return d.map((item, index) => {
				item.allNum = Math.ceil(item.allNum * item.num);
				item.unit_price = Toolkit.update.fixed(item.unit_price);
				item.minimum_purchasing = Toolkit.update.fixed(item.minimum_purchasing);
				item.maximum_purchasing = Toolkit.update.fixed(item.maximum_purchasing);
				if(item.user_receipt_info_ids) item.user_receipt_info_ids = item.user_receipt_info_ids.split(',');
				item.symbol = Toolkit.storage.getUserAccount(this.curId).character;
				return item;
			})
		},  
		getLastExchangeRecord(){			// 获取消息快讯
			Ajax(apis.getLastExchangeRecord, {
				username:Toolkit.storage.getUserInfo('username'),
				token:Toolkit.storage.getUserInfo('token'),       
			}).then(res => {
				this.msg = res.data;
			}, d => {
				Toast(d.info);
			})					
		},
		getExchangeList(isRead){				// 交易所列表
			Ajax(apis.getExchangeList, {
					username:Toolkit.storage.getUserInfo('username'),
					token:Toolkit.storage.getUserInfo('token'),     
					page: this.PAGE,
					size: this.SIZE,
					currencyId: this.curId,
					orderName:this.orderType,
					orderType:this.order
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
					
					// TODO: 由于调用重置loadmore方法时，滚动条初始不为0，会自动滚动50px左右，具体原因待查，先这么处理
					
			}, d => {  
					Toolkit.win.toast(d.info);
					this.$refs.loadmore.onTopLoaded();
					this.allLoaded = true;                  // 数据取完了让上拉加载的效果消失
					this.$refs.loadmore.onBottomLoaded();   // 对组件重新定位，就是让下面的加载字样消失
			})			
		},
	},
	components:{otcHead},
}
</script>
<style lang="less">
@assets: '../../assets';
@import '@{assets}/less/import';
.wrapper{margin-top: 0; top: 16.643rem;}
.operation{width: 9.286rem; height: 11.643rem; background: rgba(0,0,0,0.7); position: absolute; top: 4.071rem; right: 0;z-index: 2; border-radius: .357rem;
	.my-operation{width: 100%; height: 33%; text-align: center; line-height: 3.857rem; color: #FCFCFC;font-size: 1.071rem; border-bottom: 2px solid #292929;}
	.none{border: none;}
}
.ts-choose-title{width: 100%;   padding: .715rem 0; position: absolute; top: 4.287rem; overflow: hidden;
	.swiper-container{width: 100%; height: 100%; background: #002041;
		.swiper-wrapper{display: -webkit-box; height: 4.071rem; width: 100%;  color: #fff;padding-top: 1.071rem;
			.swiper-slide{text-align: center; display: flex;  height: 2.5rem;  line-height:2.5rem;  color:#9EAAB6;
				p{width:3.571rem; height: 2.5rem; margin: 0 auto; text-align: center;}
				.current{border-bottom: 2px solid #0075eb; color: #fff;}
			}
		}
	}
	// .choose-currency{height: 4.071rem; width: 100%; background: #002041; color: #fff;padding-top: 1.071rem;
	// 	li{float: left; width: 33%; height: 2.5rem; float: left; line-height:2.5rem;  color:#9EAAB6;
	// 		p{width:3.571rem; height: 2.5rem; margin: 0 auto; text-align: center;}
	// 		.current{border-bottom: 2px solid #0075eb; color: #fff;}
	// 	}
	// }
	.scan-report{height: 2.857rem;line-height: 2.857rem; width: 100%; padding: 0 1.072rem; overflow: hidden; background: #08294b; color: #fff; margin-top: .143rem; font-size: .857rem;
		.report-text{color:#fff; height: 1.858rem; width: 20%; line-height: 1.858rem; text-align: center; border-left: 2px solid #0075EB; margin-top: 0.5rem; font-weight: 800; float: left;}
		.report-article{width: 80%; height:2.857rem; line-height: 2.857rem; padding: 0 .715rem; font-size:  .929rem;float: left;}
		.notice {width: 80%;padding-left: 0.714rem; float: left; overflow-x: auto;
			.notice-cont{ width: 214.285rem; height: 2.857rem;
					 #demo1{ height:  2.857rem; float:left;width: 8%;}
					 li{float:left; height:  2.857rem; padding-right: 2.142rem;}
				}
		}	
	}
	.bpb-conditions{width: 100%; height: 4.429rem; border-bottom: 2px solid #05294F; overflow: hidden; 
			.normal{width: 33%; height:  4.429rem; line-height:  4.429rem; font-size: .929rem;float:left; text-align: center;color: #6b6d78;
				.haveRo{transform: rotate(180deg);}
				.noRo{transform: none;}
				span{display: inline-block; font-size: .714rem;}
			}
			.choose{color: #fff;}
	}
}
.box-content{width: 100%; overflow: auto; padding:  0.714rem 0;
	.trans-report{padding: 1.071rem 0.714rem 1.429rem 0.714rem; width: 100%; border-bottom: .143rem solid #05294F;
		.head{height: 3.071rem; width: 100%;
			img{float: left; height: 3.071rem; width: 3.071rem;  border-radius: 50%;}
			.head-right{float: left; margin-left: .714rem; height: 3.071rem;
				.right-name{height: 2rem; font-size: 1.071rem; line-height:   2rem;color: #fff;}
				.right-trade{height: 1.071rem; font-size: .929rem; line-height:1.071rem;color: #575B68;}
			}
		}
		.body{width: 100%; margin-top: 1.071rem; overflow: auto;
			li{ height:4.286rem; color: #fff; font-size: 1rem; line-height: 2.143rem;  float: left;
				p{height: 2.143rem;
					i{font-size: 1.129rem;}
				}
				.eight{font-size: 1rem; }
				.open{height:4.286rem; line-height:4.286rem; 
					i{font-size: 1.071rem;}
				}
				.padding{padding-right: .857rem;}
			}
			.left{float: left; 
				i{color: #4199F0;}
			}
			.right{float: right; text-align: right;}

		}
	}
}
</style>