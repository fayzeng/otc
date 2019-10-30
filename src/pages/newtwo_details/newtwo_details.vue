<template>
    <div>
        <otc-head title="交易详情">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
			</template>        
		</otc-head>
        <div class="wrapper">
			<div class="login" >
				<div class="iconfont" >{{character}}</div>
				<p>{{addDel(billDetail.type)}}<em>{{billDetail ? Fixed(billDetail.get_trade_detail_list[0].currency_num) : ''}}</em></p>
			</div>	
			<ul class="pualic_detail_list"> 
				
                <li>
                    <h3>交易单号</h3>
                    <span>{{billDetail.id}}</span>
                </li>
                <li>
                    <h3>交易单价</h3>
                    <span>{{Fixed(billDetail.unit_price)}}</span>
                </li>                
                <li>
                    <h3>交易类型</h3>
                    <span>{{tradeType(billDetail.type)}}</span>
                </li>
                <li>
                    <h3>交易状态</h3>
                    <span class="yt01id">{{resultType(billDetail.status)}}</span>
                </li>
                <li>
                    <h3>手续费（CNY）</h3>
                    <span>{{processMon(billDetail)}}</span>
                    <!--<span>{{Fixed(billDetail.process_fee)}}</span>-->
                </li>
                <li>
                    <h3>相关商品ID</h3>
                    <span>{{billDetail.exchange_id}}</span>
                </li>
                 <li>
                    <h3>对方BTC钱包地址</h3>
                    <span class="copy-text" v-tap="{methods: copys}">复制</span>
                    <span class="omit" id="omit">{{billDetail.get_trade_detail_list ? billDetail.get_trade_detail_list[0].trade_address : '' }}</span>  
                </li>   
                <li v-if="billDetail.type == '20' ">
                    <h3>交易时间</h3>
                    <span>{{billDetail.create_time}}</span>
                </li>                
                 <li v-if="billDetail.type == '10' ">
                    <h3>下单时间</h3>
                    <span>{{billDetail.create_time}}</span>
                </li>  
                 <li>
                    <h3>交易时间</h3>
                    <span>{{billDetail.update_time}}</span>
                </li>                
            </ul>
            <div class="footer"  v-if="(billDetail.type == '10' && billDetail.status == '41') ||  (billDetail.type == '20' && billDetail.status == '40') ">
            	<p v-if="billDetail.sonType == '10' && billDetail.status == '41'">待确认收货</p>
            	<p >待确认发货</p>
            	<div class="foot-but">
            		<!--<div class="cancel">取消订单</div>-->
            		<div class="pay payone" v-if="billDetail.type == '10' && billDetail.status == '41'" v-tap="{methods: collect}">确认收货</div>
            		<div class="pay" v-else v-tap="{methods: delivery}">确认发货</div>
            	</div>
            </div>			
					
        </div>
    </div>
</template>
<script>
	import otcHead from '../../components/head';
	import { Toast, MessageBox, Loadmore } from 'mint-ui';	
	import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public.js'
