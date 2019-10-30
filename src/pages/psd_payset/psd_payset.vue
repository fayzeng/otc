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
					<input type="password" v-model="psd1" :placeholder="'请输入密码'"/>
				</li>
				<li>
					<input type="password" v-model="psd2"  :placeholder="'请确认密码'"/>
				</li>				
			</ul>
			<div class="all_button" v-tap="{methods: checkCode}">
				<button>保存</button>
			</div>			
        </div>
    </div>
</template>
<script>
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public';
import { Toast, MessageBox  } from 'mint-ui';
import otcHead from '../../components/head';
import md5 from 'md5';
export default {
	name: 'psd_payset',
	components:{otcHead},
	data(){
		return{
			psd1:'',
			psd2:'',
		}
	},
	mounted(){
		const isPlus = Toolkit.checker.isPlus();
		isPlus.then(() => {
			otc.init();
		})
	},
	methods:{
		checkCode(){						//点击保存
			Toolkit.dom.blur();
			let that = this;
			if(!Vc.istradePass(that.psd1)){
				Toolkit.win.toast('请输入6位数的新密码');
				return false;
			}
			if(that.psd1 != that.psd2){
				Toolkit.win.toast('新密码与确认新密码需保持一致');
				return false;
			}
			this.setPayPass();
		},
		setPayPass(){					//设置支付密码接口
			let that = this;
			Ajax(apis.setPayPass, {
				username:Toolkit.storage.getUserInfo('username'),
				token:Toolkit.storage.getUserInfo('token'),  
				password: md5(this.psd1),  
			}).then(res => {
				Toolkit.storage.setItem('OTC_PAYPASS', md5(that.psd1));
				Toolkit.win.toast(res.info);
				Toolkit.win.getWebview().close();
			}, d => {
				Toolkit.win.toast(d.info);
			})
		},
	},
	
	
}
</script>
<style lang='less'>
@assets: '../../assets/';
@import '@{assets}/less/import';
@import '@{assets}/less/mint-ui.css';
</style>

