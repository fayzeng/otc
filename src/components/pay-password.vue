<template>
    <div class="pay-password" v-if="dispay">
        <div class="pwd-bg" v-tap="{methods: hide}"></div>
        <div class="pwd-box">
            <h1>输入支付密码</h1>
            <ul class="pwd-list">
                <li>{{password.length >= 1 ? '●' : ''}}</li>
                <li>{{password.length >= 2 ? '●' : ''}}</li>
                <li>{{password.length >= 3 ? '●' : ''}}</li>
                <li>{{password.length >= 4 ? '●' : ''}}</li>
                <li>{{password.length >= 5 ? '●' : ''}}</li>
                <li>{{password.length >= 6 ? '●' : ''}}</li>
            </ul>
            <div class="pwd-link">
                <a v-tap="{methods: goto}">忘记支付密码？</a>
            </div>
            <ul class="pwd-keys">
                <li v-tap="{methods: keysOn, key: '1'}">1</li>
                <li v-tap="{methods: keysOn, key: '2'}">2</li>
                <li v-tap="{methods: keysOn, key: '3'}">3</li>
                <li v-tap="{methods: keysOn, key: '4'}">4</li>
                <li v-tap="{methods: keysOn, key: '5'}">5</li>
                <li v-tap="{methods: keysOn, key: '6'}">6</li>
                <li v-tap="{methods: keysOn, key: '7'}">7</li>
                <li v-tap="{methods: keysOn, key: '8'}">8</li>
                <li v-tap="{methods: keysOn, key: '9'}">9</li>
                <li class="no-bg"></li>
                <li v-tap="{methods: keysOn, key: '0'}">0</li>
                <li class="no-bg" v-tap="{methods: keysOn, key: 'del'}"><i class="iconfont slj-iconfontcha"></i></li>
            </ul>
        </div>
    </div>
</template>
<script>
import Toolkit from '../assets/js/toolkit';
import { MessageBox } from 'mint-ui';
    export default {
        name: 'pay-password',
        props: ['isDisplay'],
        data(){
            return {
                password: [],                       // 存储密码的数组
                dispay: this.isDisplay              // 是否显示密码框
            }
        },
        created(){},
        methods: {
            // 虚拟键盘按键事件
            keysOn(d){
                if(d.key != 'del'){
                    if(this.password.length < 6 && d.key){
                        this.password.push(d.key);
                        if(this.password.length == 6){
                            this.$emit('getData', {pwd: this.password})             // 当位数满6个时，触发父组件定义的事件，父组件定义事件的方法（v-on:getData="methods方法"）
                        }
                    }
                }else{
                    this.password.pop();
                }
            },
            // 密码输入完成后，供父组件调用的方法（当密码正确时，关闭密码框，错误时弹出提示，并可重新输入）
            // 此方法在父组件调用方法为 this.$refs.payPassword.tips(false); 参数为布尔值。
            tips(bln){
                if(bln){
                    this.dispay = false;
                    this.password = [];
                }else{
					this.dispay = true;
                    MessageBox.alert('密码错误，请重新输入！', '提示').then(() => {
                        this.password = [];
                    })
                }
            },
            // 手动打开关闭密码框
            open(bln){
                if(bln) this.dispay = true;
                else this.dispay = false;
            },
            hide(){
                this.dispay = false;
            },
            goto(){
                Toolkit.win.openWV('paypsd_step1.html');
            }
        }
    }
</script>
<style lang="less" scoped>
    @fontsize: 15px;
    .pwd-bg{ position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, .2);}
    .pwd-box{position: fixed; bottom: 0; left: 0; width: 100%; height: 410px; background: #fff; color: #333;
        h1{ text-align: center; font-size: @fontsize + 5; padding: 22px; font-weight: bold;}
        .pwd-list{ overflow: hidden; padding: 0 22px;
            li{ width: 100% / 6; height: 50px; line-height: 50px; font-size: @fontsize + 4; float: left; background: #fff; border: 1px #f0f0f0 solid; border-left: none; text-align: center;}
            li:first-child{ margin-left: 0; border-left: 1px #f0f0f0 solid;}
        }
        .pwd-link{ margin-top: 10px; text-align: right; color: #7f8389; font-size: @fontsize; padding: 0 22px;}
        .pwd-keys{ width: 100%; background: #d1d5db; height: 225px; position: absolute; bottom: 0; padding-top: 5px;
            li{ float: left; text-align: center; margin: 0 0 5px 5px; margin-top: 0; width: calc((100% - 20px) / 3); height: 50px; line-height: 46px; background: #fff; border-radius: 5px; border-bottom: 1px #999 solid; font-size: @fontsize + 9;}
            li.no-bg{ background: none; border:none;
                i{ font-size: @fontsize + 7;}
            }
            li:active{ background: #f0f0f0;}
        }
    }
</style>