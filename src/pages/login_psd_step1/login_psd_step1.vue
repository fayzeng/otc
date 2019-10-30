<template>
	<div class="msg">
		<otc-head title="忘记密码">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
			</template>
		</otc-head>

		<div class="wrapper">

			<div class="logo-img">
				<img src="../../assets/images/logo2.png" />
			</div>
			<div class="detarecord">
				<div class="detarecordtwo" :class="{active: psdtype}" v-tap="{methods: selecttype, type: true }">
					<span>手机号</span>
				</div>
				<div class="detarecordtwo" :class="{active: !psdtype}" v-tap="{methods: selecttype, type: false }">
					<span>邮箱</span>
				</div>
			</div>

			<div class="log_box">
				<div class="log_box_tapone" :class="{login_hidden: !psdtype}">
					<ul class="public_input">
						<li>
							<span>注册地区</span>
							<mt-popup :selectItems='selectItems' ref="mtPopup" @getData='childval'></mt-popup>
							<span class="lo_re_adress" v-tap="{methods: showpick}">+ {{allcountry}}<em class="arrow"> ▼ </em></span>
						</li>
						<li>
							<span>手机号</span>
							<input type="tel" v-model="rPhone" v-on:input="checkRemind" placeholder="请输入账号" maxlength="11">
							<v-code ref="vcode" @sendFn="sendCodePhone" :isDisabled="false"></v-code>
							<!-- <input type="button" class="verification" v-tap="{methods: timy, num: 10 ,type:1}"  :value="verinput" :disabled="disabletype"> -->
						</li>
						<li>
							<span>验证码</span>
							<input type="text" v-model="rCode" placeholder="请输入短信验证码">
						</li>

					</ul>

					<div class="all_button">
						<button v-tap="{methods: checkParams}">下一步</button>
					</div>
				</div>

				<div class="log_box_taptwo" :class="{login_hidden: psdtype}">
					<ul class="public_input">
						<li>
							<span>邮箱账号</span>
							<input type="text" v-model="emailcon" placeholder="请输入邮箱">
							<v-code @sendFn="sendCodeEmail" :isDisabled="false"></v-code>
							<!-- <input type="button" class="verification" v-tap="{methods: timy, num: 10, type: 2}"  :value="verinput" :disabled="disabletype"> -->
						</li>
						<li id="emailcont" :class="{emailcontbox: emailcontype}">
							<p class="login-title">验证码已发送至{{setNameStr(emailcon)}}邮箱</p>
						</li>
						<li id="emailcode" :class="{emailcontbox: emailcontype}">
							<span class="login-title">邮箱验证码</span>
							<input type="text" v-model="emailcode" placeholder="请输入邮箱验证码" />
						</li>
					</ul>
					<div class="all_button" :class="{emailcontbox: emailcontype}">
						<button v-tap="{methods: checkParams}">下一步</button>
					</div>

				</div>
			</div>

		</div>
	</div>
