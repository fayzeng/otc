<template>
    <div class="msg">
		<otc-head title="交易">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
				<span class="right" v-tap="{methods: hrefUrl, url:'sell_out.html', params: currencyData}">卖出</span>
			</template>        
		</otc-head>
		<div class="btctext">
			<div class="bpb-conditions">
					<div class="normal"  v-tap="{methods: chooseCond, number: '30'}"  :class="{'choose': price.textColor}" >价格 <span  :class="[price.order ? 'haveRo' : 'noRo']">▼</span> </div>
					<div class="normal"  v-tap="{methods: chooseCond, number: '20'}"  :class="{'choose': chance.textColor}">交易成功率<span  :class="[chance.order ? 'haveRo' : 'noRo']">▼</span></div>
					<div class="normal"  v-tap="{methods: chooseCond, number: '10'}"  :class="{'choose': time.textColor}">上架时间<span  :class="[time.order ? 'haveRo' : 'noRo']">▼</span></div>
			</div>
		</div>
		<div class="wrapper">
			<div class="box-content">
				<mt-loadmore :bottom-method="loadBottom"   :top-method="loadTop" :bottomPullText="'上拉加载'" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="controlAuto">
					<div class="sell-bpb" v-for="item in exchange" v-tap="{methods: hrefUrl, url:'btc_buy.html', params: item}"> 
						<div class="bpb-head">
							<div class="head-img"><img  :src="item.get_user_info.head_img_src || '../../assets/images/03.jpg'"></div>
							<div class="head-text">
									<p>{{item.id}}</p>
									<p>{{item.get_user_info.nickname || setNameStr(item.username)}}</p>
							</div> 
						</div>
						<div class="sell-data">
							<table>
								<tr >
										<td class="fs">{{item.allNum}}单/{{setToFixed(item.num*100)}}%</td>
										<td class="tl">{{setToFixed(item.unit_price)}} {{item.get_sale_currency_info.character}}</td>
								</tr>
								<tr>
										<td>总</td>
										<td class="tl">{{setToFixed(item.currency_all_num)}}</td>
								</tr>									
								<tr>
										<td>剩</td>
										<td class="tl">{{setToFixed(item.currency_all_num - item.currency_sale_num)}}</td>
								</tr>	
								<tr>
										<td>上架时间</td>
										<td class="tl">{{item.create_time}}</td>
								</tr>									
							</table>
						</div>
						<div class="bpb-interval">
							<p class="interval-left">购买区间</p>
							<i class="iconfont slj-xiangyou"></i>
							<p class="interval-middle">{{setToFixed(item.minimum_purchasing)}}{{item.get_currency_info.character}} - {{setToFixed(item.maximum_purchasing)}}{{item.get_currency_info.character}}</p>
						</div>
						<div class="bpb-clearance"></div>	
					</div>	
				</mt-loadmore>
				<div class="loadMore" v-if="allLoaded">— 到底了 —</div>
			</div>
		</div>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import { Toast, Loadmore} from 'mint-ui';	
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public.js'
export default{
	name: 'transaction_list',
	components:{otcHead},
	data(){
		return{
				condetion:[{text:'价格', style:'30'}, {text:'交易成功率', style:'20'},{text:'上架时间', style:'10'}],       // 筛选条件
				currencyData: '',											// 上个页面传过来的ID
				exchange: [],																												// 交易列表
				orderType:'30',																											// 默认的列表类型
				order:'desc',																												// 默认的列表顺序
				price: {																														// 按价格排序
					textColor: true,
					order: false
				},
				chance: {																														// 按成功率排序
					textColor: false,
					order: false
				},
				time: {																															// 按时间排序
					textColor: false,
					order: false
				},
				allLoaded: false,																										// 上拉加载功能的开关
				PAGE: 1,
				SIZE: 10,	
				controlAuto: true,
		}
	},
	mounted(){
			const isPlus = Toolkit.checker.isPlus();
			isPlus.then(() => {
				this.self = Toolkit.win.getWebview();
				this.currencyData = Toolkit.win.getWebview().data;
				console.log('currencyData' + JSON.stringify(this.currencyData));
				this.getExchangeList();
				window['getExchangeList'] = () => this.getExchangeList();
				otc.init();
				
			})	
	},
	methods:{
		loadTop(){											// 交易所列表下拉刷新
			this.PAGE = 1;
			this.getExchangeList('top');
		},
		loadBottom(){										// 交易所列表上拉一定距离后释放
			console.log('222');
			if(this.exchange.length > 1){						// methods的loadBottom方法会先于mounted运行。
				this.PAGE++;
				this.getExchangeList();
			}
		},		
		chooseCond(d){							// 点击上面的筛选条件
			if(d.number == '30'){
				this.price.order = !this.price.order;
				this.judge(this.price.order);
				this.orderType = '30';
				this.price.textColor = true;
				this.chance.textColor = false;
				this.time.textColor = false;
			}
			if(d.number == '20'){
				this.chance.order = !this.chance.order;
				this.judge(this.chance.order);
				this.orderType = '20';
				this.chance.textColor = true;
				this.price.textColor = false;
				this.time.textColor = false; 
			}
			if(d.number == '10'){
				this.time.order = !this.time.order;
				this.judge(this.time.order);
				this.orderType = '10';
				this.time.textColor = true;
				this.price.textColor = false;
				this.chance.textColor = false;
			}
			this.PAGE = 1;
			this.getExchangeList();
		},
		getExchangeList(style){				// 交易所列表
			Ajax(apis.getExchangeList, {
					username:Toolkit.storage.getUserInfo('username'),
					token:Toolkit.storage.getUserInfo('token'),     
					page: this.PAGE,
					size: this.SIZE,
					currencyId: this.currencyData.currency_id,
					orderName:this.orderType,
					orderType:this.order
			}).then(res => {
					const length = res.data.length;
					if(this.PAGE == 1){
						this.exchange = [];
					}
					this.exchange.push.apply(this.exchange, res.data);
					
					if(length < 10){
						this.allLoaded = true;
						
					}else{
						this.allLoaded = false;
					}
					if(style == 'top'){
						this.$refs.loadmore.onTopLoaded();
					}else{
						this.$refs.loadmore.onBottomLoaded();   // 对组件重新定位，就是让下面的加载字样消失
					}
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
		judge(style){																	// 判断是正序还是倒序
			if(style == true){
					this.order = 'asc';
			}else{
				this.order = 'desc';
			}
		},
		getCurrency: function(id){										// 钱币的符号
			var data = Toolkit.storage.getObtain(id).character;
			return data;
		},
		setNameStr: function(name){									// 昵称的简写
				return name.replace(name.substr(3, 4), "****")
			},
		setToFixed: function(num){									// 币种数量的小数位
			return Toolkit.storage.setToFixed(num);
		},
		hrefUrl(d){
			Toolkit.win.openWV(d.url, {data: d.params}, true);
		}
	},
	
}
</script>
<style lang="less">
@assets: '../../assets';
@import '@{assets}/less/import';
.wrapper{margin-top: 0; top: 8.857rem;}
.btctext{  width: 100%;position: absolute; top: 5.286rem; left: 0; background: #002041; color: #fff; height: 3.571rem;
	.bpb-conditions{width: 100%; height: 4.429rem; border-bottom: 1px solid #00152A; overflow: hidden;
			.normal{width: 33%; height:  4.429rem; line-height:  4.429rem; font-size: 1.072rem;float:left; text-align: center;color: #0075eb;
				.haveRo{transform: rotate(180deg);}
				.noRo{transform: none;}
				span{display: inline-block;}
			}
			.choose{color: #fff;}
	}
}
.box-content{ background: #002041; color: #fff;}

.sell-bpb{width: 100%;  overflow: hidden; padding: 20px 0; color: #fff;
        .bpb-head{width: 100%; height: 3.572rem; margin-bottom: 1.429rem; overflow: hidden;padding: 0 1.429rem;
            .head-img{float: left; height: 3.572rem; width: 3.572rem;
                img{width: 100%; height: 100%; border-radius: 50%;}
            }
            .head-text{float: right; height: 3.572rem; text-align: right;
                p{height: 1.787rem; line-height: 1.787rem;}
            }

        }
        .bpb-interval{width: 100%; overflow: hidden; height: 2.858rem; line-height: 2.858rem; padding: 0 1.429rem;
            .interval-left{float: left;font-size: 1rem;}
            .interval-middle{float: right; font-size: 1rem;}
            i{float: right; margin-left: 10px;}
        }
        .bpb-clearance{width: 100%; height: 1px; background: #00152A;}

        .sell-data{ width: 100%; overflow: hidden;border-bottom: 1px #032F5B solid;padding: 0 1.429rem;
            table{ width: 100%;
                td{ line-height: 100%; height: 1.787rem; }
                td.fs{ font-size: 1.144rem;}
                td.tl{ text-align: right;}
            }
        }
       
}
</style>