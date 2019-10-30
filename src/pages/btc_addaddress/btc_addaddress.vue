<template>
    <div>
        <otc-head title="绑定BTC钱包地址">
            <template slot="header">
                <i class="iconfont slj-fanhui left otc-back" ></i>
            </template>        
        </otc-head>
        <div class="wrapper">
            <ul class="public_input">
                <li>
                    <input type="text"  v-model="walletAddress" :placeholder="'输入BTC钱包地址'" />
                </li>
                <li>
                    <input type="text" v-model="confirm" :placeholder="'再次输入BTC钱包地址'" />
                </li>
            </ul>     
            <div class="all_button">
                <button v-tap="{methods: checkParams}">确认</button>
            </div>                              
        </div>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import { Toast  } from 'mint-ui';
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public'
export default {
    name: 'btc_addaddress',
	components:{otcHead},
    data(){
        return{
            walletAddress: '', //钱包地址
			confirm: '',       //再次确认
        }
    },
	mounted(){
		const isPlus = Toolkit.checker.isPlus();
		isPlus.then(() => {
			otc.init();
		})
	},
    methods:{
        checkParams(){          //点击确认
            let that = this;
            if(!that.walletAddress){
                Toolkit.win.toast('请输入钱包地址');
                return false;
            }
            if(that.walletAddress !== that.confirm){
                Toolkit.win.toast('两次输入的地址要保持一致');
                return false;
            }
            this.openNewCurrency();
        },
        openNewCurrency(){				// 新增外来币种账户
            Ajax(apis.openNewCurrency, {
                username:Toolkit.storage.getUserInfo('username'),
                token:Toolkit.storage.getUserInfo('token'),  
                currencyId: 1000013,
			    walletId: '',
			    tradeAddress: this.walletAddress,   
                }).then(res => {
                    Toolkit.win.toast(res.info);
                    setTimeout(function(){
                         Toolkit.win.evalID('btc_address.html', 'getAllTradeAddress');
                         Toolkit.win.getWebview().close();
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

