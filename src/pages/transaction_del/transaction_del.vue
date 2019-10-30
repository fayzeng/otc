<template>
    <div class="msg">
       <otc-head title="交易记录">
       	<template slot="header">
       		<i class="iconfont slj-fanhui left otc-back"></i>
       	</template>        
       </otc-head>
        <ul class="ts-slider-title">
            <li :class="{'cur' : isShow}" v-tap="{methods: tabCur, type: '0'}"><span>卖出</span></li>
            <li :class="{'cur':!isShow}" v-tap="{methods: tabCur, type: '1'}"><span>买入</span></li>
        </ul>
        <div class="wrapper">
            <div class="ts-slider box_content">
                <div class="ts-slider-content">
                    <div class="ts-slider-item" :class="{'cur':isShow}">
						<mt-loadmore  :bottom-method="loadBottomSell" :top-method="loadTopSell"  :bottomPullText="'上拉加载'" :bottom-all-loaded="allLoadedSell" ref="loadmoreSell">
							<ul class="del-box">
									<li v-for="item in exchangeList" v-tap="{methods: openUrl, url:'sellout_del_delite.html', params: item.id}">
											<div class="acc-title">
													<em>{{item.get_currency_info.character}} {{setToFixed(item.currency_all_num)}}</em>
													<p>已售：{{setToFixed(item.currency_sale_num)}}</p>
											</div>
											
											<div class="acc-aum">
													<span>单价：{{setToFixed(item.unit_price)}} {{item.get_sale_currency_info.character}}</span>
													<p :class="classStatus(item.status)">{{sellStatus(item.status)}}</p>
											</div>
											<h2>单号：{{item.id}}<em>{{item.create_time}}</em></h2>
									</li>
							</ul>
						</mt-loadmore>
						<p class="loadMore" v-if="allLoadedSell">——到底了——</p>
                    </div>
                    <div class="ts-slider-item" :class="{'cur':!isShow}">
						<mt-loadmore :bottom-method="loadBottomBuy" :top-method="loadTopBuy"  :bottomPullText="'上拉加载'" :bottom-all-loaded="allLoadedBuy" ref="loadmoreBuy">
                        <ul class="del-box br">
                            <li v-for="item in purchaseRecord" v-tap="{methods: openUrl, url:'new_detail.html', params:item}">
                                <div class="acc-title">
                                    <em>{{setToFixed(item.currency_num)}} {{item.get_currency_info.character}}</em>
                                    <p>{{item.create_time}}</p>
                                </div>
                               <div class="acc-aum">
                                    <span>-{{setToFixed(item.get_purchase_record.all_fee)}} {{item.character}}</span>
                                    <p :class="classStatus(item.status)"> {{buyStatus(item.get_purchase_record.status)}}</p>
                                </div>  
                            </li>
                        </ul>
						</mt-loadmore>
						<p class="loadMore" v-if="allLoadedBuy">——到底了——</p>
                    </div>
                </div>
            </div>
        </div>

       
    </div>
