
<template>
    <div class="msg">
        <otc-head title="个人资料">
					<template slot="header">
							<i class="iconfont slj-fanhui left otc-back"></i>
					</template>        
        </otc-head>

        <div class="wrapper">
            <div class="address">
                <span>收款地址</span>
                <p id="tradeAdress">{{adress}}</p>
            </div>
            
            <div class="code">
                <img :src="codeUrl">
            </div>
            
            <div  class="but-copy"  id="butCopy" v-tap="{methods: copy}">复制收款地址</div>	
        </div>

       
    </div>
</template>
<script>
import otcHead from '../../components/head';
import { Toast, MessageBox  } from 'mint-ui';
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public.js'
import ScanCode from '../../assets/js/scanCode';
export default{
		name: 'receiptCode',
	  components:{otcHead},
    data(){
        return{
            codeUrl:'receiptCode',
						adress: Toolkit.storage.getUserInfo('wallet_address').wallet_address
        }
    },
    mounted(){
        const isPlus = Toolkit.checker.isPlus();
        isPlus.then(() => {
						otc.init();
        })
			ScanCode.qrcode(this.adress, (url) => {
				console.log(url);
				this.codeUrl = url;
			})
    },
		methods:{
        openUrl(d){
            Toolkit.win.openWV(d.url);
        },
        copy(){
          var banknumber = document.getElementById("tradeAdress").innerHTML;
					var bank = banknumber.replace(/\s/g, ""); //清除所有空格
					
					if(!window.plus) return;
					if(plus.os.name == 'Android') {
						var Context = plus.android.importClass("android.content.Context");
						
						var main = plus.android.runtimeMainActivity();
						var clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
						Toolkit.win.toast("复制收款地址成功");
						return plus.android.invoke(clip, "setText", bank);
					} else {
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
						Toolkit.win.toast("复制收款地址成功");
						return _val || '';
					}
        },
    },
}
</script>
<style lang="less">
@assets: '../../assets';
@import '@{assets}/less/import';


.code {width: 100%;height: 70%;text-align: center;
    img{width:18.714rem;height: 17.857rem;background: #fff;}
}
.address {width: 100%;height: 3.571rem;line-height: 3.571rem;background: #002041;padding: 0 20px;margin-top: 10px; color: #fff;
    p {float: right;font-weight: bold;}
}
.but-copy {width: 80%;height: 3.214rem;line-height: 3.214rem;border: 1px solid #0075eb;color: #0075eb;border-radius: 25px;font-size: 11px;margin-left: 10%; text-align: center; }
		

</style>
