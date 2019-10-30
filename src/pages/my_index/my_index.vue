<template>
    <div class="msg">
        <otc-head title="我的">
            <template slot="header">
            </template>        
        </otc-head>
        <div class="wrapper">
           <div class="index-name" id="index-name">
		    	<img :src="headimg" >
				<p>{{  info.nickname ? info.nickname : setNameStr(username)}}</p>
		    </div>
            <ul class="public-my-info">
                <li v-tap="{methods: openUrl, url:'my_info.html'}">
                    <h3>个人资料</h3>
                    <i class="iconfont slj-xiangyou"></i>                    
                </li>
                <li v-tap="{methods: openReal}">
                    <h3>实名认证</h3>
                    <i class="iconfont slj-xiangyou"></i>
                    <span>{{realStatus}}</span>
                </li>					
                <li v-tap="{methods: openUrl, url:'my_psdmagent.html'}">
                    <h3>密码管理</h3>
                    <i class="iconfont slj-xiangyou"></i>
                </li>
				<li v-tap="{methods: openUrl, url:'collection_information.html'}">
				    <h3>收款方式</h3>
				    <i class="iconfont slj-xiangyou"></i>
				</li>
                <li v-tap="{methods: openUrl, url:'my_versiondspt.html'}">
                    <h3>版本说明</h3>
                    <i class="iconfont slj-xiangyou"></i>
                </li>
               <!-- <li v-tap="{methods: openUrl, url:'btc_address.html'}">
                    <h3>BTC钱包地址</h3>
                    <i class="iconfont slj-xiangyou"></i>
                </li> 	 -->
                <!-- <li v-tap="{methods: openUrl, url:'my_agent.html'}">
                    <h3>我的邀请码</h3>
                    <i class="iconfont slj-xiangyou"></i> 
                </li> 					 -->
                <li v-tap="{methods: exit}">
                    <h3>退出登录</h3>
                    <i class="iconfont slj-xiangyou"></i>
                </li>                 
            </ul>
        </div>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import { Toast, MessageBox  } from 'mint-ui';
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public.js';
export default {
	name: 'myinedx',
	components:{otcHead},
	data(){
		return{
			info: '',            //个人信息
			address:'',			//判断钱包地址是否绑定
			username: '',       //用户名
			realStatus:'',		//实名认证的状态
			agent:'',           //是否为代理商
			headimg: require('../../assets/images/03.jpg')
		}
	},
	mounted(){
		const isPlus = Toolkit.checker.isPlus();
		isPlus.then(() => {
			this.$nextTick(function(){
				this.myInfo();
				this.getAuthStatus();
			})
			window['freshAjax'] =  () => {
				this.myInfo();
				this.getAuthStatus();
			}
			otc.init({
				style: {'popGesture': 'none'}
			})
		})
	},
	methods:{
		openUrl(d){              //页面跳转
				Toolkit.win.openWV(d.url, {}, true);
		},
		myInfo(){                //获取个人信息
				this.username = Toolkit.storage.getUserInfo('username');
				this.info = Toolkit.storage.getItem('OTC_USERDATA');
				this.agent = Toolkit.storage.getUserInfo('isAgent');   
				if(this.info.head_img_src){ this.headimg = this.info.head_img_src; }else{this.headimg = require('../../assets/images/03.jpg')};
				console.log('info' + JSON.stringify(this.info));
		},
		getAuthStatus(){
				Ajax(apis.getAuthStatus, {
						username:Toolkit.storage.getUserInfo('username'),
						token:Toolkit.storage.getUserInfo('token'),
				}).then(res => {
						if(res.data == 'null' || res.data == null){this.realStatus = '审核中'; return;} 
						if(res.data.status == '10') {this.realStatus = '审核中'; return;}
						if(res.data.status == '20') {this.realStatus = '实名失败'; return;}
						if(res.data.status == '99') {this.realStatus = '已实名'; return;} 
				}, d => {
						if(d.data == 'null' || d.data == null){this.realStatus = '未实名';return false;}
				})
		},
		openReal(){             //点击实名认证字段
			let that = this;
			if(that.realStatus == '未实名' || that.realStatus == '实名失败'){
				 Toolkit.win.openWV('real_name.html', {}, true);
					return;
			}
		},
		setNameStr(name){
			 return name.substr(0, 3) + "****" + name.substr(7);
		}, 
		exit(){                 //点击退出登录
			MessageBox.confirm('是否退出?').then(action => {
					localStorage.clear();
					Toolkit.win.openWV('login.html');
			})
		},
	},
}
</script>
<style lang='less'>
@assets: '../../assets/';
@import '@{assets}/less/import';
@import '@{assets}/less/mint-ui.css';
.index-name{width: 100%;height: 10.715rem;text-align: center;color: #fff;background: url(../../assets/images/my-bg.png); background-size: cover; padding-top: 2.858rem;
    img{display: block; width: 3.572rem; height: 3.572rem; border-radius: 50%; margin: 0 auto;}
    p{font-size: 1.286rem;font-weight: bold; margin-top:.857rem;}
}
</style>

