<template>
	<div class="msg">
		<otc-head title="设置密码">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
			</template>
		</otc-head>

		<div class="wrapper">

			<div class="logo-img login_psd2">
				<img src="../../assets/images/logo2.png" />
			</div>

			<div class="log_box">

				<ul class="public_input">
					<li>
						<input type="password" v-model="newPass" placeholder="请输入新密码">
					</li>
					<li>
						<input type="password" v-model="againPass" placeholder="请确认新密码">
					</li>
				</ul>

				<div class="all_button">
					<button v-tap="{methods: regConfirm}">下一步</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import otcHead from '../../components/head';
	import {Ajax,Toolkit,Vc, apis, otc} from '../../components/public';
	import md5 from 'md5';
	import {Toast} from 'mint-ui';
	export default {
		components: {otcHead},
		data() {
			return {
				newPass: '', //新密码
				againPass: '', //确认新密码
				resuser: '',
				restype: '',
			}
		},
		mounted() {
			this.isPlus = Toolkit.checker.isPlus();
			this.isPlus.then(() => {
				otc.init();
				this.self = Toolkit.win.getWebview();
				setTimeout(() => {
					this.self.opener().close('none');
				}, 300);             

			})

		},
		methods: {
			regConfirm() {
				Toolkit.dom.blur();
				if (!Vc.isPassword(this.newPass)) {
					Toolkit.win.toast('请输入至少六位数的新密码');
					return false;
				}
				if (this.newPass != this.againPass) {
					Toolkit.win.toast('两次密码输入不一致');
					return false;
				}
				if (this.self.telPhone) {
					this.resuser = this.self.telPhone;
					this.restype = '1';
				} else {
					this.resuser = this.self.emailcon;
					this.restype = '2';
				}
				this.forgetLoginPass();
			},
			forgetLoginPass() {
				Ajax(apis.forgetLoginPass, {
					username: this.resuser,
					verify: this.self.Code,
					password: md5(this.newPass),
					deviceid: plus.device.uuid,
					type: this.restype,
					token: Toolkit.storage.getUserInfo('token')
				}).then(res => {
					Toolkit.win.toast(res.info);
					Toolkit.win.getWebview().close();
				}, d => {
					Toolkit.win.toast(d.info);
				})

			},
		}
	}
</script>
<style lang="less">
	@assets: '../../../src/assets';
	@import '@{assets}/less/import';

	.wrapper .public_input {
		background: none;
	}

	.login_psd2 {
		background: linear-gradient(to right, #03376e, #3156a1);
	}
</style>
