<template>
    <div>
        <otc-head title="实名认证">
        	<template slot="header">
        		<i class="iconfont slj-fanhui left otc-back" ></i>
        	</template>        
        </otc-head>
        <div class="wrapper">
            <div class="num-box">
                <ul class="public_input">
                    <li>
                        <input type="text" name="phone" v-model="username" placeholder="请输入您的真实姓名" />
                    </li>
                    <li>
                        <input type="tel" name="password" v-model="idNumber" placeholder="请输入您的证件号码"/>
                    </li>
                </ul>
                <div class="allImg">
                    <div class="addStep-box">
                        <div class="img-box">
                            <p class="img-btn-picture">身份证正面</p>
                            <em class="img-close iconfont slj-iconfontcha" v-tap="{methods: closeP, type: 1}"></em>
                            <div class="img-box-show" :style="'background-image: url('+ urlP +' );'">
                                <div class="img-btn" v-tap="{methods: chooPic, type: 1}" v-if="!idcardP">
                                    <i class="iconfont slj-weibiaoti1"></i>
                                </div>
								<up-picture ref="picture" @getPath="getPath"></up-picture>
                                <span class="img-btn-text" v-if="!idcardP">点击上传</span>
                            </div>
                        </div>
						
                       <div class="img-box">
                            <p class="img-btn-picture">身份证反面</p>
                            <em class="img-close iconfont slj-iconfontcha" v-tap="{methods: closeP, type: 2}"></em>
                            <div class="img-box-show" :style="'background-image: url('+ urlS +' );'">
                                <div class="img-btn" v-tap="{methods: chooPic, type: 2}" v-if="!idcardS">
                                    <i class="iconfont slj-weibiaoti1"></i>
                                </div>
                                <span class="img-btn-text" v-if="!idcardS">点击上传</span>	
                            </div>
                        </div>
                    </div>
                    <div class="all_button">
                        <button v-tap="{methods: checkParams}">提交</button>
                    </div>
                </div>
            </div>           
        </div>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import { Toast, MessageBox  } from 'mint-ui';
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public.js';
import upPicture from '../../components/upPicture';

export default {
    name: 'realname',
	components:{otcHead, upPicture},
	data(){
		return{
			sheetVisible: false,                            // 控制相册的弹框
			username: '',		                            // 姓名
			idNumber: '',		                            // 证件号码
			idcardP: '',			                        // 身份证正面
			idcardS: '',			                        // 身份证反面
			urlP: require('../../assets/images/1.png'),		// 身份证正面默认图片
			urlS: require('../../assets/images/2.png'),	    // 身份证反面默认图片
			imgType: 0,
		}
	},
	mounted(){
		const isPlus = Toolkit.checker.isPlus();
		isPlus.then(() => {
			otc.init();
		})
	},
	methods:{
        // 点击上传事件
		chooPic(params){	
      this.imgType = params.type;						
			this.$refs.picture.toggle();    // 控制子组件的弹出
    },
        // 选定照片之后获取照片的路径
		getPath(e){	
			if(this.imgType == 1){
				this.urlP = e.path;
				this.idcardP = e.data;
			}else if(this.imgType == 2){
				this.urlS = e.path;
				this.idcardS = e.data;
			}				
		},	
		// 点击删除
		closeP(params){		
			if(params.type == 1){
				this.idcardP = '';
				this.urlP = require('../../assets/images/1.png');
			}else if(params.type == 2){
				this.idcardS = '';
				this.urlS = require('../../assets/images/2.png');
			}   
    },
		// 检查参数
		checkParams(){
				if(!this.username){
					Toolkit.win.toast('请填写姓名');
					return;
				}
				if(!Vc.isIdentity(this.idNumber)){
					Toolkit.win.toast('请填写正确的证件号码');
					return;
				}
				if(!this.idcardP){
					Toolkit.win.toast('请上传身份证正面');
					return;						
				}
				if(!this.idcardS){
					Toolkit.win.toast('请上传身份证反面');
					return;						
				}
				this.uploadIDCard();
		},
		// 提交信息
		uploadIDCard(){
			Ajax(apis.uploadIDCard, {
				username: Toolkit.storage.getUserInfo('username'),
				token: Toolkit.storage.getUserInfo('token'),
				id_card_name: this.username,
				id_card_num: this.idNumber,
				id_card_face: this.idcardP,
				id_card_back: this.idcardS,
			}).then(res => {
				Toolkit.win.toast(res.info);
				Toolkit.win.evalID('my_index.html','freshAjax');
				setTimeout(function(){
					Toolkit.win.getWebview().close();
				}, 2000);
				
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
@import '@{assets}/less/import';
    .num-box{ background: #002041; margin-top: .714rem; color: #fff; padding-bottom:2.143rem;
        // .login-input {width: 100%; padding: 0 1.143rem;
        //     li {width: 100%; height: 4.643rem; line-height: 4.643rem;overflow: hidden; border-bottom: 1px solid #244b72; font-size: 1.072rem; color: #fff;
        //         input { float: left; width: 80%; height: 4.643rem; line-height: 1.571rem;font-size: 1.286rem;color: #fff; padding: 0 1.143rem;}	
        //     }
        // }
        .allImg{width: 100%; margin-top: 1.429rem;
            .addStep-box{padding-bottom: 1.786rem;
                .img-box{  position: relative; overflow: hidden;
                    .img-btn-picture{text-align: center; width: 100%; height: 1.429rem;line-height: 1.429rem;font-size: 1.143rem; color: #222; margin-top: .571rem; color: #fff;}
                    .img-close{ position: absolute; right: 11%; top: 2.286rem; color: #fff; font-size: 1.786rem; z-index: 9999;}
                    .img-box-show{ width: 80%; height: 12.857rem; margin: 0 auto; text-align: center; margin-top: .714rem;   background-size: 100% 100%; overflow: hidden;
                        .img-btn{ width:6.429rem; height: 6.429rem; line-height: 6.429rem; border-radius: 50%; background: #1B465F; margin: 0 auto; margin-top: 2.143rem; text-align: center;
                             i{ color: #0075EB;font-size: 3.571rem; }
                        }
                        .img-btn-text{ font-size:1rem; line-height: 2.857rem; color: #999;}
                    }
                    .reverse{ background: url(../../assets/images/1.png) no-repeat; background-size: 100% 100%;}
                }
            }
        }
    }
</style>

