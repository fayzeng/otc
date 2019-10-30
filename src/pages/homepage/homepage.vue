<template>
    <div class="msg">
        <otc-head title="资产"></otc-head>
        <div class="wrapper">
            <div class="bigbox">
                <mt-loadmore :top-method="loadTop" ref="loadmore">
                <div class="box-content">
                    <div class="account-num">
                        <i class="icon"></i>
                        <h3>资产估值</h3>
                        <p>{{assets}}<span> (CNY)</span></p>
                    </div>
                    <ul class="currency-list">
                        <li v-for="item in billDetail" :key="item.id" v-tap="{methods: openUrl, urlo: 'BPB_detail.html', account: item}">
                            <h3><em>{{item.character[0]}}</em>{{item.character}}</h3>
                            <p>
                                <b>{{item.amount}}</b>
                                <span>≈ {{item.price}}(CNY)</span>
                                <em><i class="iconfont slj-more"></i></em>
                            </p>
                        </li>
                    </ul> 
                </div> 
                </mt-loadmore>
            </div>
            
        </div>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import {Ajax, Toolkit, Vc, apis} from  '../../components/public';
import { Toast, Loadmore } from 'mint-ui';

export default{
	components: {
		otcHead
	},
    data(){
        return{
            assets: 0.00,
            billDetail:''
        }
    },
    mounted(){
        this.openwv =  Toolkit.win;
        this.isPlus =  Toolkit.checker.isPlus();
        this.isPlus.then(() => {
            this.getUserAccount(); 
			this.getCurrencyList();
			this.getUserReceiveInfo();
			window['freshAjax'] = () => { 
				this.getUserAccount();
				this.getCurrencyList();
				this.getUserReceiveInfo();
			}
        })
        
    },
    methods: {
        openUrl(d){
            this.openwv.openWV(d.urlo,{
                account: d.account
            }, true);
        },
        // 处理数据
        dealData(d){
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
            }).then(res => {
                this.billDetail = this.dealData(res.data);
                Toolkit.storage.setItem('OTC_ACCOUNT', res.data);
                this.$refs.loadmore.onTopLoaded();
            }, d => {
                Toolkit.win.toast(d.info);
                this.$refs.loadmore.onTopLoaded();
            })
            
        },
		// 获取系统可用币种
		getCurrencyList(){
			Ajax(apis.getCurrencyList,{
					username: Toolkit.storage.getUserInfo('username'),
					token: Toolkit.storage.getUserInfo('token'),
			}).then(res => {
					Toolkit.storage.setItem('OTC_CURRENT', res.data); 
			}, d => {
					Toolkit.win.toast(d.info);
			})
		},
        loadTop(){
            this.getUserAccount();
        },
		// 获取用户收款信息
		getUserReceiveInfo(){
			Ajax(apis.getUserReceiveInfo,{
				username: Toolkit.storage.getUserInfo('username'),
				token: Toolkit.storage.getUserInfo('token'),
			}).then(res => {
				Toolkit.storage.setItem('OTC_RECEIVEINFO', res.data); 
			}, d => {
				// Toolkit.win.toast(d.info);
			})
		},
		
    }
}
</script>
<style lang="less">
@assets: '../../assets';
@import '@{assets}/less/import';

.account-num {
    background: url( '@{assets}/images/home_bg.png'); 
    width: 100%; height: 10.571rem; background-size: 100%;
    color: #fff; text-align: center; padding-top: 1.429rem;
    .icon{ 
        background: url('@{assets}/images/home_zc.png');
        background-size: cover;
        width: 2.857rem; height: 2.857rem; display: block;
        margin: 0 auto; margin-bottom: .714rem;
    }	
    p{ font-size: 1.857rem; line-height: 200%;
        span{ font-size: 1rem;}
    }
}

.mint-loadmore{width: 100%; height: 100%;}

.currency-list{ padding: 0 1.429rem; color: #fff;
    li{ height: 6.429rem; width: 100%; padding: 1.429rem 0; border-bottom: .143rem #244b72 solid;
        h3{ width: 50%; float: left; line-height: 3.571rem; font-size: 1.571rem;
            em{ display: inline-block; width: 3.571rem; height: 3.571rem; border-radius: 50%; 
                margin-right: .571rem; background: #fff; color: #333;
                text-align: center;}
        }
        p{ width: 50%; float: right; text-align: right; position: relative;
            b{ display: block; line-height: 2.143rem; padding-right: .714rem; font-size: 1.071rem;}
            span{ line-height: 2.143rem; padding-right: .714rem; font-size: .929rem;}
            em{ display: block; width: .429rem; height: 4.286rem; line-height: 4.286rem; position: absolute; right: 0; top: 0;}
        }
    }
}


</style>