</template>
<script>
import otcHead from '../../components/head';
import { Toast, MessageBox, Loadmore } from 'mint-ui';	
import apis from '../../axios/apis';
import {Ajax, Toolkit, otc, Vc} from '../../components/public.js'
export default{
	name: 'transaction_del',
	components:{otcHead},
	data(){
			return{
					exchangeList: [],				// 卖出列表
					purchaseRecord: [],				// 买入列表
					isShow: true,					// 控制选项卡，true为卖出，false为买入
					sTop0: 0,						// 买入滚动条位置
					sTop1: 0,						// 卖出滚动条位置
					PAGE0: 0,						// 卖出的页数
					PAGE1: 1,						// 买入的页数
					SIZE: 10,						// 每页条数
					allLoadedSell: false,				// 卖出记录的组件开关
					allLoadedBuy: false,				// 买入记录的组件开关
			}
	},
	mounted(){
			const isPlus = Toolkit.checker.isPlus();
			isPlus.then(() => {
				otc.init();
				this.getMyExchangeList();
				this.getPurchaseRecord(); 
			})	
	},
	methods:{
		loadTopSell(){
			this.PAGE0 = 1;
			this.allLoadedSell = false;
			this.getMyExchangeList();
		},
		loadTopBuy(){
			this.PAGE1 = 1;
			this.allLoadedBuy = false;
			this.getPurchaseRecord(); 
		},
		loadBottomSell(){
			// 卖出记录上拉一定距离后释放
			if(this.exchangeList.length > 1){
				this.PAGE0++;
				this.getMyExchangeList();
			}
		},
		loadBottomBuy(){										// 买入记录上拉一定距离后释放
			if(this.purchaseRecord.length > 1){
				this.PAGE1++;
				this.getPurchaseRecord();
			}
		},
		
		tabCur(d){						// 点击上面的买入和卖出
			if(d.type == '0'){
				this.isShow = true;
			}else{
				this.isShow = false;
			}
		},
		buyStatus: function(s){							// 交易状态
					if(s == '10') return '生成交易';
					if(s == '20') return '交易失败';
					if(s == '30') return '取消交易';
					if(s == '99') return '成功交易';
					if(s == '40' || s == '42') return '等待交易';
					
				},
			sellStatus: function(s){				// 货币的售卖状态
				if(s == '10') return '售卖中';
				if(s == '20') return '已下架';
				if(s == '99') return '已售完';
			},
			classStatus: function(s){				//买入货币的不同状态的不同样式
				if(s == '10') return 'wait-pay';
				if(s == '20') return 'redold';
				if(s == '99') return '';
			},
		getMyExchangeList(){								// 卖出记录
			Ajax(apis.getMyExchangeList, {
					username:Toolkit.storage.getUserInfo('username'),
					token:Toolkit.storage.getUserInfo('token'),
					page: this.PAGE0,			
					size: this.SIZE
			}).then(res => {
				let length = res.data.length;
				if(this.PAGE0 == 1){
					this.exchangeList = [];
				}
				if(length < 10){
					this.allLoadedSell = true;
				}
				this.exchangeList.push.apply(this.exchangeList, res.data);
				this.$refs.loadmoreSell.onBottomLoaded();   // 对组件重新定位，就是让下面的加载字样消失
				this.$refs.loadmoreSell.onTopLoaded();
				if(this.PAGE0 == 1){
					this.$nextTick(() => {
						document.getElementsByClassName('wrapper')[0].scrollTop = 0;
					})
				}
			}, d => {
					Toolkit.win.toast(d.info);
					this.$refs.loadmoreSell.onBottomLoaded();   // 对组件重新定位，就是让下面的加载字样消失
					this.$refs.loadmoreSell.onTopLoaded();
					this.allLoadedSell = true;                  // 数据取完了让上拉加载的效果消失
			})			
		},
		getPurchaseRecord(){					// 买入记录
			Ajax(apis.getPurchaseRecord, {
					username:Toolkit.storage.getUserInfo('username'),
					token:Toolkit.storage.getUserInfo('token'),
					page: this.PAGE1,			
					size: this.SIZE
			}).then(res => {
				let length = res.data.length;
				if(this.PAGE1 == 1){
					this.purchaseRecord = [];
				}
				if(length < 10){
					this.allLoadedBuy = true;
				}	
				this.purchaseRecord.push.apply(this.purchaseRecord, res.data);
				this.$refs.loadmoreBuy.onBottomLoaded();   // 对组件重新定位，就是让下面的加载字样消失
				this.$refs.loadmoreBuy.onTopLoaded();
				if(this.PAGE1 == 1){
					this.$nextTick(() => {
						document.getElementsByClassName('wrapper')[0].scrollTop = 0;
					})
				}
			}, d => {
					Toolkit.win.toast(d.info);
					this.$refs.loadmoreBuy.onBottomLoaded();   // 对组件重新定位，就是让下面的加载字样消失 
					this.$refs.loadmoreBuy.onTopLoaded();
					this.allLoadedBuy = true;                  // 数据取完了让上拉加载的效果消失
			})			
		},	
		setToFixed(num){																	// 统一保留币种数量的小数位
			return Toolkit.storage.setToFixed(num);
		},
		openUrl(d){																				// 打开页面
			Toolkit.win.openWV(d.url,{billDetail: d.params ? d.params : ''}, true);
		},
	},
	
}
</script>
<style lang="less">
@assets: '../../assets';
@import '@{assets}/less/import';
.wrapper{top:8.857rem; margin: 0;}
.ts-slider-title{ width: 100%; height: 3.572rem; color: #fff; padding: .715rem 0; position: absolute; top: 5.287rem; background: #002041;
    li{ width: 50%; float: left; text-align: center; font-size: 1.072rem; line-height: 2.144rem;}
    li:last-child{ border-left: 1px #ccc solid;}
    li.cur span{ border-bottom: 2px #0075eb solid; line-height: 2.144rem; display: inline-block; font-weight: bold;}
}
.box_content{top: 0px;
    .ts-slider-content{  background: #002041;color: #fff;
        .cur{ display: block;}
    }
    .ts-slider-item{ display: none;}
}

ul.del-box{ overflow: hidden; margin: 0 1.429rem;
    li{padding: 0; border-bottom: 1px #244b72 solid; padding: 15px 0;
        h2{ height: 2.144rem; line-height: 2.144rem; font-size: .858rem;
            em{ float: right; font-size: 12px; color: #fff;}
        }
        div {display: inline-block;font-size: .929rem; margin-top: .715rem;
            p {padding-top: .715rem;}
            em{ font-weight: bold; font-size: 1.144rem;}
        }
        .acc-aum {float: right;text-align: right;
            p {font-weight: bold;font-size: 1rem ;}
            input{width: 5.929rem; height: 2.5rem; border: 1px solid #5251d3; text-align: center; line-height: 2.5rem; font-size: 15px; border-radius: 10px;margin-top: 5px;}
        }
    }
}
ul.br li{ border-bottom: 1px #244b72 solid;}

// .wrapper .index-name{width: 100%;height: 149px;line-height: 149px;text-align: center;color: #222;background: #fff;font-size: 18px;font-weight: 800;}	
// .wrapper .save-infor{position: absolute; width: 80%; height: 46px; left: 10%; bottom: 10%; font-size: 18px; background: #4341ef; border-radius: 20px; color: #fff;}
.wait {color: #FF8B64;}
.wait-pay {color: #4199F0;}
.redold {color: #EE4A4A;}



</style>