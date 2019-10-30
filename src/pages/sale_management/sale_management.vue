<template>
	<div class="msg">
		<otc-head title="售卖管理">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
			</template>
		</otc-head>
		<div class="btctext">
			<ul class="bpb_screen">
				<li>
					<span v-tap="{methods: checkTime}" class="time">{{setTime || '日期筛选'}} <i class="iconfont slj-riqi"></i> </span>
				</li>
				<li>
					<span v-tap="{methods: showpick}">{{selectType.text || '币种筛选'}} <i class="iconfont slj-xiangxia"></i> </span>
				</li>
				<li>
					<span v-tap="{methods: showpickSt}">{{selectTypeSt.text || '状态筛选'}} <i class="iconfont slj-xiangxia"></i> </span>
				</li>
			</ul>
		</div>
		<div class="wrapper">
			<div class="bpb_box">
				<mt-loadmore :bottom-method="loadBottom" :top-method="loadTop" :bottomPullText="'上拉加载'" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="controlAuto">
					<ul class="del-box">
						<li  v-tap="{methods: openUrl, url:'sellout_del_delite.html', data: item}" v-for="item in exchange" :key="item.ids"> 
							<div class="order-info">
								<span class="order-num">订单号 {{item.id}}</span>
								<span class="order-time">{{item.statusText}}</span>
							</div>
							<div class="user-info">
								<div class="user-img">
									<span>已售：{{item.currency_sale_num}}({{item.get_currency_info.character}})</span>
									<span>{{item.unit_price}}(CNY)</span>
								</div>
								<div class="curr-info">
									<p class="curr-second">未售：{{item.remaining_num}}({{item.get_currency_info.character}})</p>
									<p class="curr-main">{{item.create_time}}</p>
									<i class="iconfont slj-zhuanhuan"></i>
								</div>
							</div>
							<div class="order-state">
								<span class="state-ing" v-if="item.confirmed > 0">有{{item.confirmed}}笔等待确认</span>
								<span class="state-ing"  v-else>无待处理信息</span>
							</div>
						</li>
					</ul>
				</mt-loadmore>
			</div>
			<div class="loadMore" v-if="allLoaded">— 到底了 —</div>
			<mt-popup v-model="isDisplay" :selectItems='isDisplay' ref="mtPopup" @getData='getDatetime'></mt-popup>
			<type-picker :selectItems='billType' ref="codePicker" @getData='getData'></type-picker>
			<type-picker :selectItems='billTypeSt' ref="codePickerSt" @getData='getDataSt'></type-picker>
		</div>
	</div>
