<template>
    <div>
        <otc-head title="修改支付密码">
            <template slot="header">
                <i class="iconfont slj-fanhui left otc-back"></i>
            </template>        
        </otc-head>
        <div class="wrapper">
			<ul class="public_input">
				<li>
					<input type="password" v-model="oldPassword" :placeholder="'请输入旧密码'"/>
				</li>
				<li>
					<input type="password" v-model="newPassword" :placeholder="'请输入新密码'"/>
				</li>
				<li>
					<input type="password" v-model="cNewPassword" :placeholder="'请再次确认新密码'"/>
				</li>				
			</ul>
			<div class="all_button">
				<button v-tap="{methods: checkCode}">保存</button>
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
	name: 'psd_paymodify',
	data(){
		return{
			oldPassword: '',			// 旧密码
			newPassword: '',			// 新密码
			cNewPassword: ''			// 确认新密码
		}
	},
	mounted(){
		const isPlus = Toolkit.checker.isPlus();
		isPlus.then(() => {
			otc.init();
			this._self = Toolkit.win.getWebview();
		})
	},
	methods:{
		checkCode(){
			Toolkit.dom.blur();
			if(!Vc.istradePass(this.oldPassword)){
				Toolkit.win.toast('请输入旧密码');
				return;
			}
			if(!Vc.istradePass(this.newPassword)){
				Toolkit.win.toast('请输入正确的新密码');
				return;
			}
			if(this.newPassword != this.cNewPassword){
				Toolkit.win.toast('新密码与确认新密码需保持一致');
				return;
			}
			this.savePayPass();
		},
		savePayPass(){
			Ajax(apis.savePayPass, {
				username: Toolkit.storage.getUserInfo('username'),
				token: Toolkit.storage.getUserInfo('token'),
				old_pass: md5(this.oldPassword),
				new_pass: md5(this.newPassword)
			}).then(res => {
				console.log( '成功信息'  +  res.info);
				Toolkit.win.toast(res.info);
				this._self.close();
			}, d => {
				Toolkit.win.toast(d.info);
			})			
		},
	},
	components:{otcHead}
}
</script>
<style lang='less'>
@assets: '../../assets/';
@import '@{assets}/less/import';
@import '@{assets}/less/mint-ui.css';
</style>

