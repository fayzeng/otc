<template>
    <div class="msg">
        <span class="flash" v-tap="{methods: openFlash}"><i class="iconfont slj-shoudiantong"></i></span>
        <div id="bcid">
            <p class="tip">载入中...</p>
        </div>
        <div class="scan_btn cl">
            <div class="otc-back">取消</div>
            <div v-tap="{methods: scanPicture, type: '0'}">从相册选择二维码</div>
        </div>
    </div>
</template>
<script>
import { Toolkit, otc } from '../../components/public';
import ScanCode from '../../assets/js/scanCode';

export default{
    data(){
        return{
            isFlash: false
        }
    },
    mounted(){
        const isPlus =  Toolkit.checker.isPlus();
        isPlus.then(() => {
            otc.init();
            this.brcode = ScanCode.scan('bcid', (res) => {
                Toolkit.win.openWV('accounts.html', {tradeAddre: res}, true);
                this.brcode.close();
            })
        })
    },
    methods: { 
        openFlash(){
            this.isFlash = !this.isFlash;
            this.brcode.setFlash(this.isFlash)
        },
        scanPicture(){
            let that = this;
            plus.gallery.pick(function(path){
                plus.barcode.scan(path, that.onmarkedTwo, function(error){
                    plus.nativeUI.alert( "无法识别此图片" );
                });
            }, function(err){

            });
        },
        onmarkedTwo(type, result){
            const res = result.replace(/[\n\"]/g, '');
            Toolkit.win.openWV('accounts.html', {tradeAddre: res}, true);
            this.brcode.close();
        },
    }
}
</script>
<style lang="less">
@assets: '../../assets';
@import '@{assets}/less/import';

/*扫描二维码*/
#bcid { width: 100%; position: absolute; top: 0px; bottom: 104px; text-align: center; 
    .tip { position: absolute; top: 44%; left: 0; width: 100%; text-align: center; color: #fff; font-weight: bold; text-shadow: 0px -1px #103E5C; }
}

.scan_btn { position: absolute; bottom: 0; left: 0; right: 0; width: 100%; height: 44px; line-height: 44px; text-align: center; color: #FFF;
    div { float: left; width: 50%; height: 44px; line-height: 44px; background: #3e75c7; font-size: 16px; }
    div:active { opacity: 0.8; }	
}	

.flash{ 
    position: absolute; bottom: 44px; z-index: 9999999999; width: 100%;  height: 60px; line-height: 60px; text-align: center; color: #FFF; background: #000;
    i{
        font-size: 2rem;margin-top: -25px;display: inline-block;
    }
}

</style>