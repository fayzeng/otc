<template>
	<div class="msg">
		<otc-head :title="getValue.character || ''">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
			</template>
		</otc-head>

		<div class="wrapper">
			<div class="account-num">
				<h3>
					<em>{{currencyData ? currencyData.character[0] : ''}}</em>
					{{currencyData.amount}}
				</h3>
				<p>≈ {{currencyData.price}}<span> (CNY)</span></p>
			</div>
			<div class="bpb_role">
				<ul class="bpb_role_link">
					<li v-tap="{methods: openUrl, url: 'BPB_detail_cash.html'}"><i class="icon icon1"></i>提币</li>
					<li v-tap="{methods: openUrl, url: 'recharge.html'}"><i class="icon icon2"></i>充值</li>
					<li v-tap="{methods: openUrl, url: 'transfer.html'}"><i class="icon icon3"></i>转账</li>
				</ul>
				<div class="home-title">
					<span>交易记录</span>
				</div>
			</div>
			<div class="bpb_box">
				<ul class="bpb_screen">
					<li>
						<span v-tap="{methods: checkTime}" class="time">{{setTime || '交易时间'}} <i class="iconfont slj-riqi"></i> </span>
					</li>
					<li>
						<span v-tap="{methods: showpick}">{{selectType.text || '交易类型'}} <i class="iconfont slj-xiangxia"></i> </span>
					</li>
				</ul>
				<mt-loadmore :bottom-method="loadBottom" :bottomPullText="'上拉加载'" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="controlAuto">
					<ul class="del-box">
						<li v-for="item in billData" v-tap="{methods: openUrl, url: 'detail.html', bill: item }" :key="item.ids">
							<div class="acc-title">
								<span>{{item.typeName}}</span>
								<p>{{item.create_time}}</p>
							</div>
							<div class="acc-aum">
								<span>{{item.chart}}<em>{{item.fee}}</em></span>
								<p>{{item.statusText}}</p>
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
	import typePicker from '../../components/picker'
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
				
				currencyData: '',
				getValue: '',				// 上页传来的数据
				billData: [] 				// 后面接口获取的数据
			}
		},
		mounted() {
			this.isPlus = Toolkit.checker.isPlus();
			this.isPlus.then(() => {
				otc.init();
				window['freshAjax'] = () => { 
					this.getCurrencyTradeList(true);
					this.getUserAccount();
				}
				this.self = Toolkit.win.getWebview();
				// this.initDate();

				this.getValue = this.self.account;
				
				this.getMatchJson();
				
				
			})
		},
		methods: {

			// 初始化交易类型
			initBillType(){
				const matchJson = this.matchJson;
				const type = [{text: '全部', value: '0'}];
				for (const key in matchJson) {
					if(key == 'remark') continue;
					const obj = {}
					if(Array.isArray(matchJson[key])){
						const sonArr = matchJson[key].map(item => {
							return {
								value: key,
								text: item.name
							}
						})
						type.push(...sonArr);
					}else{
						obj.value = key;
						obj.text = matchJson[key].name;
						type.push(obj);
					}
					
				}
				this.billType = type;
				this.selectType = type[0];
			},

			// 初始化日期
			initDate(){
				let now = new Date();
				let monthn = now.getMonth() + 1; 
				let yearn  = now.getFullYear(); 
 	      		this.setTime = yearn + '-' +monthn; 
			},

			// 详情列表上拉一定距离后释放
			loadBottom(){										
				if(this.billData.length > 1){						// methods的loadBottom方法会先于mounted运行。
					this.PAGE++;
					this.getCurrencyTradeList();
				}
			},	

			// 打开状态选择
			showpick() {
				this.$refs.codePicker.open(); // 父组件调用子组件里的方法
			},

			// 状态选择后的回调text为显示文本
			getData(d) {
				this.selectType = d;
				this.billData = [];
				this.getCurrencyTradeList();
			},

			// 选择时间后组件的返回值 
			getDatetime(d) {
				this.setTime = d.dt;
				this.billData = [];
				this.getCurrencyTradeList();
			},

			// 选择时间
			checkTime() {
				this.isDisplay = true;
				this.$refs.mtPopup.open();
			},

			// 交易结果
			resultType(type) {
				if (type == '10' || type == '40' || type == '41') return '等待交易';
				if (type == '20') return '已取消';
				if (type == '99') return '交易成功';
				if (type == '81' || type == '80') return '提现中';
				if (type == '30') return '交易失败';
			},

			// 跳转
			openUrl(d) {
				Toolkit.win.openWV(d.url, {
					currencyId: this.getValue.currency_id,
					data: d.bill || ''
				}, true);
			},

			// 获取交易类型匹配JSON
			getMatchJson(item){
				Ajax(apis.tradeTypeDetail, {}).catch(res => {
					this.matchJson = res;
					this.initBillType();
					this.getCurrencyTradeList();
					this.getUserAccount();
				})
			},

			// 处理数据
			dealData(d){
				const matchJson = this.matchJson;
				
				let data = d.map((item, index) => {
					const type = item.type.toString() + item.sonType;
					let newMatch = matchJson[type];
					if(!newMatch){
						return false;
					}
					if(item.type == '31'){
						newMatch = matchJson[type].filter(son => {
							return item[son.field] == this.getValue.currency_id;
						})[0];
					}
					console.log('feeKey' + JSON.stringify(newMatch));
					const feeKey = newMatch.amtField;
					item.cId = Toolkit.storage.getObtain(this.getValue.currency_id).character;
					item.fee = Toolkit.update.fixed(item[feeKey]);
					item.price = Toolkit.update.fixed(item.price);
					item.process_fee = Toolkit.update.fixed(item.process_fee);
					item.typeName = newMatch.name;
					item.chart = newMatch.chart;
					item.statusText = this.resultType(item.status);
					return item;
				})
				console.log('data' + JSON.stringify(data));
				for( let i = 0; i< data.length; i++){
					if(!data[i]){
						data.splice(i, 1);
						i--;
					}
				}
				console.log('dataTWO' + JSON.stringify(data));
				return data;
				
			},
			// 获取币种交易详情
			getCurrencyTradeList(isRead) {
				Ajax(apis.getCurrencyTradeList, {
					username: Toolkit.storage.getUserInfo('username'),
					token: Toolkit.storage.getUserInfo('token'),
					currencyId: this.getValue.currency_id,
					page: this.PAGE,
					size: this.SIZE,
					type: this.selectType.value,
					date: this.setTime
				}).then(res => {
					const length = res.data.length;
					if(isRead) this.billData = this.dealData(res.data);
					else this.billData.push(...this.dealData(res.data));
					this.$refs.loadmore.onBottomLoaded();   // 对组件重新定位，就是让下面的加载字样消失
					if(length < 10){
						this.allLoaded = true;
					}else{
						this.allLoaded = false;
					}
					this.$nextTick(() => {
						if(this.PAGE == 1) document.getElementsByClassName('wrapper')[0].scrollTop = 0;
					})
				}, d => {
					Toolkit.win.toast(d.info);
					this.$refs.loadmore.onBottomLoaded();   // 对组件重新定位，就是让下面的加载字样消失
					this.allLoaded = true;                  // 数据取完了让上拉加载的效果消失
				})
			},
			// 处理数据
			dealData2(d){
				return d.map((item, index) => {
					item.price = Toolkit.update.fixed(item.price);
					item.amount = Toolkit.update.fixed(item.amount);
					this.assets = Toolkit.update.fixed(Number(this.assets) + Number(item.price));
					return item;
				})
			},
			// 获取用户账户信息
			getUserAccount(){
				Ajax(apis.getUserAccount,{                
					username: Toolkit.storage.getUserInfo('username'),
					token: Toolkit.storage.getUserInfo('token'),
					currency_id: this.getValue.currency_id
				}).then(res => {
					this.currencyData = this.dealData2(res.data)[0];
				}, d => {
					Toolkit.win.toast(d.info);
				})
				
			}
		}
	}