</template>
<script>
	import otcHead from '../../components/head';
	import {Toast,Loadmore} from 'mint-ui';
	import {Ajax,Toolkit,otc,Vc,apis} from '../../components/public.js';
	import mtPopup from '../../components/select_date';
	import typePicker from '../../components/picker';

	export default {
		name: 'sale_management',
		components: {otcHead, mtPopup, typePicker},
		data() {
			return {
				currencyData: '', // 上个页面传过来的ID
				exchange: [], // 交易列表
				allLoaded: true, // 上拉加载功能的开关
				PAGE: 1,
				SIZE: 10,
				controlAuto: true,
				billType: '',				// 币种筛选后的类型集
				selectType: '',				// 币种默认及选择后的类型
				billTypeSt: [{text: '可购买', value: '10'}, {text: '已下架', value: '20'}, {text: '已卖出', value: '99'}],				// 类型筛选后的类型集
				selectTypeSt: '',			// 类型默认及选择后的类型
				setTime: '', 				// 日期
				isDisplay: false,			// 选择器的显示开关
			}
		},
		mounted() {
			const isPlus = Toolkit.checker.isPlus();
			isPlus.then(() => {
				otc.init();
				let currency = Toolkit.storage.getItem('OTC_CURRENT');
				this.self = Toolkit.win.getWebview();
				this.billType = currency.map((item, index) => {
					let obj = {};
					obj.text = item.character;
					obj.value = item.id;
					return obj;
				})
				this.selectType = this.billType[0];
				this.selectTypeSt = this.billTypeSt[0];
				this.getMyExchangeList();
				window['freshAjax'] = () => this.loadTop();
				

			})
		},
		methods: {
			openUrl(d){
				Toolkit.win.openWV(d.url, {data: d.data}, true);
			},
			// 交易所列表下拉刷新
			loadTop() { 
				this.PAGE = 1;
				this.getMyExchangeList(true);
			},
			// 交易所列表上拉一定距离后释放
			loadBottom() { 
				if (this.exchange.length > 1) { // methods的loadBottom方法会先于mounted运行。
					this.PAGE++;
					this.getMyExchangeList();
				}
			},
			// 初始化日期
			initDate(){
				let now = new Date();
				let monthn = now.getMonth() + 1; 
				let yearn  = now.getFullYear(); 
 	      		this.setTime = yearn + '-' +monthn; 
			},
			// 打开币种状态选择
			showpick() {
				this.$refs.codePicker.open(); // 父组件调用子组件里的方法
			},
			// 打开币种状态选择
			showpickSt() {
				this.$refs.codePickerSt.open(); // 父组件调用子组件里的方法
			},
			// 状态选择后的回调text为显示文本
			getData(d) {
				this.selectType = d;
				this.exchange = [];
				this.PAGE = 1;
				this.getMyExchangeList(true);
			},
			// 状态选择后的回调text为显示文本
			getDataSt(d) {
				this.selectTypeSt = d;
				this.exchange = [];
				this.PAGE = 1;
				this.getMyExchangeList(true);
			},

			// 选择时间后组件的返回值 
			getDatetime(d) {
				this.setTime = d.dt;
				this.exchange = [];
				this.PAGE = 1;
				this.getMyExchangeList(true);
			},

			// 选择时间
			checkTime() {
				this.isDisplay = true;
				this.$refs.mtPopup.open();
			},
			// 处理数据
			dealData(d){
				return d.map((item, index) => {
					item.unit_price = Toolkit.update.fixed(item.unit_price);
					item.remaining_num = item.currency_all_num - item.currency_sale_num;
					item.confirmed = item.confirmed - 0;
					if(item.status == '10') item.statusText = '售卖中';
					if(item.status == '20') item.statusText = '结束售卖';
					if(item.status == '99') item.statusText = '售卖完成';
					return item;
				})
			},
			getMyExchangeList(isRead){				
				Ajax(apis.getMyExchangeList, {
					username:Toolkit.storage.getUserInfo('username'),
					token:Toolkit.storage.getUserInfo('token'),     
					page: this.PAGE,
					size: this.SIZE,
					confirmed: false,
					status: this.selectTypeSt.value,
					date: this.setTime,
					cid: this.selectType.value
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
					this.$refs.loadmore.onTopLoaded();
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

	}
</script>
<style lang="less">
	@assets: '../../assets';
	@import '@{assets}/less/import';

	.wrapper {margin-top: 0;top: 9.571rem;}

	.btctext {width: 100%;position: absolute;top: 5.214rem;left: 0;background: #002041;color: #fff;height: 4.286rem;
		.bpb_screen{ height: 4.286rem; background: #002041; color: #fff;
			& > li{ width: 33%; float: left; text-align: center; line-height: 4.286rem; font-size: 1.071rem;
				i{ vertical-align: middle; font-size: .929rem;}
			}
		}
	}
	ul.del-box{padding: 0 .714rem; overflow: hidden;
	    li{width: 100%; background: #002041; padding: 0 .714rem;  color: #fff; margin-top: .714rem; border-radius: .714rem;
	        .order-info{width:100%; height: 3.214rem; line-height: 3.214rem;  border-bottom: 2px solid #052F5A; 
	            .order-num{float: left; font-size: 1.071rem; }
	            .order-time{float: right; font-size: .857rem;}
	        }
	        .user-info{width: 100%; height: 7rem; overflow: hidden; padding-top: 1.071rem; border-bottom: 2px solid #052F5A; 
	            .user-img{height: 3.214rem;float: left; line-height: 3.214rem;
	                span{font-size: 1.071rem; margin-left: .714rem;    display: block;line-height: 23px;}
	            }
	            .curr-info{height: 5.214rem;float: right; text-align: right;
	                .curr-main{height: 1.571rem; line-height: 1.571rem; font-size: 1.071rem;}
	                .curr-second{height: 1.571rem; line-height: 1.571rem; font-size: .857rem; }//padding-top: .357rem;
					.slj-zhuanhuan{padding: 0 20px; font-size: 1rem; color: #0074e9; border: 1px solid #0074e9;border-radius: 20px;display: inline-block;margin-top: 5px;}
	            }
	        }
	        .order-state{width: 100%; height: 3.214rem; line-height: 3.214rem; 
	            .state-ing{font-size: .857rem; float: left;}
	            .state-time{font-size: .857rem; float: right;
	                .color{color:#0075eb;}
	            }
	        }
	
	    }
	}

</style>
