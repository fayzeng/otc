<template>
    <div class="msg">
        <!-- 头部的标题为title的值，自己定义即可 -->
        <otc-head title="测试">
            <!-- heade插槽，放头部的左边和右边字体或图标，左右边的区分只需加left和right区分即可 -->
            <template slot="header">
                <i class="iconfont slj-fanhui left" ></i>  
                <span class="right">右边</span>
            </template>        
        </otc-head>
        <div class="main">
            <a size="small" v-tap="{methods: upTap}">上传头像</a>
            <up-picture ref="picture" @getPath="getPath"></up-picture>
            <input type="button" value="登录">
            <img :src="codeUrl">
            <a size="small" v-tap="{methods: scan}">扫一扫</a>
            <img class="imgs" :src="headimg" > 
            <!-- <ul>
                <li v-for="item in dataList" :key="item.id">
                    {{item.country_name}}
                    <span>{{item.area_name}}</span>
                </li>
            </ul> -->
            <div id="scan"></div>
            <pay-password :isDisplay="isDisplay"></pay-password>
        </div>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import Toolkit from '../../assets/js/toolkit';
import ajax from '../../axios';
import upPicture from '../../components/upPicture';
import payPassword from '../../components/pay-password';
import otc from '../../assets/js/otc';
import ScanCode from '../../assets/js/scanCode';

export default{
    data(){
        return{
            codeUrl: '',
            sheetVisible: false,
            dataList: [],
            isDisplay: true,
            headimg: require('../../assets/images/03.jpg')
        }
    },
    components: {
        upPicture,
        otcHead,
        payPassword
    },
    mounted(){
        const isPlus =  Toolkit.checker.isPlus();
        isPlus.then(() => {
            // ajax({
            //     url: '/index/index/getPhonePrefix',
            //     method: 'post'
            // },{
            //     token: ''
            // }, [], 'test').then(res => {
            //     this.dataList = res.data;
            //     console.log(this.dataList)
            // }, d => {
            //     console.log(d)
            // })
            
            Toolkit.checker.getProperty().then((v) => {
                console.log(v);
            })
            // ScanCode.scan('scan', (res) => {
            //     console.log(res)
            // })
        })

        ScanCode.qrcode('hello', (url) => {
            console.log('hello' + url);
            this.codeUrl = url;
        })
    },
    methods: {
        upTap(){
            this.$refs.picture.toggle()
        },
        getPath(data){
            console.log(data.path);
        },
        scan(){
            Toolkit.win.openWV('scan.html')
        }
    }
}
</script>
<style lang="less">
@assets: '../../assets';
@import '@{assets}/less/public.less';
@import '@{assets}/less/reset.css';
@import '@{assets}/font/iconfont.css';
@import '@{assets}/less/mint-ui.css';

.msg{
    background: #f9f9f9;
    .main{ position: absolute; top: 4.572rem; bottom: 0; overflow-y: auto;
        ul{ margin: 0; padding: 0; color: #ccc; font-size: 16px;
            li{ height: 34px; line-height: 34px;}
            span{ color: #999; font-size: 14px;}
        }
    }

    #scan{ width: 100%; height: 200px;}
    .imgs{width:  2.143rem; height: 2.143rem;}

}
</style>