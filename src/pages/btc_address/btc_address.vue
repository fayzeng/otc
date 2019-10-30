<template>
    <div>
        <otc-head title="BTC钱包地址">
            <template slot="header">
                <i class="iconfont slj-fanhui left otc-back"></i>
                <span class="right" v-tap="{methods: addAdress}">添加</span>
            </template>        
        </otc-head>
        <div class="wrapper">
            <div class="btc-big" v-for="item in allAddress">
                <div class="btc-operation">
                    <span class="left">{{item.url}}</span>
                    <div class="right">
                        <p v-tap="{methods: delateadress, id: item.id}">删除</p>
                        <p v-tap="{methods: editaddress, item: item}">编辑</p>
                    </div>
                </div>	
            </div>
            <div class="wallet-prompt" v-if="keys">暂无绑定钱包地址，点击右上角添加~</div>            
        </div>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import { Toast, MessageBox  } from 'mint-ui';
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public'
export default {
    name: 'btc_address',
    components:{otcHead},
	data(){
		return{
			allAddress: '',                  //钱包地址
			keys: false,                     //控制下面的那行字
		}
	},
	mounted(){
		const isPlus = Toolkit.checker.isPlus();
		isPlus.then(() => {
			this.getAllTradeAddress();
			otc.init();
			window['getAllTradeAddress'] = () => {this.getAllTradeAddress()};
		})
	},
	methods:{
		addAdress(){                        //点击添加钱包地址
			Toolkit.win.openWV('btc_addaddress.html', {}, true);
		},
		delateadress(d){                    //点击删除
			MessageBox.confirm('确定要对此钱包地址进行删除?').then(action => {
				this.delTradeAddress(d.id);
			})            
		},
		editaddress(d){                     //点击编辑
			Toolkit.win.openWV('btc_editor.html', {allData:JSON.stringify(d.item)}, true);
		},
		getAllTradeAddress(){  //获取外来币种地址
			// let that = this;
			Ajax(apis.getAllTradeAddress, {
				username:Toolkit.storage.getUserInfo('username'),
				token:Toolkit.storage.getUserInfo('token'),
				walletId: Toolkit.storage.getUserInfo('wallet_address').id,
				currencyId:'1000013',     
			}).then(res => {
				if(res.data.length>0){
					this.keys = false;
				}else{
					this.keys = true;
				}
				this.allAddress = res.data;
			}, d => {
				Toolkit.win.toast(d.info);
			})
		},
		delTradeAddress(idTwo){      	// 删除外来币种地址
			Ajax(apis.delTradeAddress, {
				username:Toolkit.storage.getUserInfo('username'),
				token:Toolkit.storage.getUserInfo('token'),      
				id:idTwo
			}).then(res => {
				this.getAllTradeAddress();
				Toolkit.win.toast(res.info);         
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
@import '@{assets}/less/mint-ui.css';
    .btc-big{background: #002041; width: 95%; margin: 10px auto; border-bottom: 1px solid #244b72;
        .btc-operation{width: 90%; height: 50px; line-height: 50px; margin: 0 auto;  color: #fff; font-size: 15px;
            .left{float: left;}
            .right{float: right;height: 50px;overflow: hidden;
                p{color: #ff8b64; padding: 0 10px;float: left;}
            }

        }
    }
    .wallet-prompt{width: 100%; line-height: 50px; background: #002041; color: #fff; text-align: center;margin-top: 10px;}
</style>

