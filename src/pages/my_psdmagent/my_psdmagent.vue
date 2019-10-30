<template>
    <div>
        <otc-head title="密码管理">
            <template slot="header">
                <i class="iconfont slj-fanhui left otc-back"></i>
            </template>        
        </otc-head>
        <div class="wrapper">
			<ul class="public-my-info">
				<li v-tap="{methods: openUrl, url: 'psd_loginmodify.html'}">
					<h3>修改登录密码</h3>
                	<i class="iconfont slj-more"></i>
				</li>
				<li v-tap="{methods: openUrl, url: 'psd_paymodify.html'}">
					<h3>修改支付密码</h3>
                	<i class="iconfont slj-more"></i>
				</li>
				<li v-tap="{methods: openUrl, url: 'paypsd_step1.html'}">
					<h3>忘记支付密码</h3>
                	<i class="iconfont slj-more"></i>
				</li>				
			</ul>
        </div>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import {MessageBox} from 'mint-ui';
import {Toolkit, otc} from '../../components/public'
export default {
	name: 'my_psdmagent',
	data(){
		return{

		}
	},
	mounted(){
		this.isPlus =  Toolkit.checker.isPlus();
        this.isPlus.then(() => {
			otc.init();
        })
	},
	methods:{
		openUrl(d){              			//页面跳转
			let state = Toolkit.storage.getItem('OTC_PAYPASS');
			console.log('state=' + state);
			if(d.url == 'psd_loginmodify.html'){
				Toolkit.win.openWV(d.url, {}, true);
			}else{
				if(!state){
					MessageBox.confirm('您未设置支付密码，是否前往设置?').then(action => {
						Toolkit.win.openWV('psd_payset.html', {}, true);
					})
				}else{
					Toolkit.win.openWV(d.url, {}, true);
				}
			}
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

