<template>
    <div class="msg">
        <otc-head title="首页"></otc-head>

        <div class="wrapper">
            <mt-loadmore :top-method="loadTop" ref="loadmore">
            <div class="box-content">
                <div class="account-num">
                    <!-- <h3>钱包地址</h3>
                    <p id="biao1">111111111</p>
                    <span class="copy" v-tap="{methods: copy}">复制</span> -->
                </div>
                <div class="banner"><img src="../../assets/images/banner.png"></div>
                <ul class="shop-list">
                    <li v-tap="{methods: openUrl, urlo: 'scan.html'}">
                        <p><em class="color01"><i class="iconfont slj-saoma"></i></em>扫一扫</p>
                    </li>
                    <li v-tap="{methods: openUrl, urlo: 'receiptCode.html'}">
                        <p><em class="color02"><i class="iconfont slj-erweima"></i></em>收款码</p>
                    </li>
                    <li v-tap="{methods: openUrl, urlo: 'recharge.html'}">
                        <p><em class="color03"><i class="iconfont slj-qian"></i></em>充值</p>
                    </li>
                    <li v-tap="{methods: openUrl, urlo: 'cash.html'}">
                        <p><em class="color04"><i class="iconfont slj-tixian"></i></em>提现</p>
                    </li>					
                </ul>
                
                <div class="home-title">
                    <span>明细</span>
                </div>
                    
                <ul class="home_bill_list">
                    <li v-for="item in billDetail" :key="item.id" v-tap="{methods: openUrl, urlo: 'BPB_detail.html', account: item}">
                        <h3><em :class="item.get_currency_info.character[0]">{{item.get_currency_info.character[0]}}</em>{{item.get_currency_info.character}}</h3>
                        <span class="yt01id">{{toFixed(item.amount)}}</span>
                    </li>
                </ul>
            </div> 
            </mt-loadmore>
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
            billDetail:''
        }
    },
    mounted(){
        this.openwv =  Toolkit.win;
        this.isPlus =  Toolkit.checker.isPlus();
        this.isPlus.then(() => {
            this.getUserAccount();
			this.getCurrencyList();
			window['freshAjax'] = () => { 
				this.getUserAccount();
				this.getCurrencyList();
			}
        })
        
    },
    methods: {
//         copy(){
//             var banknumber = document.getElementById("biao1").innerHTML;
// 			var bank = banknumber.replace(/\s/g, ""); //清除所有空格
// 			
// 			if(!window.plus) return;
// 			if(plus.os.name == 'Android') {
// 				var Context = plus.android.importClass("android.content.Context");
// 				
// 				var main = plus.android.runtimeMainActivity();
// 				var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
// 				Toolkit.win.toast("复制成功");
// 				return plus.android.invoke(clip, "setText", bank);
// 			} else {
// 				var UIPasteboard = plus.ios.importClass("UIPasteboard");
// 				var generalPasteboard = UIPasteboard.generalPasteboard();
// 				// 设置/获取文本内容:
// 				generalPasteboard.setValueforPasteboardType(bank, "public.utf8-plain-text");
// 				var _val = generalPasteboard.valueForPasteboardType("public.utf8-plain-text");
// 				//应用在后台的时候获取剪切版数据被系统限制了，只有在app内才能访问接口
// 				var _val = generalPasteboard.plusCallMethod({
// 					valueForPasteboardType: "public.utf8-plain-text"
// 				});
// 				Toolkit.win.toast("复制成功");
// 				return _val || '';
// 			}
//         },
        openUrl(d){
            this.openwv.openWV(d.urlo,{account: d.account}, true);
        },
		toFixed(num){
			if(!num) return 0.0000;
			return (num - 0).toFixed(4);
		},
		// 获取用户账户信息
        getUserAccount(){
            Ajax(apis.getUserAccount,{                
                username: Toolkit.storage.getUserInfo('username'),
                token: Toolkit.storage.getUserInfo('token'),
            }).then(res => {
				this.billDetail = res.data;
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
        }
    }
}
</script>
<style lang="less">
@assets: '../../assets';
@import '@{assets}/less/import';

.account-num {
    background: url( '@{assets}/images/home-bg.png'); background-size: cover; width: 100%; height: 10.715rem; color: #fff; padding: 0 1.43rem;; padding-top: 2.144rem;
    .copy { 
        font-size: .93rem; font-weight: bold; display: block; border-radius: 14px; width: 4.286rem; height: 2rem; line-height: 2.144rem; background: #00152A; text-align: center;
    }	
    #biao1{ font-size: 1.287rem; margin: .715rem 0;}
}

.banner{ 
    width: 100%; height: 10.715rem;
    img{ width: 100%; height: 100%;}
}

.shop-list{
    width: 100%; height: auto; overflow: hidden; background: #002041;
    li{
        float: left;width: 25%;height: 2.857rem; text-align: center;overflow: hidden;
        p{font-size: .929rem; margin-top: .714rem; height: 1.429rem; width: 100%; color: #fff;} 
        em{ width: 1.215rem; line-height: 1.215rem; margin-right: 2px; margin-top: 3px; border-radius: 50%; display: inline-block;
            i{ font-size: .787rem;}
        }
        em.color01{ background: #399f83;}
        em.color02{ background: #db8740;}
        em.color03{ background: #53cc4e;}
        em.color04{ background: #577a94;}
    }
}

.home-title{width: 100%; height:3.215rem; line-height: 3.215rem; padding-left: 1.429rem; background: #032f5b;
    span{font-size: 1.072rem; color: #fff; font-weight: bold; vertical-align: middle; border-left: 2px #0075eb solid; padding-left: 8px;}
}

.bill-list {margin-bottom: 2.144rem; padding: 0 1.429rem; background: #002041;
    li{ height: 3.572rem; padding: 1.072rem 0; overflow: hidden; color: #fff; text-align: left; border-bottom: 1px #244b72 solid;
        em{ width: 1.429rem; margin-right: 2px; border-radius: 50%; display: inline-block; text-align: center; line-height:  1.429rem;}
    }
    h3{ font-size: 1.071rem; display: inline-block; line-height: 1.429rem;}
    span{float: right;font-size: 1.071rem;font-weight: bold;}
}

</style>