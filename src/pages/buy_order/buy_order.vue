<template>
	<div class="msg">
		<otc-head title="买入订单">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
			</template>
		</otc-head>

		<div class="wrapper">
			<div class="bpb_box">
				<ul class="bpb_screen">
					<li>
						<span v-tap="{methods: checkTime}" class="time">{{setTime || '日期筛选'}} <i class="iconfont slj-riqi"></i> </span>
					</li>
					<li>
						<span v-tap="{methods: showpick}">{{selectType.text || '币种筛选'}} <i class="iconfont slj-xiangxia"></i> </span>
					</li>
				</ul>
				<mt-loadmore :bottom-method="loadBottom"  :top-method="loadTop" :bottomPullText="'上拉加载'" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="controlAuto">
					<ul class="del-box">
                        <li v-for="item in exchange" :key="item.ids" v-tap="{methods: openUrl,  data: item}">
                            <div class="order-info">
                                <span class="order-num">订单号 {{item.trade_info_id}}</span>
                                <span class="order-time">{{item.get_purchase_record.create_time}}</span>
                            </div>
                            <div class="user-info">
                                <div class="user-img">
                                    <img :src="item.head_img_src" >
                                    <span>{{item.nickname}}</span>
                                </div>
                                <div class="curr-info">
                                    <p class="curr-main">{{item.currency_num}}{{item.get_currency_info.character}}</p>
                                    <p class="curr-second">{{item.all_fee}}CNY</p>
                                </div>
                            </div>
                            <div class="order-state">
                                <span class="state-ing">{{item.orStyle}}</span>
								<p class="state-time"> <span class="color">{{item.oroper}} </span> <span v-if="item.appeal">(已申诉)</span> </p>
                                <!-- <p class="state-time"> <span>30.00</span> <span class="color">提醒发货</span> </p> -->
                            </div>
                        </li>
					</ul>
				</mt-loadmore>
			</div>
			<div class="loadMore" v-if="allLoaded">没有更多了</div>
			<mt-popup v-model="isDisplay" :selectItems='isDisplay' ref="mtPopup" @getData='getDatetime'></mt-popup>
			<type-picker :selectItems='billType' ref="codePicker" @getData='getData'></type-picker>
		</div>
	</div>
