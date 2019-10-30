<template>
    <div>
        <otc-head title="个人资料">
            <template slot="header">
                <i class="iconfont slj-fanhui left otc-back" v-tap="{methods: headturn}"></i>
                <span v-tap="{methods: savename}" class="right">保存</span>
            </template>        
        </otc-head>
        <div class="wrapper">
			<ul class="my-info my-nick">
				<li>
					<input type="text" name="" id="nick-input" :placeholder="'请输入您的昵称'" v-model="nickname" @input="changename"/>
					<i class="iconfont slj-shibai" id="sel" v-if="del" v-tap="{methods: delname}"></i>
				</li>
			</ul>
        </div>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import { Toast  } from 'mint-ui';
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public.js';
export default {
    name: 'set_nickname',
	components:{otcHead},
	data(){
		return{
			nickname: '',
			del: false,             //控制输入框后面的那个删除图标
			
		}
	},
	mounted(){
		const isPlus = Toolkit.checker.isPlus();
		isPlus.then(() => {
			this.self = Toolkit.win.getWebview();
			this.nickname = this.self.nickname;
			otc.init();
			
		}) 
	},
    methods:{
		headturn(){
			Toolkit.win.getWebview().close();
		},
        changename(){                   //input框内容发生改变时
            if(this.nickname.length>=1){
                this.del = true;
            }else{
                this.del = false;
            }
        },
        savename(){                     //点击右上角保存按钮
            let regtitle = /^[\u4e00-\u9FA5\w]{2,5}$/;
            if(!regtitle.test(this.nickname)){
                Toolkit.win.toast('请输入2-5个字的昵称');
            }else{
                this.saveUserInfo();
            }
        },
        saveUserInfo(){                 
            Ajax(apis.saveUserInfo, {
                username:Toolkit.storage.getUserInfo('username'),
                token:Toolkit.storage.getUserInfo('token'),
                nickname: this.nickname,          
            }).then(res => {
                Toolkit.win.toast(res.info);
				this.getInfo(res.data);
                Toolkit.win.evalID('my_index.html', 'freshAjax');
				Toolkit.win.evalID('my_info.html', 'getInfo');
				
				this.self.close();
            }, d => {
                Toolkit.win.toast(d.info);
            })
        },
        delname(){											// 点击后面的叉
            this.nickname = '';
            this.del = false;
        },
		getInfo(d){
			Toolkit.storage.upDataInfo('OTC_USERDATA', d);
		},
    },
    
    
}
</script>
<style lang='less'>
@assets: '../../assets/';
@import '@{assets}/less/import';
    .my-nick{ margin-top: .714rem;
        li{ width: 100%; height: auto; padding: 0 .714rem; line-height: 3.571rem; background: #002041; display: table;
            input {width: 90%;display: inline-block;height: 1.786rem;line-height: 1.786rem;color: #fff;font-size: 1.071rem;  padding:0px 0px 0.286rem 0.715rem;}
            .slj-shibai {float: right;font-size: 1.429rem; color: #a0a0a0;}
        }
    }
</style>

