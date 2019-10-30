<template>
    <div class="msg">
        <otc-head title="登录"></otc-head>

        <div class="wrapper">

            <div class="logo-img">
                <img src="../../assets/images/logo2.png"/>
            </div>
            <div class="detarecord">
                <div class="detarecordtwo" :class="{active: loginType}" v-tap="{methods: selectlist, type: true}">
                    <span>手机号登录</span>
                </div>
                <div class="detarecordtwo" :class="{active: !loginType}" v-tap="{methods: selectlist, type: false}">
                    <span>邮箱登录</span>
                </div>
            </div>

            <div class="log_box">
                <div class="log_box_tapone " :class= "{login_hidden: !loginType}">
                    <ul class="public_input">
                        <li>
                            <input type="tel" v-model="username"  placeholder="请输入账号" maxlength="11">
                        </li>
                        <li>
                            <input type="password" v-model="password"  placeholder="请输入登录密码">
                        </li>
                    
                    </ul>
                    
                    <div class="all_button" >
                        <button v-tap="{methods: checkParams}">登录</button>
                    </div>
                </div>
                
                <div class="log_box_taptwo" :class= "{login_hidden: loginType}">
                    <ul class="public_input">
                        <li>
                            <input type="email" v-model="useremail"  placeholder="请输入邮箱">
                        </li>
                        <li>
                            <input type="password" v-model="passwordemail" placeholder="请输入登录密码">
                        </li>
                    
                    </ul>
                    <div class="all_button">
                        <button v-tap="{methods: checkParams}">登录</button>
                    </div>                   
                </div>
            </div>
            
            <div class="login-foot">
                <p v-tap="{methods: openlogPass}">忘记密码</p>
                <p class="register" v-tap="{methods: openRegist}">注册</p>
            </div>
        </div>

       
    </div>
</template>
<script>
import otcHead from '../../components/head'
import {Ajax, Toolkit, otc, Vc} from  '../../components/public';
import md5 from 'md5';
import { Toast } from 'mint-ui';
import apis from '../../axios/apis'

export default{
    data(){
        return{
            username: '',
            password: '',
            useremail: '',
            passwordemail:'',
            /**
             * 变量，用于切换table头部，显示隐藏输入框和数据传参
             */
            loginType: true  
        }
    },
    components: {
        otcHead
    },
    mounted(){
        this.win =  Toolkit.win;
        // isPlus用于加载是否是手机设备
        this.isPlus =  Toolkit.checker.isPlus();
        this.isPlus.then(() => {
            
            otc.init({
				isBack: true,
                style: {'popGesture': 'none'}
            })
        })
    },
    methods: {
		clears(){
            localStorage.clear();
        },
        checkParams() {
            let reg = /^\d{6,}$/;
            Toolkit.dom.blur();
            if(this.loginType){
                if(!reg.test(this.username)){
                    Toolkit.win.toast('请输入正确的手机号码');
                    return false;
                }
                if(!Vc.isPassword(this.password)) {
                    Toolkit.win.toast('请输入正确的密码');
                    return false;
                }
            }else{
                if(!Vc.isEmail(this.useremail)) {
                    Toolkit.win.toast('请输入正确的邮箱号');
                    return false;
                }
                if(!Vc.isPassword(this.passwordemail)) {
                    Toolkit.win.toast('请输入正确的密码');
                    return false;
                }
            }
            
            this.login();
        },
        
        openRegist() {
            this.win.openWV('register.html',{}, true);
        },
        openlogPass() {
            this.win.openWV('login_psd_step1.html', {}, true);
        },
        selectlist(d){
            this.loginType = d.type;
        },
        login(){
            Ajax(apis.login,{
                username: this.loginType ? this.username : this.useremail,
                password: this.loginType ? md5(this.password) : md5(this.passwordemail),
                deviceid: plus.device.uuid,
                geTuiCid: plus.push.getClientInfo().clientid,
                token: Toolkit.storage.getUserInfo('token')
            }).then(res => {
                Toolkit.win.toast(res.info);
                Toolkit.storage.setItem('OTC_USERINFO', res.data);
                Toolkit.storage.setItem('OTC_USERDATA', res.data.get_user_info);
                Toolkit.storage.setItem('OTC_USERWALLET',res.data.wallet_address);
                Toolkit.storage.setItem('OTC_PAYPASS', res.data.pay_password);

                Toolkit.win.evalID('homepage.html', 'freshAjax');
                Toolkit.win.evalID('transaction.html', 'freshAjax');
                Toolkit.win.evalID('my_index.html', 'freshAjax');
               Toolkit.win.openWV('index.html', {}, false, () => {
					plus.webview.close(Toolkit.win.getWebview(), "none", 0);
                });
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

.login-foot {width: 50%; margin: 0 auto;
    p {text-align: left; display: inline-block;font-size: 15px;color: #fff;}
    p.register {float: right;}
}
</style>