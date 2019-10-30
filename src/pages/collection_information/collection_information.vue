<template>
    <div>
        <otc-head title="收款信息">
            <template slot="header">
                <i class="iconfont slj-fanhui left otc-back" ></i>
				 <span v-tap="{methods: checkParams}" class="right">保存</span>
            </template>        
        </otc-head>
        <div class="wrapper">
			<div class="home-title">
			    <span>选择收款方式</span>
			</div>
			<ul class="public_input">
				<li>
					<input type="text" v-model="bank.name"  placeholder="持卡人姓名" maxlength="11">
				</li>
				<li>
					<input type="number" v-model="bank.info"  placeholder="卡号" @blur="forbankname(bank.info)">
				</li>
				<li>
					<input type="text" v-model="bank.bankname"  placeholder="所属银行" disabled="disabled">
				</li>
			</ul>
			<div class="home-title">
			    <span>支付宝<i>(点击上传支付宝收款码)</i> </span>
			</div>	
			<div class="upload" v-tap="{methods: chooPic, type:'0'}" :style="'background-image: url('+ alay.info +' );'">
				<i v-if="!alay.info" class="iconfont slj-jiahao "></i>
			</div>
			<div class="home-title">
			    <span>微信</span>
			</div>
			<div class="upload" v-tap="{methods: chooPic, type:'1'}" :style="'background-image: url('+ wx.info +' );'">
				<i v-if="!wx.info" class="iconfont slj-jiahao "></i>
			</div>
			<up-picture ref="picture" @getPath="getPath"></up-picture>
        </div>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import { Toast, MessageBox } from 'mint-ui';
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public.js';
import upPicture from '../../components/upPicture';
export default { 
    name:'myinfo',
	components:{otcHead, upPicture},
    data(){
        return{      
			name:'',
			banknum:'',
			allbankname:[],
			bank:{
				name: '',
				info: '',
				bankname: ''
			},
			alay: {info: ''},
			wx: {info: ''},
			imgtype:'',
			allinfo: ''
        }
    }, 
	created: function () {
	},
	mounted(){
		const isPlus = Toolkit.checker.isPlus();
		isPlus.then(() => {
			otc.init();
			this.getBankInfo();
		})
	},
    methods:{
        openUrl(d){							// 打开某个页面
             Toolkit.win.openWV(d.url);
        },
		selectlist(d){
		    this.loginType = d.type;
		},
        chooPic(params){
        	this.imgType = params.type;						
        	this.$refs.picture.toggle();    // 控制子组件的弹出
        },
		getPath(e){							// 选择照片之后
			if(this.imgType == '0'){
				this.alay.info = e.data;
			}else{
				this.wx.info = e.data;
			}
		},
		getinfo(){
			 let getinfo = Toolkit.storage.getItem('OTC_RECEIVEINFO');
			for(let i=0; i < getinfo.length; i++){
				let type = getinfo[i].type;
				 if( type== '10')	this.alay = getinfo[i]; 
				 if( type== '20')	this.wx = getinfo[i];
				if( type== '40') {
					this.bank = getinfo[i];
					// this.bank.bankname = this.forbankname(this.bank.info);
					this.forbankname(this.bank.info);
				}
				
			}
		},
		// 点击进入预览
		delatePic(params){
			Toolkit.win.openWV('complaint_del.html', {data: params.address}, true);
		},
		checkParams() {
		    Toolkit.dom.blur();
			if(this.name){
				if(!Vc.isBank(this.banknum)) {
					Toolkit.win.toast('请输入正确的卡号');
					return false;
				}else{
					this.forbankname();
				}
			}
			
// 			if(!this.alay){
// 				Toolkit.win.toast('请上传支付宝收款码');
// 				return false;
// 			}
// 			if(!this.wx){
// 				Toolkit.win.toast('请上传微信收款码');
// 				return false;
// 			}
		    this.putUserReceiveInfo();
		},
		//添加用户收款信息
		putUserReceiveInfo(){						
			Ajax(apis.putUserReceiveInfo, {
				username:Toolkit.storage.getUserInfo('username'),
				token:Toolkit.storage.getUserInfo('token'), 
				bank: this.bank.info,          
				name: this.bank.name,
				zfb:this.alay.info,
				wx:this.wx.info,
				yl:''
			}).then(res => {
				let that = this;
				Toolkit.win.toast(res.info);
				Toolkit.win.evalID("homepage.html", ['freshAjax']);
				
				setTimeout(function(){
					Toolkit.win.getWebview().close();
				}, 500);
			}, d => {
				Toolkit.win.toast(d.info);
			})
		},
		
		//获取银行卡号所属银行
		getBankInfo(){						
			Ajax(apis.getBankInfo, {
				username:Toolkit.storage.getUserInfo('username'),
				token:Toolkit.storage.getUserInfo('token'), 
			}).then(res => {
				this.allbankname = res.data;
				this.getinfo();
			}, d => {
				Toolkit.win.toast(d.info);
			})
		},
		// 根据银行卡号匹配对应银行
		forbankname(str){
			let Num = '';
		  	let obj = this.allbankname.filter( (item) => {
				let bool = str.includes(Object.keys(item)[0]);
			  	if(bool) Num = Object.keys(item)[0];
				return bool
			})[0];
			this.$set(this.bank,'bankname', obj[Num]);
			// this.bank.bankname = obj[Num];
			// return obj[Num];
		},
    }, 
    
}


</script>
<style lang='less'>
@assets: '../../assets/';
@import '@{assets}/less/import';
@import '@{assets}/less/mint-ui.css';
.wrapper .public_input{background: none;}
.home-title{width: 100%; height:3.5rem; line-height: 3.5rem; padding-left: 1.429rem; background: none;
    span{font-size: 1.072rem; color: #fff; font-weight: bold; vertical-align: middle; border-left: 2px #0075eb solid; padding-left: 8px;
		i{font-size:12px; font-weight: 300;padding-left: 5px;color: #b3beca;}
	}
}
.upload {width: 5.71rem;height: 5.71rem;line-height: 5.71rem; background: #fff;margin-left: 1.429rem;text-align: center; background-size: 100% 100%;
	.slj-jiahao {color: #6b6d78;font-size: 2.5rem;}
}
</style>

