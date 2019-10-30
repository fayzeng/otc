<template>
    <div class="preImg">
        <img src="../../assets/images/start-page.png" style="width: 100%;height: 100%;">
    </div>
</template>
<script>
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public'
import Update from '../../assets/js/update'
import {Toast} from 'mint-ui'

export default {
    data(){
        return {
            bigV: '',       // 大版本号
            minV: '',       // 小版本号
            vData: ''       // 资源数据
        }
    },
    mounted(){
        const isPlus =  Toolkit.checker.isPlus();
        isPlus.then(() => {
            plus.navigator.setFullscreen(true);
            otc.init({
                style: {'popGesture': 'none'}
            });
            this.self = Toolkit.win.getWebview();   // 获取当前窗口对象
            plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
                 this.bigV = wgtinfo.version.substr(0, 5);       // 获取大版本号
            })
            Toolkit.checker.getProperty().then(v => {   // 获取小版本号
                this.userInfo = Toolkit.storage.getUserInfo();      // 获取个人信息
                this.minV = v;
                this.downAjax();
            })

            
            
            // this.getTelCode();                  // 获取国际电话区号
            
        })
    },
    methods: {
        // 国际电话区号
//         getTelCode(){
//             Ajax(apis.country,{
//                 token: Toolkit.storage.getUserInfo('token')
//             }).then(res => {
//                 const itelCode = [];
//                 for(let i=0; i< res.data.length; i++){
//                     let o ={};
//                     o.value = res.data[i].id;
//                     o.phnumber = res.data[i].number;
//                     o.text = res.data[i].number + res.data[i].country_name;
//                     itelCode.push(o);
//                 }
// 				
//                 Toolkit.storage.setItem('OTC_TELCODE', itelCode );
// 				
//             }, d => {
//                 Toolkit.win.toast(d.info);
//             })
//         },
        downAjax(){
            Ajax(apis.getVersion,{
                username: '',
                token: Toolkit.storage.getUserInfo('token'),
                version: this.bigV,
                resources: this.minV
            }).then(res => {
                this.vData = res.data;
                if(res.data.version){
                    if(plus.os.name == 'iOS'){
                        Update.UVersion.ios();
                    }else{
                        Update.UVersion.android(res.data.version);
                    }
                }else if(res.data.resources){
                    Toolkit.win.openWV('update_v.html', {d: res.data.resources})
                }else{
                    this.link();
                }
            }, d => {
                this.link();
            })
        },
        // 跳转逻辑
        link(){
            plus.navigator.setFullscreen(false);
            if(!this.userInfo){
                Toolkit.win.openWV('login.html');
            }else{
                if(this.userInfo.status != '99'){
                    Toolkit.win.openWV('login.html');
                }else{
                    Toolkit.win.openWV('index.html');
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
@assets: '../../../src/assets';
@import '@{assets}/less/import';

.preImg {position: relative;height: 100%;width: 100%;}
</style>
