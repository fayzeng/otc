<template>
    <div class="msg">
        <otc-head title="注册">
        	<template slot="header">
        		<i class="iconfont slj-fanhui left otc-back" ></i>
        	</template>        
        </otc-head>

        <div class="wrapper">
            <div class="detarecord">
                <div class="detarecordtwo" :class="{active: rtype}" v-tap="{methods: selecttype, type: true }">
                    <span>手机号注册</span>
                </div>
                <div class="detarecordtwo" :class="{active: !rtype}" v-tap="{methods: selecttype, type: false }">
                    <span>邮箱注册</span>
                </div>
            </div>

            <div class="log_box">
                <div class="log_box_tapone" :class= "{login_hidden: !rtype}">
                    <ul class="public_input">
                        <li>
		                    <span class="login-title">输入推广码</span>
		                    <input type="text" v-model="vPromoteCode" placeholder="无推广码可不填写" />
		                </li>
                        <li>
		                    <span>注册地区</span>
		                    <code-picker :selectItems='selectItems' ref="mtPopup" @getData= 'getData'></code-picker>
		                    <span  class="lo_re_adress" v-tap="{methods: showpick}">+ {{telCodeText}}<em class="arrow"> ▼ </em></span> 
		                </li>
                        <li>
                            <span>手机号</span>
                            <input type="text" placeholder="请输入账号" v-model="phone">
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
                
                <div class="log_box_taptwo" :class= "{login_hidden: rtype}">
                    <ul class="public_input">
                        <li>
		                    <span class="login-title">输入推广码</span>
		                    <input type="text" v-model="ePromoteCode" placeholder="无推广码可不填写" />
		                </li>
						<li>
							<span>邮箱账号</span>
							<input type="text" v-model="email" placeholder="请输入邮箱">
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
import codePicker from '../../components/picker'
import vCode from '../../components/VCode'
import {Toast} from 'mint-ui'
export default{
    components: {
        codePicker,
        vCode,
		otcHead
    },
    data(){
        return{
            phone: '',                          // 手机
            vcode: '',                          // 手机验证码
            email: '',                          // 邮箱
            ecode: '',                          // 邮箱验证码
            telCode: Toolkit.storage.getItem('OTC_TELCODE'),                        // 国际电话区号集合
            telCodeText: '',            // 国际电话区号选中的文本
            telCodeNumber: '',      // 国际电话区号选中的编码
            rtype: true,                        // 手机与邮箱的区别变量 true为手机注册
            verinput: '获取验证码',              // 按钮文本
            vPromoteCode: '',                   // 手机推广码
            ePromoteCode: '',                   // 邮箱推广码
			selectItems: [],
			showEmail: false,                   // 显示邮箱开关
        }
    },
    mounted(){
        this.isPlus =  Toolkit.checker.isPlus();
        this.isPlus.then(() => {
            otc.init();
			this.getNum();
        })
    },
    methods: {
        setNameStr(d){
            if(d) return d.substr(0, 3) + "****" + d.substr(7);
            else return '';
        },
        // 选项卡切换
        selecttype(d){
            this.rtype = d.type;
        },
        // 打开地区选择
        showpick(){
			Toolkit.dom.blur();
            this.$refs.mtPopup.open(); // 父组件调用子组件里的方法
        },
        // 地区选择后的回调text为显示文本，num为地区编码
        getData(d){
            this.telCodeText = d.text;          
            this.telCodeNumber = d.num;
        },
        // 检查各项参数是否填写正确
        checkParams(){
			Toolkit.dom.blur();
            if(this.rtype){     // 当this.rtype == true 为手机注册
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
                    Toolkit.win.toast('请填写正确的邮箱地址！');
                    return;
                }
                if(!this.ecode){
                    Toolkit.win.toast('请填写邮箱验证码！');
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
                    prefix: this.telCodeNumber,
                    type: '1',
                    token: Toolkit.storage.getUserInfo('token')
                }).then(res => {
                    Toolkit.win.toast(res.info);
                }, d => {
                    Toolkit.win.toast(d.info);
                })
            }else{
                Toolkit.win.toast('请填写正确的手机号码');
            }
        },
        // 同上
        sendCodeEmail(){
             if(Vc.isEmail(this.email)){         // 判断是否填写了正确的邮箱，如果正确填写，就调用子组件的倒计时递归。
                this.$refs.vcode.timy();
                Ajax(apis.sendMailCode,{
                    username: this.email,
                    type: '1',
                    token: Toolkit.storage.getUserInfo('token')
                }).then(res => {
                    Toolkit.win.toast(res.info);
                    this.showEmail = true;
                }, d => {
                    Toolkit.win.toast(d.info);
                })
            }else{
                Toolkit.win.toast('请填写正确的邮箱！');
            }
        },
        // 提交手机注册信息
        submitPhone(){
            Ajax(apis.validateSendCode,{
                username: this.phone,
                prefix: this.telCodeNumber,
                verify: this.vcode,
                inviter_code: this.vPromoteCode,
                type: '1',
                token: Toolkit.storage.getUserInfo('token')
            }).then(res => {
                Toolkit.win.toast(res.info);
                Toolkit.win.openWV('register_step2.html', {
                    Code: this.vcode, 
                    telPhone: this.phone, 
                    prefix: this.telCodeNumber, 
                    inviter: this.vPromoteCode
                }, true)
				
            }, d => {
                Toolkit.win.toast(d.info);
            })
        },
        // 提交邮箱注册信息
        submitEmail(){
            Ajax(apis.validateSendMailCode,{
                username: this.email,						// 邮箱
                verify: this.ecode,							// 邮箱验证码
                inviter_code: this.ePromoteCode,			// 邮箱推广码
                type: '1',
                token: Toolkit.storage.getUserInfo('token')
            }).then(res => {
                Toolkit.win.toast(res.info);
                Toolkit.win.openWV('register_step2.html', {
                    Code: this.ecode, 
                    emailcon: this.email, 
                    prefix: '', 
                    inviter: this.ePromoteCode
                }, true);
            }, d => {
                Toolkit.win.toast(d.info);
            })
        },
        // 获取区号
		getNum(){					
            Toolkit.storage.getTelCode().then(d => {
				this.selectItems = d;
				this.telCodeText = d[0].text;
				this.telCodeNumber = d[0].phnumber;
			});
		}
    }
}
</script>
<style lang="less">
@assets: '../../../src/assets';
@import '@{assets}/less/import';
</style>