</script>
<style lang="less" scoped>
@assets: '../../assets';
@import '@{assets}/less/import';

.hide {display: none;}
.show {display: block;}

.account-num {
	background: url( '@{assets}/images/home_bg.png'); background-size: 100%;
	width: 100%; height: 10.571rem; text-align: center;
	color: #fff; text-align: center; padding-top: 1.429rem;
	h3{ width: 100%; float: left; font-size: 1.857rem; line-height: 2.429rem;
		em{ display: block; width: 3.571rem; height: 3.571rem; border-radius: 50%; 
			margin: 0 auto; margin-bottom: .714rem; background: #fff; color: #333; line-height: 3.571rem;
			text-align: center;}
	}	
	p{ font-size: .929rem; line-height: 200%;}
}

.bpb_role{ width: 100%; color: #fff; padding: 1.429rem; padding-bottom: .714rem;
	.bpb_role_link{ padding: .714rem; padding-bottom: 1.429rem; overflow: hidden;
		li{ width: 2.643rem; float: left; text-align: center; margin-left: 3.571rem;
			i.icon{ width: 2.643rem; height: 2.643rem; display: block;
					margin: 0 auto; margin-bottom: .714rem;}
			i.icon1{ background: url('@{assets}/images/home_tb.png'); background-size: cover;}
			i.icon2{ background: url('@{assets}/images/home_cz.png'); background-size: cover;}
			i.icon3{ background: url('@{assets}/images/home_zz.png'); background-size: cover;}
		}
	}
}

.bpb_screen{ height: 4.286rem; background: #002041; color: #fff;
	& > li{ width: 50%; float: left; text-align: center; line-height: 4.286rem; font-size: 1.071rem;
		i{ vertical-align: middle; font-size: .929rem;}
	}
}

.loadMore { font-size: 1.072rem;}

.home-title { width: 100%; clear: both;
	span {font-size: 1rem;color: #fff;font-weight: bold;vertical-align: middle;border-left: 2px #0075eb solid;padding-left: 8px;}
}

.mint-loadmore { width: 100%; margin-top: .071rem;}
ul.del-box li {padding: 1.714rem 1.429rem; color: #fff; margin-bottom: .071rem; background: #002041;
	div {display: inline-block;font-size: 1.072rem;
		p {padding-top: 1.429rem;line-height: 100%;}
	}
	.acc-title span {font-size: 1.072rem;color: #fff;}
	.acc-aum {float: right;text-align: right;
		p {font-weight: bold;font-size: 1rem;}
		.add {color: #ee4a4a;}
	}

}
</style>