export default {
	name: 'newtwo_details',
	components:{otcHead},
	data(){
		return{
			character: '',
			billDetail: '',
		}
	},
	created(){
		const isPlus = Toolkit.checker.isPlus();
		isPlus.then(() => {
			this.self = Toolkit.win.getWebview();
			otc.init();
			console.log(this.self.billDetail)
			this.billDetail = this.self.billDetail;
			this.character = this.getCharacter();
		})	
	},	
	methods:{
		getCharacter(){
			return Toolkit.storage.getObtain(this.billDetail.get_trade_detail_list[1].currency_id).character;
		},
        copys(){            // 点击复制
			var bank = (this.billDetail.get_trade_detail_list[0].trade_address).replace(/\s/g, "");
			if(!window.plus){return};
			if(plus.os.name == 'Android'){
				var Context = plus.android.importClass("android.content.Context");
				var main = plus.android.runtimeMainActivity();
				var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
				Toolkit.win.toast("复制邀请码成功");
				return plus.android.invoke(clip, "setText", bank);
			}else{
				var UIPasteboard = plus.ios.importClass("UIPasteboard");
				var generalPasteboard = UIPasteboard.generalPasteboard();
				// 设置/获取文本内容:
				generalPasteboard.setValueforPasteboardType(bank, "public.utf8-plain-text");
				var _val = generalPasteboard.valueForPasteboardType("public.utf8-plain-text");
				//应用在后台的时候获取剪切版数据被系统限制了，只有在app内才能访问接口
				var _val = generalPasteboard.plusCallMethod({
					valueForPasteboardType: "public.utf8-plain-text"
				});
				console.log("ios复制返回的数据是：", _val);
				Toolkit.win.toast("复制钱包地址成功");
				return _val || '';                
			}
		},
		Fixed: function(num){				// 统一保留币种数量的小数位
			return Toolkit.storage.setToFixed(num);
		},
		processMon: function(x){			// 手续费的计算
			if(x){
				var that  = this;
				var Id = Toolkit.storage.getUserInfo('id');
				for(var i=0; i<x.get_trade_detail_list.length; i++){
					if(x.get_trade_detail_list[i].user_base_id == Id){
						return that.Fixed(x.get_trade_detail_list[i].process_fee);
					}
				}
			}
		},
		resultType: function(type){ 		//结果判断
			if(type == '10' || type == '40' || type == '41'  ){
				return '等待交易';
			} else if(type == '10'){
				return '已取消'
			} else if(type == '99'){
				return '交易成功';
			} else if(type == '30'){
				return '交易失败';
			} else{
				return '等待交易';
			}
		},									// 类型判断
		tradeType: function(type){			
			if(type == '10') return '买入';
			if(type == '20') return '卖出';
		},
		addDel: function(type){					// 币种前面的加减号
			if(type == '10') return '+';
			if(type == '20') return '-';
		},
		collect: function(){  //确认收货
			this.takeDeliveryGoods();
		},	
		delivery: function(){  //确认发货
			this.deliveryGoods();
		},
		takeDeliveryGoods(){			// 确认收货
			Ajax(apis.takeDeliveryGoods, {
				username:Toolkit.storage.getUserInfo('username'),
				token:Toolkit.storage.getUserInfo('token'),
				tradeInfoId: this.billDetail.id
			}).then(res => {
				let that = this;
				Toolkit.win.toast(res.info);
				Toolkit.win.evalID('homepage.html', 'freshAjax');
				Toolkit.win.evalID('transaction.html',  'freshAjax');
				setTimeout(function(){
					that.self.close();
				}, 500)
			}, d => {
				Toolkit.win.toast(d.info);
			})			
		},
		deliveryGoods(){				// 确认发货
			Ajax(apis.deliveryGoods, {
				username:Toolkit.storage.getUserInfo('username'),
				token:Toolkit.storage.getUserInfo('token'),
				tradeInfoId: this.billDetail.id	 
			}).then(res => {
				let that = this;
				Toolkit.win.toast(res.info);
				Toolkit.win.evalID('homepage.html', 'freshAjax');
				Toolkit.win.evalID('transaction.html',  'freshAjax');
				setTimeout(function(){
					that.self.close();
				}, 500)
			}, d => {
				Toolkit.win.toast(d.info);
			})			
		},
	},
}
</script>
<style lang='less'>
@assets: '../../assets/';
@import '@{assets}/less/import';
	.login {width: 100%;height:10.571rem;text-align: center;color: #fff;background: linear-gradient(to right, #03376e , #3156a1);
		.iconfont{ display: inline-block; width: 2.857rem;height: 2.857rem; line-height: 2.857rem; font-size: 1.571rem; padding: 0 .643rem; margin-top: 1.786rem; font-weight: 800;}
		.icon-zhifubao1 {background: #4199F0;}
		p{font-size: 1.857rem; color: #fff; font-weight: bold; margin-top: .714rem; line-height: 100%;}
	}
	.pualic_detail_list{ margin-bottom: 2.143rem;
		li{
			.omit{text-overflow: ellipsis; width: 7.143rem; overflow: hidden;}
			.copy-text{color: #64ACF3; padding: 0 .714rem;}
			.yt01id {color: #ff8b64; }
		}
	}
	.footer {width: 100%;height: 4.214rem;line-height: 4.214rem;background: #002041;padding: 0 1.429rem;
		div{display: inline-block;}
		p{display: inline-block; font-size: 1.071rem; color: #fff;font-weight: bold;}
		.foot-but {float: right;
			div {height: 2.143rem;line-height: 2.143rem;padding: 0 0.715rem; text-align: center; border: .071rem solid #4341EF;border-radius: 1.786rem;}
			.pay {width: auto;background: #452AE5;color: #fff;}
			.payone {background: none;}
		}
	}
</style>

