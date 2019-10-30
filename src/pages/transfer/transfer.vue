<template>
	<div class="msg">
		<otc-head title="转账">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
			</template>
		</otc-head>

		<div class="wrapper">
			<div class="num-box">
				<div class="write-box">
                    <ul class="write-list">
                        <li><input type="text" v-model="receiver" placeholder="对方注册号（注册手机号或邮箱）" @blur="getname"></li>
                    </ul>
                    <div class="write-remack">
                        <span class="l">匹配</span>
                        <span class="r">{{ppname}}</span>
                    </div>
                    <ul class="write-list">
                        <li><input type="number" v-model="amount" :placeholder="'数量(' + character + ')'" maxlength="8" @blur="getfee"></li>
                    </ul>
                    <div class="write-remack">
                        <span class="l">手续费</span>
                        <span class="r">{{process_fee || '0.00'}}({{character}})</span>
                    </div>
                </div>
				
				<div class="all_button">
					<button v-tap="{methods: checkParams}">确认</button>
				</div>

				<div class="lay-box-bg" v-show="layBoxShow" v-tap="{methods: clearBuy}"></div>

				<div class="lay-box" v-show="layBoxShow">
					<h2>订单详情</h2>
					<ul>
						<li><label>收款人</label><p>{{ppname}}</p></li>
						<li><label>交易数量({{character}})</label><p>{{amounts}}</p></li>
					</ul>
					<button v-tap="{methods: confirmBuy}">确认交易</button>
					<a v-tap="{methods: clearBuy}">取消交易</a>
				</div>
			</div>
		</div>
		<pay-password :isDisplay="isDisplay" @getData="getPwd" ref="pwd"></pay-password>
	</div>

</template>
<script>
import otcHead from '../../components/head'
import payPassword from '../../components/pay-password'
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public'
import {Toast, MessageBox} from 'mint-ui'
import mtPopup from '../../components/picker'
import md5 from 'md5'
export default {
	components: {
		otcHead, payPassword, mtPopup
	},
	data() {
		return {
			amount: '',  					// 输入的数量
			tid: '', 						// 下单的ID
			amounts: '', 					// 交易数量
			isDisplay: false,				// 控制密码框的开关
			password:'',					// 用户输入的密码
            layBoxShow: false,				// 定单确认块的显示与隐藏
            receiver: '',
            ppname: '',
            currencyId: '',
            process_fee: '',
            character: ''
		}
	},
	mounted() {
		this.isPlus = Toolkit.checker.isPlus();
		this.isPlus.then(() => {
			otc.init();
			this.self = Toolkit.win.getWebview();
			this.currencyId = this.self.currencyId;
			this.character = Toolkit.storage.getObtain(this.currencyId).character;
		})
	},
	methods: {
		// 点击确认支付
		checkParams(){ 
			Toolkit.dom.blur();
			const reg = /^\d+(\.\d{1,4})?$/
			if(!reg.test(this.amount)){
				Toolkit.win.toast('请输入正确的数量');
				return;
			}
			if(this.amount.substr(-1, 1) == '.'){
				this.amount = this.amount.substr(0, this.amount.length-1);
			}
			const state = localStorage.getItem('OTC_PAYPASS');
			if(!state){
				MessageBox.confirm('您未设置支付密码，是否前往设置?').then(action => {
					Toolkit.win.openWV('psd_payset.html');
				})
			} else{
				this.subAjax();
			}					
		},

		// 取消订单
		clearBuy: function(){ 
			this.layBoxShow = false;
		},
		// 确认购买, 打开密码框
		confirmBuy: function(){
			this.$refs.pwd.open(true);
			this.layBoxShow = false;
			Toolkit.dom.blur();
		},
		// 下单请求
		subAjax(){
			Ajax(apis.prePay, {
				username: Toolkit.storage.getUserInfo('username'),
				token: Toolkit.storage.getUserInfo('token'),  
				receiver: this.receiver,
				amount: this.amount,
				currencyId: this.currencyId
			}).then(res => {
				this.tid = res.data.id;

				this.amounts = res.data.all_fee;
				this.layBoxShow = true;						
			}, d => {
				Toolkit.win.toast(d.info);
			})
		},
		// 输完密码之后的操作
		getPwd(d){												
			this.password = d.pwd.join('');
			this.purchase();
		},
		// 支付请求
		purchase(){
			Ajax(apis.pays, {
				username: Toolkit.storage.getUserInfo('username'),
				token: Toolkit.storage.getUserInfo('token'),  
				tid: this.tid,
				password: md5(this.password)
			}).then(res => {
				Toolkit.win.toast(res.info);
				this.$refs.pwd.tips(true);
				Toolkit.win.evalID('homepage.html', 'freshAjax');	
				Toolkit.win.evalID('BPB_detail.html', 'freshAjax');	
				setTimeout(() => {
                    this.self.close('pop-out');
                }, 300)				
			}, d => {
				if(d.code == '5030'){this.$refs.pwd.tips(false);} 
				else Toolkit.win.toast(d.info);
				
			})
        },
        // 数量手续费计算
        getfee() {
            Ajax(apis.getTradeFee, {
                username: Toolkit.storage.getUserInfo('username'),
                token: Toolkit.storage.getUserInfo('token'),
                cid: this.currencyId,
                type: '40'          // 10充值 20提币 30普通交易 31币币交易 40转账
            }).then(res => {
                this.process_fee = (this.amount * res.data.process_percent_fee / 10000 + (res.data.process_fixed_fee - 0)).toFixed(4);
            }, d => {
                Toolkit.win.toast(d.info);
            })

        },
        // 获取转账接收方信息
        getname() {
            Ajax(apis.getUserInfoByUsername, {
                username: Toolkit.storage.getUserInfo('username'),
                token: Toolkit.storage.getUserInfo('token'),
                receiver: this.receiver
            }).then(res => {
                this.ppname = res.data.id_card_name_text;
            }, d => {
                Toolkit.win.toast(d.info);
            })

        }
	}
}
</script>
<style lang="less">
@assets: '../../assets';
@import '@{assets}/less/import';
.write-box{ padding: 1.143rem;
    li{ border-bottom: 1px solid #244b72;
        input {flex-wrap: nowrap;text-align: left;height: 3.929rem;line-height: 1.572rem;font-size: 1.286rem;color: #fff;}
        input:disabled{color:#999;}
    }

    .write-remack{ height: 2.857rem; line-height: 2.857rem; color: #fff;
        span.l{display: inline-block; float: left;}
        span.r{display: inline-block; float: right;}
    }
}

.lay-box-bg{ position: absolute; z-index: 9999998; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8);}
.lay-box{ position: absolute; z-index: 9999999; bottom: 0; left: 0; width: 100%; height: 56%; background: #00152A; padding: 16px; border-radius: 5px; box-shadow: 0px 1px 2px 0px #ccc;}
.lay-box h2{ text-align: center; font-size: 18px; font-weight: bold; color: #C0C0C0;}
.lay-box ul{ padding: 10px 0; margin-top: 16px;}
.lay-box ul li{ height: 40px; line-height: 40px; font-size: 16px; color: #C0C0C0;}
.lay-box ul li p{ float: right;}
.lay-box button{ background: #422ae5; color: #fff; display: block; width: 120px; height: 40px; line-height: 40px; margin: 10px auto;}
.lay-box a{ display: block; text-align: center; text-decoration: underline; color: #C0C0C0;}			

</style>
