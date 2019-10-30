<template>
    <div class="msg">
		<otc-head title="更换手机号">
		    <template slot="header">
		        <i class="iconfont slj-fanhui left otc-back" ></i>
		    </template>        
		</otc-head>

        <div class="wrapper">
			<ul class="public_input">
				<li class="phoneclass">
					<h3>当前手机号</h3>
					<h4>137811112222</h4>
				</li>
				<li>
					<input type="tel" v-model="phonenumber"  placeholder="请输入新手机号" maxlength="11">
				</li>
			</ul>
        </div>
    </div>
</template>
<script>

import {Ajax, Toolkit, otc, Vc} from  '../../components/public';
import otcHead from '../../components/head';
import { Toast } from 'mint-ui';
import apis from '../../axios/apis'

export default{
    data(){
        return{
            phonenumber: '',
        }
    },
   components:{otcHead},
    mounted(){
        this.win =  Toolkit.win;
        // isPlus用于加载是否是手机设备
        this.isPlus =  Toolkit.checker.isPlus();
        this.isPlus.then(() => {
            otc.init({})
        })
    },
    methods: {
        checkParams() {
            let reg = /^\d{6,}$/;
            Toolkit.dom.blur();
            if(this.loginType){
                if(!reg.test(this.phonenumber)){
                    Toolkit.win.toast('请输入正确的手机号码');
                    return false;
                }
            }
            this.phone();
        },
        
        phone(){
            Ajax(apis.login,{
               username:Toolkit.storage.getUserInfo('username'),
               token:Toolkit.storage.getUserInfo('token'),  
            }).then(res => {
               
            }, d => {
                Toolkit.win.toast(d.info);
            })
            
        }
    }
}
</script>
<style lang="less">
@assets: '../../../src/assets';
@import '@{assets}/less/import';

.public_input li.phoneclass{width: 100%;display: block;
    h3 {text-align: left; display: inline-block;font-size: 15px;line-height: 55px;color: #fff;}
    h4 {line-height: 55px;float: right;}
}
</style>