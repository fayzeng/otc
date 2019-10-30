<template>
    <div>
        <otc-head title="我的邀请码">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back" ></i>
			</template>        
        </otc-head>
        <div class="wrapper">
            <div class="bigbox">
                <img src="../../assets/images/logo2.png" class="logo"/>
                <div class="agent-code">
                    <p class="code-intoro">您的邀请码</p>
                    <p class="biao1" id="biao1">{{codeNum}}</p>
                    <input type="button" value="复制" class="copy" id="copy" v-on:click="copys"/>
                    <div class="lines">
                        <div class="cir-left"></div>
                        <div class="cir-right"></div>
                        <div class="cir-middle"></div>
                    </div>
                    <div class="code" id="code">
                        <img :src="codeUrl">
                    </div>
                    <p class="scan-code">扫描二维码下载APP</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import { Toast, MessageBox  } from 'mint-ui';
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public.js'
import ScanCode from '../../assets/js/scanCode';
export default {
    name: 'my_agent',
		components:{otcHead},
    data(){
        return{
            codeNum:'',        // 邀请码
			codeUrl:'',
        }
    },
		mounted(){
			const isPlus = Toolkit.checker.isPlus();
			isPlus.then(() => {
				this.getBusinessInfo();
				otc.init();
			})
			ScanCode.qrcode('http://bp.timesdata.net/appweb/dulong-OTC/dulootc-app.html', (url) => {
				console.log(url);
				this.codeUrl = url;
			})
		},
    methods:{
        copys(){            // 点击复制
            var bank = (this.codeNum).replace(/\s/g, "");
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
				Toolkit.win.toast("复制邀请码成功");
				return _val || '';                
            }
        },
        getBusinessInfo(){              // 获取代理商数据
            Ajax(apis.getBusinessInfo, {
                username:Toolkit.storage.getUserInfo('username'),
                token:Toolkit.storage.getUserInfo('token'),        
            }).then(res => {
                this.codeNum = res.data.invitation_code;
            }, d => {
                Toolkit.win.toast(d.info);
            })        
        },
    },
   
}
</script>
<style lang='less'>
@assets: '../../assets/';
@import '@{assets}/less/mint-ui.css';
@import '@{assets}/less/import';
    .bigbox{width: 100%; height: 100%; background: no-repeat  url(../../assets/images/dl-agent.png); background-size:100%; padding-top:2.143rem; overflow: hidden;
        .logo{display: block; margin: 0 auto; width: 5.714rem; height: 5.714rem; }
        .agent-code{width: 19.929rem; margin: 0 auto; margin-top: 2.143rem; background: #fff;padding: 1.429rem 0;border-radius: .714rem;
            .code-intoro{width: 100%; text-align: center;  font-size: 1.429rem; color: #222;}
            .biao1{width: 100%; text-align: center; font-size: 1.857rem; color: #222;}
            .copy{width: 8.571rem; height:3.286rem; display: block; margin: 0 auto; background: #0075EB; color: #fff; font-size: 1.286rem; border-radius: 1.429rem;}
            .lines{width: 100%; height: 2rem;margin-top: .714rem; position: relative;
                .cir-left{position: absolute; height: 2rem; width: 2rem; background: #00152A; top: 0; left: -1rem;border-radius: 50%;}
                .cir-right{position: absolute; height: 2rem; width: 2rem; background: #00152A; top: 0; right: -1rem;border-radius: 50%;}
                .cir-middle{width: 17.929rem; position: absolute;border-bottom: .071rem dashed #D9DFE5;top: 1rem; left: 1rem;}
            }
            .code{width: 10.714rem;  height: 10.714rem;margin: 0 auto; margin-top: .714rem;
				img{width: 10.714rem;  height: 10.714rem;display: block;}
			}
            .scan-code{width: 100%; font-size: 1.071rem; margin-top: .714rem; text-align: center; font-weight: 500;}
        }
    }
</style>

