<template>
    <div>
        <otc-head>
        	<template slot="header">
        		<i class="iconfont slj-fanhui left otc-back" ></i>
				<i class="iconfont slj-shanchu1 right" v-tap="{methods: deleteImg}"></i>
        	</template>        
        </otc-head>
        <div class="wrapper">
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
    name: 'complaint_del',
	components:{otcHead, upPicture},
	data(){
		return{
			urlP: '',
		}
	},
	mounted(){
		const isPlus = Toolkit.checker.isPlus();
		isPlus.then(() => {
			otc.init();
			this.self = Toolkit.win.getWebview();
			this.urlP = this.self.data
		})
	},
	methods:{
		deleteImg(){
			console.log('点击删除');
			Toolkit.win.evalID('complaint.html', 'refresh');
			setTimeout(function(){Toolkit.win.getWebview().close();}, 500);
			
		}

	}
}
</script>
<style lang='less'>
@assets: '../../assets/'; 
@import '@{assets}/less/import';
@import '@{assets}/less/import';
.wrapper{margin-top: 0;
	img{width: 100%; height: 100%; display: block;}
}

</style>

