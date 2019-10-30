<template>
    <div>
        <mt-actionsheet
            :actions="actions"
            v-model="sheetVisible">
        </mt-actionsheet>
    </div>
</template>
<script>
import ImgUrl from '../assets/js/imgUrl'
import { Actionsheet,  Toast } from 'mint-ui';
export default {
    data(){
        return{
            sheetVisible: false,
            actions: [{
                name: '拍照',
                method: this.picture
            },{
                name: '相册',
                method: this.photo
            }]
        }
    },
    mounted(){
        this.imgUrl = new ImgUrl();
    },
    methods: {
        // 拍照回调
        picture(){
            const _this = this;
            this.imgUrl.open({
                type: 'picture',
                error(error){
                    Toast(error.msg)
                },
                success(url, base64){
                    _this.$emit('getPath', {path: url, data: base64});
                }
            })
        },
        // 相册回调
        photo(){
            const _this = this;
            this.imgUrl.open({
                type: 'photo',
                error(error){
                    Toast(error.msg)
                },
                success(url, base64){
                    _this.$emit('getPath', {path: url, data: base64});
                }
            })
        },
        // 组件开关
        toggle(visible){
            if(visible) this.sheetVisible = visible;
            else this.sheetVisible = !this.sheetVisible;
        }
    }
}
</script>
<style lang="less" scoped>

</style>
