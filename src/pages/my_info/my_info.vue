<template>
    <div>
        <otc-head title="个人资料">
            <template slot="header">
                <i class="iconfont slj-fanhui left otc-back" ></i>
            </template>        
        </otc-head>
        <div class="wrapper">
			 <div class="detarecord">
			    <div class="detarecordtwo" :class="{active: loginType}" v-tap="{methods: selectlist, type: true}">
			        <span>基本资料</span>
			    </div>
			    <div class="detarecordtwo" :class="{active: !loginType}" v-tap="{methods: selectlist, type: false}">
			        <span>实名信息</span>
			    </div>
			</div>
			<div class="log_box">
			    <div class="log_box_tapone " :class= "{login_hidden: !loginType}">
			        <ul class="public-my-info">
			            <li v-tap="{methods: logetap}">
			                <h3>头像</h3>
			                <span><img :src="info ? info.head_img_src : '../../assets/images/03.jpg' " alt=""></span>
			                <i class="iconfont slj-xiangyou"></i>
			            </li>
			            <li  v-tap="{methods: openUrl, url: 'set_nickname.html'}">
			                <h3>昵称</h3>
			                <span>{{ info ?  info.nickname : setNameStr(accountTel)}}</span> <!-- <em class="pro">已实名</em> -->
			                <i class="iconfont slj-xiangyou"></i>
			            </li>
			            <li v-if="!accountEmail">
			                <h3>手机号</h3>
			                <span>{{setNameStr(accountTel)}}</span>
			                <i class="iconfont slj-xiangyou"></i>
			            </li>
			            <li v-if="accountEmail">
			                <h3>邮箱号</h3>
			                <span>{{setNameStr(accountEmail)}}</span>
			                <i class="iconfont slj-xiangyou"></i>
			            </li>					
			           <!-- <li v-tap="{methods: openUrl, url: 'receiptCode.html'}">
			                <h3>钱包地址</h3>
			                <i class="iconfont slj-xiangyou"></i>
			            </li> 		 -->		
			        </ul>
			    </div>
			    
			    <div class="log_box_taptwo" :class= "{login_hidden: loginType}">
			        <ul class="public-my-info">
			            <li>
			                <h3>国籍</h3>
			                <span>{{pro_data.user_nationality}}</span>
			                <!-- <i class="iconfont slj-xiangyou"></i> -->
			            </li>
			            <li>
			                <h3>证件号</h3>
			                <span>{{pro_data.id_card_num_text}}</span> 
			            </li>
			            <li>
			                <h3>姓名</h3>
			                <span>{{pro_data.id_card_name_text}}</span>
			            </li>
			            <li v-if="!accountEmail"><!-- v-tap="{methods: openUrl, url: 'my_info_addphonenumber.html'}" -->
			                <h3>联系手机</h3>
							<span>{{pro_data.phone}}</span>
			            </li> 
						<li v-if="accountEmail">
							<h3>联系邮箱号</h3>
							<span>{{setNameStr(accountEmail)}}</span>
						</li> 
			        </ul>               
			    </div>
			</div>
			<up-picture ref="picture" @getPath="getPath"></up-picture>
        </div>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import { Toast  } from 'mint-ui';
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public.js';
import upPicture from '../../components/upPicture';
export default { 
    name:'myinfo',
	components:{otcHead, upPicture}, 
    data(){
        return{      
			sheetVisible: false,                            // 控制相册的弹框
            info: Toolkit.storage.getItem('OTC_USERDATA'),           //个人信息
            accountTel: Toolkit.storage.getUserInfo('username'),     //昵称
            accountEmail: Toolkit.storage.getUserInfo('email'),      //邮箱
			loginType: true,  //控制tab栏
			pro_data: ''
        }
    }, 
	mounted(){
		const isPlus = Toolkit.checker.isPlus();
		isPlus.then(() => {
			window['getImgData'] = () => {this.getImgData()};
			window['getInfo'] = () => {this.getInfo()};
			otc.init();
			this.getAuthStatus();
		})
		
	},
    methods:{
        openUrl(d){							// 打开某个页面
             Toolkit.win.openWV(d.url);
        },
		selectlist(d){
		    this.loginType = d.type;
		},
        setNameStr(name){					// 昵称的简写
			return name.substr(0, 3) + "****" + name.substr(7);
        },
        logetap(){         	                                         //点击头像
			this.$refs.picture.toggle();        
        },
		getPath(e){
			console.log('222');
			Toolkit.win.openWV('my_portrait.html', {
				imgUrl: e.data,
			})
		},
		getImgData(){						// 上传头像
			let imgData = Toolkit.storage.getItem("OTC_IMGDATA");
			Ajax(apis.saveUserInfo, {
				username:Toolkit.storage.getUserInfo('username'),
				token:Toolkit.storage.getUserInfo('token'), 
				head_img_src: imgData,          
			}).then(res => {
				Toolkit.win.toast(res.info);
				Toolkit.storage.upDataInfo('OTC_USERDATA', res.data);
				localStorage.removeItem("OTC_IMGDATA");
				Toolkit.win.evalID('my_index.html', 'freshAjax');
				
				if(res.msg == '1') {
					this.info = res.data;
				}            
			}, d => {
				Toolkit.win.toast(d.info);
			})
		},
		getAuthStatus(){					
			Ajax(apis.getAuthStatus, {
				username:Toolkit.storage.getUserInfo('username'),
				token:Toolkit.storage.getUserInfo('token'), 
			}).then(res => {
				Toolkit.win.toast(res.info);
				this.pro_data = res.data;
			}, d => {
				Toolkit.win.toast(d.info);
			})
		},
		// 更新vm数据
		getInfo() {
			this.info = Toolkit.storage.getItem('OTC_USERDATA');
		}
    }, 
    
}


</script>
<style lang='less'>
@assets: '../../assets/';
@import '@{assets}/less/import';
@import '@{assets}/less/mint-ui.css';
	li span {color: #fff;}
	.pro {height: 48px;height: 20px;line-height: 20px;border-radius: 20px;color: #fff;font-size: 12px;padding:2px 5px;
		background: -webkit-linear-gradient(top, #4de07e , #95e662); /* Safari 5.1 - 6.0 */
		background: -o-linear-gradient(top, #4de07e, #95e662); /* Opera 11.1 - 12.0 */
		background: -moz-linear-gradient(top, #4de07e, #95e662); /* Firefox 3.6 - 15 */
		background: linear-gradient(to top, #4de07e , #95e662); /* 标准的语法（必须放在最后） */
	}
</style>

