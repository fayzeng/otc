<template>
    <div>
        <otc-head title="申诉">
        	<template slot="header">
        		<i class="iconfont slj-fanhui left otc-back" ></i>
        	</template>        
        </otc-head>
        <div class="wrapper">
            <div class="all-img">
				<div class="home-title">
			   	 	<span>付款凭证</span>
				</div>	
				<div class="img-box">
					<div class="upload"  v-for="item in addImg" :style="'background-image: url('+ item +' );'" v-tap="{methods: delatePic, address: item}" :key="item.ids"></div>
					<div class="upload" v-if="addImg.length < 3"  v-tap="{methods: chooPic}"><i class="iconfont slj-jiahao "></i></div>
				</div>
				<up-picture ref="picture" @getPath="getPath"></up-picture>
			</div>
			<div class="remark">
				<div class="home-title">
			   	 	<span>备注</span>
				</div>
				<div class="remark-text">
					<textarea name="" id="" v-model="remakeData"></textarea>
				</div>
				
			</div>

			<div class="all_button">
                <button v-tap="{methods: checkParams}">提交</button>
            </div>  
        </div>

		<div class="complaint-del" v-if="imgBack">
			<otc-head>
				<template slot="header">
					<i class="iconfont slj-fanhui left" v-tap="{methods: backing}"></i>
					<i class="iconfont slj-shanchu1 right" v-tap="{methods: deleteImg}"></i>
				</template>        
       	 	</otc-head>
			<img :src="urlP">
		</div>

    </div>
</template>
<script>
import otcHead from '../../components/head';
import { Toast, MessageBox  } from 'mint-ui';
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public.js';
import upPicture from '../../components/upPicture';

export default {
    name: 'complaint',
	components:{otcHead, upPicture},
	data(){
		return{
			sheetVisible: false,                            // 控制相册的弹框
			urlP: require('../../assets/images/1.png'),		// 身份证正面默认图片
			imgType: 1,
			addImg:[],
			imgBack: false,
			orData: '',
			remakeData: ''
		}
	},
	mounted(){
		const isPlus = Toolkit.checker.isPlus();
		isPlus.then(() => {
			otc.init();
			this.self = Toolkit.win.getWebview();
			this.orData = this.self.data;
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
			this.addImg.push(e.data);
		},
		// 点击进入预览
		delatePic(params){
			this.imgBack = true;
			this.urlP = params.address;
		},
		// 点击提交
		checkParams(){
			Ajax(apis.appeal, {
				username:Toolkit.storage.getUserInfo('username'),
				token:Toolkit.storage.getUserInfo('token'),  
				tid: this.orData.trade_info_id,
				img_url: this.addImg,
				remark: this.remakeData
			}, ['img_url']).then(res => {
				Toolkit.win.toast(res.info);
				Toolkit.win.evalID('buy_order.html', 'freshAjax');
				plus.webview.close(this.self, 'none', 0);
			}, d => {
				Toolkit.win.toast(d.info);
			})			
		},
		// 撤销删除照片
		backing(){
			this.imgBack = false;
		},
		// 点击删除照片
		deleteImg(){
			let imgArray = [];
			for(let i = 0; i < this.addImg.length; i++){
				if(this.addImg[i] != this.urlP){
					imgArray.push(this.addImg[i]);
				}
			}
			this.addImg = imgArray;
			this.imgBack = false;
		}

	}
}
</script>
<style lang='less'>
@assets: '../../assets/'; 
@import '@{assets}/less/import';
@import '@{assets}/less/import';
.home-title{width: 100%; height:3.5rem; line-height: 3.5rem; padding-left: 1.429rem; background: none;
	span{font-size: 1.072rem; color: #fff; font-weight: bold; vertical-align: middle; border-left: 2px #0075eb solid; padding-left: 8px;
		i{font-size:12px; font-weight: 300;padding-left: 5px;color: #b3beca;}
	}
}
.all-img{width: 100%;  overflow: hidden; padding: 0 .714rem; 
	.img-box{width: 100%; height:  5.714rem;
		.upload {width: 5.714rem;height: 5.714rem;line-height: 5.71rem; background: #fff; margin-left: 1.429rem;text-align: center; background-size: 100% 100%; float: left;
			.slj-jiahao {color: #6b6d78;font-size: 2.5rem;}
		}
	}
}
.remark{width: 100%; overflow: hidden; padding: 0 .714rem; 
	.remark-text{width: 100%; padding: 0 1.429rem; height: 10.429rem;
		textarea{width: 100%; height: 100%; background: #002041; color: #fff; text-indent: 2rem; padding-top: .714rem; font-size: 1.071rem; border-radius: .714rem;}
	}
}
.complaint-del{position: fixed; top: 0; left: 0; width: 100%; height: 100%; background:rgba(0,0,0,0.7);
	img{width: 100%; height: 100%; display: block;}
}
</style>

