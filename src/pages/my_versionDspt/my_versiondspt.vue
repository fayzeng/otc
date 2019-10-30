<template>
    <div>
        <otc-head title="版本说明">
            <template slot="header">
                <i class="iconfont slj-fanhui left otc-back"></i>
            </template>        
        </otc-head>
        <div class="wrapper">
            <div class="ver-box">
                <div class="ver-title">
                    <h1>当前版本</h1>
                    <span>{{nowVersion.version}}</span>
                </div>
                <div class="ver-conent">
                    <h1>版本描述</h1>
                    <p>{{nowVersion.intro}}</p>
                </div>
            </div>	
           <div class="ver-box" v-for="item in listVersion">
                <div class="ver-title">
                    <h1>历史版本</h1>
                    <span>{{item.version}}</span>
                </div>
                <div class="ver-conent">
                    <h1>版本描述</h1>
                    <p>{{item.intro}}</p>
                </div>
            </div>           		
        </div>
    </div>
</template>
<script>
import otcHead from '../../components/head';
import { Toast, MessageBox  } from 'mint-ui';
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public'
export default {
    name: 'my_versiondspt',
	components:{otcHead},
    data(){
        return{
            version: null,                      //传给后台的当前版本
            nowVersion: '',                     //现版本
			listVersion: ''                     //历史版本

        }
    },
    mounted(){
        const isPlus = Toolkit.checker.isPlus();
        isPlus.then(() => {
			otc.init();
			let that = this;
			plus.runtime.getProperty(plus.runtime.appid, function(inf) {	
				console.log('版本' + inf.version);
				that.version = inf.version;
				that.getVersionIntro();
			});	
        })
    },
    methods:{
        getVersionIntro(){						// 获取历史版本信息
            Ajax(apis.getVersionIntro, {
                username:Toolkit.storage.getUserInfo('username'),
                token:Toolkit.storage.getUserInfo('token'),
                sign:'',    
                version: this.version    
            }).then(res => {
                this.nowVersion = res.data;
                this.listVersion = res.data.list;
            }, d => {
                Toolkit.win.toast(d.info);
            })           
        }
    },
    
}
</script>
<style lang='less'>
@assets: '../../assets/';
@import '@{assets}/less/mint-ui.css';
@import '@{assets}/less/import';
    .ver-box{width: 100%; height: auto; background: #002041; padding: 0 1.429rem; color: #fff; margin-top: .714rem;
        .ver-title{height: 3.571rem; line-height: 3.571rem; border-bottom: 1px #00152A solid;
            span{float: right; color: #fff;}
        }
        .ver-conent{line-height: 2.857rem;
            p{padding: 10px 0; line-height: 2.858rem;}

        }
        h1{display: inline-block; font-size: 1.071rem;}

    }
</style>

