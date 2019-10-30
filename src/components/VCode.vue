<template>
    <input type="button" class="verification" v-tap="{methods: sendCode, num: 1}" :value="codeText" :disabled="disabled">
</template>
<script>
export default {
    props: ['isDisabled'],                // 控制按钮是否可用
    data(){
        return {
            seconds: 10,
            disabled: this.isDisabled,
            codeText: ''
        }
    },
    mounted(){
        this.codeText = '获取验证码';
    },
    methods: {
        // 按键响应方法
        sendCode(){                                         
            this.$emit('sendFn'); // sendFn为通知服务器发送验证码的方法，由父级定义
            // this.timy();
        },
        // 读秒的递归
        timy(){
            if(this.seconds <= 0){
                this.disabled = false;
                this.codeText = '重发验证码';
                this.seconds = 10;
                return;
            }else{
                this.codeText = '重发验证码'+ this.seconds + 's';
                this.disabled = true;
                setTimeout(() => {
                    this.seconds--;
                    this.timy();
                }, 1000);
            }
        }
    }
}
</script>
<style lang="less" scoped>

</style>
