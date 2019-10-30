<template>
    <div>
        <otc-head title="头像剪裁">
            <template slot="header">
                <i class="iconfont slj-fanhui left otc-back" ></i>
								<span class="right" v-tap="{methods: finish}">确定</span>
            </template>        
        </otc-head>
        <div class="wrapper">
						<vueCropper
						ref="cropper"
            :img="option.img"
						:centerBox = 'option.centerBox'
						:canMove = 'option.canMove'
						:autoCrop = 'option.autoCrop'
						:fixed = 'option.fixed'
						></vueCropper>
            <!-- <div class="port-img"><img :src="backImg"></div> -->
        </div>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import { Toast  } from 'mint-ui';
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public.js';
import {VueCropper } from 'vue-cropper';
export default {
    name: 'my_portrait',
	components:{otcHead, VueCropper},
	data(){
		return{
			backImg: '',
			previews: {},
			option: {
					img: '',//裁切图片的地址
					centerBox: true,													// 截图框是否被限制在图片里面
					canMove: true,                                   // 上传图片是否可以移动
					autoCrop: true, 													// 是否默认生成截图框
					fixed: true,															// 是否开启截图框宽高固定比例
					
					
			},
		}
	},
	mounted(){
		const isPlus = Toolkit.checker.isPlus();
		isPlus.then(() => {
			this.option.img = Toolkit.win.getWebview().imgUrl;
			
			otc.init();
		})
	},
	methods:{
		finish(d){
			this.$refs.cropper.getCropData((data) => {
				console.log(data);
				Toolkit.storage.setItem("OTC_IMGDATA", data); 
				Toolkit.win.evalID("my_info.html", ['getImgData']);
				Toolkit.win.getWebview().close();
			})
		},
	}
}
</script>
<style lang='less'>
@assets: '../../assets/';
@import '@{assets}/less/import';
body {background: #000;
    .port-img{width: 100%;height: 42.858rem;display: table-cell;text-align: center;vertical-align: middle;
        img{width: 100%;vertical-align: middle;}
    }
	.vue-cropper{
        background: black;
        background-image: none!important;
    }
}
</style>

