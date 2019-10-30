<template>
    <div>
        <otc-head title="设置支付密码">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
			</template>        
        </otc-head>
        <div class="wrapper">
			<ul class="public_input">
                <li>
                    <span class="login-title">新密码</span>
                    <input type="password" v-model="newPassword" placeholder="请输入新密码"/>
                </li>
                <li>
                    <span class="login-title">确认新密码</span>
                    <input type="password" v-model="cNewPassword" placeholder="请确认新密码"/>
                </li> 				
			</ul>
			<div class="all_button">
				<button v-tap="{methods: regConfirm}">保存</button>
			</div>			
        </div>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import {Toast} from 'mint-ui';
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public';
import md5 from 'md5';
export default {
    name: 'paypsd_step2',
	data(){
		return{
			newPassword: '',		 // 新密码
			cNewPassword: '',		// 确认新密码
			restype: '1',		//1为电话号码，二为邮箱
			
		}
	},
	mounted(){
		const isPlus = Toolkit.checker.isPlus();
		isPlus.then(() => {
			otc.init();
			this._self = Toolkit.win.getWebview();
			setTimeout(() => {
				this._self.opener().close('none');
			}, 300);
			
		})
	},
	methods:{
		// 点击保存
		regConfirm(){
			Toolkit.dom.blur();			
			if(!Vc.istradePass(this.newPassword)){
				Toolkit.win.toast('请输入6位数的新密码');
				return false;
			}
			if(this.cNewPassword != this.newPassword){
				Toolkit.win.toast('两次密码的输入需保持一致');
				return false;
			}
			if(this._self.rtype){
				this.restype = '2';
			}else{
				this.restype = '1';
			}
			this.forgetPayPass();
		},
		// 提交新密码
		forgetPayPass(){
			Ajax(apis.forgetPayPass, {
				username: Toolkit.storage.getUserInfo('username'),
				token: Toolkit.storage.getUserInfo('token'),
				verify: this._self.Code,
				password: md5(this.newPassword),
				type: this.restype,
			}).then(res => {
				Toolkit.win.toast(res.info);
				setTimeout(() => {
					this._self.close();
				}, 200);
			}, d => {
				Toolkit.win.toast(d.info);
			})			
		}
	},
	components:{otcHead}
}
</script>
<style lang='less'>
@assets: '../../assets/';
@import '@{assets}/less/import';
@import '@{assets}/less/mint-ui.css';
</style>

