<template>
    <div>
        <otc-head title="编辑">
            <template slot="header">
                <i class="iconfont slj-fanhui left otc-back" ></i>
            </template>        
        </otc-head>
        <div class="wrapper">
            <ul class="public_input">
                <li>
                    <span>当前地址</span>
                    <input type="text" disabled="disabled">
                    <p>{{selfAdd.url}}</p>
                </li>
                <li>
                    <input type="text" :placeholder="'输入BTC钱包地址'"  v-model="walletAddress"/>
                </li>
                <li>
                    <input type="text" :placeholder="'再次输入BTC钱包地址'" v-model="confirm"/>
                </li>
            </ul> 
            <div class="all_button"> 
                <button  v-tap="{methods: checkParams}" >确认修改</button>
            </div>	                                         
        </div>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import { Toast, MessageBox  } from 'mint-ui';
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public';
export default {
    name: 'btc_editor',
		components:{otcHead},
    data(){
        return{
            walletAddress: '', //钱包地址
						confirm: '',       //再次确认
						selfAdd:'',       //当前钱包地址
        }
    },
		mounted(){
			this.isPlus =  Toolkit.checker.isPlus();
			this.isPlus.then(() => {
				otc.init();
				this.selfAdd = JSON.parse(Toolkit.win.getWebview().allData);
			})
		},
    methods:{
        checkParams(){                                                  //点击确认修改
            let that = this;
            if(!that.walletAddress){
                Toolkit.win.toast('请输入钱包地址');
                return false;
            }
            if(that.walletAddress !== that.confirm){
                Toolkit.win.toast('两次输入的地址要保持一致');
                return false;
            }
            if(that.walletAddress == that.selfAdd.url){
                Toolkit.win.toast('输入的新地址不能和当前地址一样');
                return false;						
            }
            this.updateTradeAddress();
        },
        updateTradeAddress(){                                           //修改外来币种接口
            Ajax(apis.updateTradeAddress, {
                username:Toolkit.storage.getUserInfo('username'),
                token:Toolkit.storage.getUserInfo('token'),
                id: this.selfAdd.id,
								url: this.walletAddress,   
            }).then(res => {
                // Toolkit.win.evalID('homepage.html', 'freshAjax');
                Toolkit.win.toast(res.info);
                setTimeout(function(){
                    Toolkit.win.evalID('btc_address.html', 'getAllTradeAddress');
                    Toolkit.win.getWebview().close();
                }, 500)
            }, d => {
                Toolkit.win.toast(d.info);
            })
        }
    },

}
</script>
<style lang='less'>
@assets: '../../assets/';
@import '@{assets}/less/import';
@import '@{assets}/less/mint-ui.css';
    .public_input{
        li{
            span{min-width: 20% !important;}
            p{flex-wrap: nowrap;text-align: right;}
        }

    }
</style>