</template>
<script>
	import otcHead from '../../components/head';
	import {Ajax, Toolkit, apis, otc} from '../../components/public';
	import typePicker from '../../components/picker';
	import {Toast, Picker, Popup, MessageBox, Loadmore, Switch} from 'mint-ui';
	import mtPopup from '../../components/select_date'

	export default {
		components: {mtPopup,otcHead,typePicker},
		data() {
			return {
				isDisplay: false,			// 选择器的显示开关
				allLoaded: false,			// 数据是否全部加载完成
				controlAuto: true,

				billType: '',				// 筛选后的类型集
				selectType: '',				// 默认及选择后的类型
				setTime: '', 				// 日期

				PAGE: 1, 					// 页码	
                SIZE: 10,	
                billData: [], 				// 后面接口获取的数据
				headimg: require('../../assets/images/03.jpg'),
				exchange: [],                // 订单列表
				
			}
		},
		mounted() { 
			this.isPlus = Toolkit.checker.isPlus();
			this.isPlus.then(() => {
				let currency = Toolkit.storage.getItem('OTC_CURRENT');
				otc.init();
				this.self = Toolkit.win.getWebview();
				this.billType = currency.map((item, index) => {
					let obj = {};
					obj.text = item.character;
					obj.value = item.id;
					return obj;
				})
				this.selectType = this.billType[0];
				this.getPurchaseRecord();
				window['freshAjax'] = () => {
					this.loadTop(true);
				}

				
			})
		},
		methods: {
			// 打开不同的页面
			openUrl(d){	
				if(d.data.get_purchase_record.status == '40' && d.data.get_purchase_record.outtime_flag == '20' && d.data.appeal) return false;
				if(d.data.get_purchase_record.status == '40' && d.data.get_purchase_record.outtime_flag == '20'){
					Toolkit.win.openWV('complaint.html', {data: d.data}, true);
				}else{
					Toolkit.win.openWV('buy_detail.html', {data: d.data}, true);
				}																	
			},
			loadBottom(){									// 交易所列表上拉一定距离后释放
				if(this.exchange.length > 1){						// methods的loadBottom方法会先于mounted运行。
					this.PAGE++;
					this.getPurchaseRecord();
				}
			},
			// 初始化日期
			initDate(){
				let now = new Date();
				let monthn = now.getMonth() + 1; 
				let yearn  = now.getFullYear(); 
 	      		this.setTime = yearn + '-' +monthn; 
			},
			loadTop(){
				this.PAGE = 1;
				this.getPurchaseRecord(true);
			},	
			// 打开状态选择
			showpick() {
				this.$refs.codePicker.open(); // 父组件调用子组件里的方法
			},
			// 状态选择后的回调text为显示文本
			getData(d) {
				this.selectType = d;
				this.exchange = [];
				this.PAGE = 1;
				this.getPurchaseRecord(true);

			},

			// 选择时间后组件的返回值 
			getDatetime(d) {
				this.setTime = d.dt;
				this.exchange = [];
				this.PAGE = 1;
				this.getPurchaseRecord(true);
			},

			// 选择时间
			checkTime() {
				this.isDisplay = true;
				this.$refs.mtPopup.open();
			},
			// 处理获取的订单数据
			dealData(d){
				return d.map((item, index) => {
					item.currency_num = Toolkit.update.fixed(item.currency_num);
					item.all_fee = Toolkit.update.fixed(item.get_purchase_record.all_fee);
					item.orStyle =  this.changeStatus(item.get_purchase_record.status);
					item.oroper = this.outtimeFlag(item.get_purchase_record.status, item.get_purchase_record.outtime_flag, item.appeal);
					return item;

				} )
			},
			// 订单状态 10生成交易 20交易失败（提现失败） 21订单已超时 30用户取消订单 40已付款 41已发货 80审核成功 81 提现中（审核已成功） 99已完成
			changeStatus(d){
				if(d == '10') return '生成交易，未付款';
				if(d == '21' || d == '30' || d == '20') return '交易失败';
				if(d == '40') return '已付款';
				if(d == '41' || d == '80' || d == '81') return '已发货';
				if(d == '99') return '交易成功';
			},
			// 当付完款之后还要看后面的状态，0生成 10订单超时 20订单超时已支付 99已处理,现在只有0和20需要处理，0是卖家未发货，提醒发货，20是去申诉
			outtimeFlag(d, styleTwo, styleThree){
				if(d == '10') return '去付款';
				if(d == '21' || d == '30' || d == '20') return '查看详情';
				if(d == '40' && styleTwo == '0') return '提醒卖家发货';
				if(d == '41' || d == '80' || d == '81') return '查看详情';
				if(d == '99') return '查看详情';
				if(d == '40' && styleTwo == '20' && styleThree) return '申诉中';
				if(d == '40' && styleTwo == '20') return '超时未发货，立即申诉';
			},
			// 买入订单列表
			getPurchaseRecord(isRead){				
				Ajax(apis.getPurchaseRecord, {
					username:Toolkit.storage.getUserInfo('username'),
					token:Toolkit.storage.getUserInfo('token'),     
					page: this.PAGE,
					size: this.SIZE,
					currency_id	: this.selectType.value,
					date: this.setTime
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

		}
	}
</script>
<style lang="less" scoped>
@assets: '../../assets';
@import '@{assets}/less/import';

.hide {display: none;}
.show {display: block;}

.bpb_screen{ height: 4.286rem; background: #002041; color: #fff;
	& > li{ width: 50%; float: left; text-align: center; line-height: 4.286rem; font-size: 1.071rem;
		i{ vertical-align: middle; font-size: .929rem;}
	}
}

.loadMore { font-size: 1.072rem;}


.mint-loadmore { width: 100%; margin-top: .071rem;}
ul.del-box{padding: 0 .714rem; overflow: hidden;
    li{width: 100%; background: #002041; padding: 0 .714rem;  color: #fff; margin-top: .714rem; border-radius: .714rem;
        .order-info{width:100%; height: 3.214rem; line-height: 3.214rem;  border-bottom: 2px solid #052F5A; 
            .order-num{float: left; font-size: 1.071rem; }
            .order-time{float: right; font-size: .857rem;}
        }
        .user-info{width: 100%; height: 5.357rem; overflow: hidden; padding-top: 1.071rem; border-bottom: 2px solid #052F5A; 
            .user-img{height: 3.214rem;float: left; line-height: 3.214rem;
                img{width: 3.214rem; height: 3.214rem; border-radius: 50%; display: inline-block;}
                span{font-size: 1.071rem; margin-left: .714rem;}
            }
            .curr-info{height: 3.214rem;float: right; text-align: right;
                .curr-main{height: 1.571rem; line-height: 1.571rem; font-size: 1.071rem;}
                .curr-second{height: 1.571rem; line-height: 1.571rem; font-size: .857rem; padding-top: .357rem;}
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
