<template>
    <div>
			<otc-head title="忘记支付密码">
				<template slot="header">
					<i class="iconfont slj-fanhui left otc-back"></i>
				</template>        
      </otc-head>
      <div class="wrapper">	
				<div class="log_box">
					<div class="pay_tel" :class= "{login_hidden: rtype}" >
						<ul class="public_input">
							<li>
								<span>注册地区</span>
								<span  class="lo_re_adress">+ {{phnumber}}<em class="arrow"> ▼ </em></span>
							</li>
							<li>
									<span>手机号</span>
									<input type="text" placeholder="请输入账号" v-model="phone" disabled="disabled">
									<v-code ref="vcode" @sendFn="sendCodePhone" :isDisabled="false"></v-code>
							</li>
							<li>
									<span>验证码</span>
									<input type="text" placeholder="请输入短信验证码" v-model="vcode">
							</li>
						</ul>
						<div class="all_button">
							<button v-tap="{methods: checkParams}">下一步</button>
						</div>					
					</div>
					
					<div class="pay_email" :class= "{login_hidden: !rtype}">
                        <ul class="public_input" >
                            <li>
                                <span>邮箱账号</span>
                                <input type="text" v-model="email" placeholder="请输入邮箱" disabled="disabled">
                                <v-code @sendFn="sendCodeEmail" :isDisabled="false"></v-code>
                            </li>
                            <li id="emailcont" class="emailcontbox" v-if="showEmail">
                                <p class="login-title">验证码已发送至{{setNameStr(email)}}邮箱</p>
                            </li>
                            <li id="emailcode" class="emailcontbox">
                                <span class="login-title">邮箱验证码</span>
                                <input type="text" placeholder="请输入邮箱验证码" v-model="ecode">
                            </li>
                        </ul>
                        <div class="all_button">
                                <button v-tap="{methods: checkParams}">下一步</button>
                        </div>					
					</div>
				</div>
      </div>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public';
import vCode from '../../components/VCode'
import {Toast} from 'mint-ui'
export default {
	name: 'paypsd_step1',
	components:{
		otcHead,
        vCode
	},
	data(){
		return{
			phone: Toolkit.storage.getUserInfo('username'),                          // 手机
			vcode: '',                          // 手机验证码
			email: Toolkit.storage.getUserInfo('username'),                          // 邮箱
			ecode: '',                          // 邮箱验证码
			rtype: Toolkit.storage.getUserInfo('email'),                        // 手机与邮箱的区别变量 true为邮箱注册
			verinput: '获取验证码',              // 按钮文本
			vPromoteCode: '',                   // 手机推广码
			ePromoteCode: '',                    // 邮箱推广码
			showEmail: false,                   // 显示邮箱开关
			phnumber: Toolkit.storage.getUserInfo('phone_prefix')												// 注册地区号码
		}
	},
	mounted(){
		this.isPlus =  Toolkit.checker.isPlus();
		this.isPlus.then(() => {
			otc.init();
		})
	},
	methods:{
		setNameStr(d){
            if(d) return d.substr(0, 3) + "****" + d.substr(7);
            else return '';
       },
        // 检查各项参数是否填写正确
        checkParams(){
            Toolkit.dom.blur();
            if(!this.rtype){     // 当this.rtype == true 为手机注册
                if(!Vc.isPhone(this.phone)){
                    Toolkit.win.toast('请填写正确的手机号码！');
                    return;
                }
                if(!this.vcode){
                    Toolkit.win.toast('请填写手机验证码！');
                    return;
                }
                this.submitPhone();
            }else{              // 当this.rtype == false 为邮箱注册
                if(!Vc.isEmail(this.email)){
                    Toolkit.win.toast('请填写正确的手机号码！');
                    return;
                }
                if(!this.ecode){
                    Toolkit.win.toast('请填写手机验证码！');
                    return;
                }
                this.submitEmail();
            }
        },
        // 点击获取验证码的回调
        sendCodePhone(){
            if(Vc.isPhone(this.phone)){         // 判断是否填写了正确的手机号码，如果正确填写，就调用子组件的倒计时递归。
                this.$refs.vcode.timy();
                Ajax(apis.sendCode,{
                    username: this.phone,
                    prefix: this.phnumber,
                    type: '3',
                    token: Toolkit.storage.getUserInfo('token')
                }).then(res => {
                    Toolkit.win.toast(res.info);
                }, d => {
                    Toolkit.win.toast(d.info);
                })
            }else{
                Toolkit.win.toast('请填写正确的手机号码！');
            }
        },
        // 同上
        sendCodeEmail(){
             if(Vc.isEmail(this.email)){         // 判断是否填写了正确的邮箱，如果正确填写，就调用子组件的倒计时递归。
                this.$refs.vcode.timy();
                Ajax(apis.sendMailCode,{
                    username: this.email,
                    type: '3',
                    token: Toolkit.storage.getUserInfo('token')
                }).then(res => {
                    Toolkit.win.toast(res.info);
                    this.showEmail = true;
                }, d => {
                    Toolkit.win.toast(d.info);
                })
            }else{
                Toolkit.win.toast('请填写正确的邮箱地址！');
            }
        },
        // 提交手机注册信息
        submitPhone(){
            Ajax(apis.validateSendCode,{
                username: this.phone,
                prefix: this.phnumber,
                verify: this.vcode,
                inviter_code: this.vPromoteCode,
                type: '3',
                token: Toolkit.storage.getUserInfo('token')
            }).then(res => {
                Toolkit.win.toast(res.info);
                Toolkit.win.openWV('paypsd_step2.html', {
				rtype: this.rtype,
				Code: this.vcode, 
				telPhone: this.phone, 
				prefix: this.phnumber, 
				inviter: this.vPromoteCode
                }, true)
            }, d => {
                Toolkit.win.toast(d.info);
            })
        },
        // 提交邮箱注册信息
        submitEmail(){
            Ajax(apis.validateSendMailCode,{
                username: this.email,
                verify: this.ecode,
                inviter_code: this.ePromoteCode,
                type: '3',
                token: Toolkit.storage.getUserInfo('token')
            }).then(res => {
                Toolkit.win.toast(res.info);
                Toolkit.win.openWV('paypsd_step2.html', {
					rtype: this.rtype,
                    Code: this.ecode, 
                    emailcon: this.email, 
                    prefix: '', 
                    inviter: this.ePromoteCode
                }, true)
            }, d => {
                Toolkit.win.toast(d.info);
            })
        }
	}
	
}
</script>
<style lang='less'>
@assets: '../../assets/';
@import '@{assets}/less/import';
@import '@{assets}/less/mint-ui.css';
</style>