</template>
<script>
import otcHead from '../../components/head';
import {Ajax, Toolkit, Vc, apis, otc} from '../../components/public';
import {Toast,Picker,Popup} from 'mint-ui';
import vCode from '../../components/VCode'
import mtPopup from '../../components/picker'
export default {
	components: {mtPopup,vCode,otcHead},
	data() {
		return {
			rPhone: '', // 电话号码
			rCode: '', // 验证码
			allcountry: '',
			selectItems: [], // 国外号码的前几位通用数字集合
			selestType:'',
			phnumber: '',
			emailcon: '',
			emailcode: '',
			psdtype: true,
			emailcontype: true,
			verinput: '获取验证码',
			disabletype: true
		}
	},

	mounted() {
		this.openwv = Toolkit.win;
		this.isPlus = Toolkit.checker.isPlus();
		this.isPlus.then(() => {
			otc.init();
			this.getCountry();
		})
	},

	methods: {
		setNameStr(d){
			if(d) return d.substr(0, 3) + "****" + d.substr(7);
			else return '';
		},
		getCountry(){
			Toolkit.storage.getTelCode().then(d => {
				console.log( JSON.stringify(d[0]));
				this.selectItems = d;
				this.allcountry = d[0].text;
				this.phnumber = d[0].phnumber;
			});
			
		},
		selecttype(d) {
			this.psdtype = d.type;
		},
		showpick() {
			this.$refs.mtPopup.open(); // 父组件调用子组件里的方法
		},
		childval(d) {
			console.log('d'+JSON.stringify(d));
			this.selestType = d;
			this.allcountry = d.text;
			this.phnumber = d.num;
		},
		checkParams() {
			Toolkit.dom.blur();
			let reg = /^\d{6,}$/;
			if (this.psdtype) {
				if (this.phnumber == '86') {
					if (!Vc.isPhone(this.rPhone)) {
						Toolkit.win.toast('请输入正确的手机号码');
						return false;
					}
				} else {
					if (!reg.test(this.rPhone)) {
						Toolkit.win.toast('请输入正确的手机号码');
						return false;
					}
				}

				if (!this.rCode) {
					Toolkit.win.toast('请输入验证码');
					return false;
				}
				this.validateSendCode();
			} else {
				if (!Vc.isEmail(this.emailcon)) {
					Toolkit.win.toast('请输入正确的邮箱');
					return false;
				}
				this.sendemailCode();
			}
		},
		checkRemind() {
			var reg = /^\d{6,}$/;
			if (this.phnumber == '86') {
				if (Vc.isPhone(this.rPhone)) {
					this.disabletype = false;
				} else {
					this.disabletype = true;
				}
			} else {
				if (reg.test(this.rPhone)) {
					this.disabletype = true;
				} else {
					this.disabletype = false;
				}
			}
		},
		// 点击获取验证码的回调
		sendCodePhone() {
			if (Vc.isPhone(this.rPhone)) { // 判断是否填写了正确的手机号码，如果正确填写，就调用子组件的倒计时递归。
				this.$refs.vcode.timy();
				Ajax(apis.sendCode, {
					username: this.rPhone,
					prefix: this.phnumber,
					type: '2',
					token: Toolkit.storage.getUserInfo('token')
				}).then(res => {
					Toolkit.win.toast(res.info);
				}, d => {
					Toolkit.win.toast(d.info);
				})
			} else {
				Toolkit.win.toast('请填写正确的手机号码！');
			}
		},

		validateSendCode() {							// 验证电话号码验证码
			Ajax(apis.validateSendCode, {
				username: this.rPhone,
				prefix: this.phnumber,
				verify: this.rCode,
				type: '2',
				token: Toolkit.storage.getUserInfo('token')
			}).then(res => {
				Toolkit.win.toast(res.info);
				this.openwv.openWV('login_psd_step2.html', {
					Code: this.rCode,
					telPhone: this.rPhone,
					prefix: this.phnumber,
				}, true);
			}, d => {
				Toolkit.win.toast(d.info);
			})
		},

		// 获取邮箱验证码 
		sendCodeEmail() {
			if (Vc.isEmail(this.emailcon)) { // 判断是否填写了正确的邮箱，如果正确填写，就调用子组件的倒计时递归。
				this.$refs.vcode.timy();
				Ajax(apis.sendMailCode, {
					username: this.emailcon,
					type: '2',
					token: Toolkit.storage.getUserInfo('token')
				}).then(res => {
					Toolkit.win.toast(res.info);
					this.emailcontype = false;
				}, d => {
					Toolkit.win.toast(d.info);
				})
			} else {
				Toolkit.win.toast('请填写验证码！');
			}
		},
		sendemailCode() {                   	// 验证邮箱验证码
			Ajax(apis.validateSendMailCode, {
				username: this.emailcon,
				verify: this.emailcode,
				type: '2',
				token: Toolkit.storage.getUserInfo('token')
			}).then(res => {
				Toolkit.win.toast(res.info);
				this.openwv.openWV('login_psd_step2.html', {
					Code: this.emailcode,
					emailcon: this.emailcon,
					prefix: '',
				}, true);
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

	input:disabled {
		color: #999;
	}

	.wrapper .log_box .emailcontbox {
		display: none;
	}
</style>
