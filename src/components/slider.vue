<template>
    <div id="tiao">
        <div id="jindu" :style="{width: w + 'px'}">
            <span @touchstart.stop.prevent="tStart" @touchmove.stop.prevent='tMove'></span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'silder',
    props: ['numb', 'totalNum'],
    data(){
        return {
            num: this.numb || 0,                        // 当前要消耗的数量
            x: 0,                                       // 初始距离（边距）X
            w: 0,                                       // 滑动的真实距离
            totalW: 0,                                  // 整个滑动条的宽度
            totalNumber: this.totalNum || 0,            // 总的数量大小（当拖动时根据此数量算出消耗数量）
        }
    },
    mounted(){
        this.totalW = document.getElementById('tiao').offsetWidth;                  // 总的宽度
    },
    methods: {
        tStart(e){
            this.x = e.targetTouches[0].pageX - this.w;                                 // 条条的边距
        },
        tMove(e){
            const moveW = e.targetTouches[0].pageX - this.x;                            // 计算已滑动宽度（当前的x坐标 - 边距）
            if(moveW <= this.totalW && moveW >= 0){                                     // 判断滑动距离是否超过两边边界
                this.w = moveW.toFixed(2);
                this.num = (this.w / this.totalW * this.totalNumber).toFixed(4);        // 计算消耗数量（滑动的宽度 / 总的宽度 * 总的数量）
                this.calculate();
            }
        },
        calculate(){
            const percentage = (this.w / this.totalW * 100).toFixed(2);             // 计算滑动百分比（滑动的宽度 / 总的宽度 * 100）
            this.$emit('getData', {percentage: percentage, num: this.num});
        }
    },
    watch: {
        numb(n){
            if(n <= 0) return;
            if(n <= (this.totalNum - 0)){
                this.w = (n / this.totalNum * this.totalW).toFixed(2);
                this.num = n;
                this.calculate();
            }else{
                this.num = 0;
                alert('已超出所持有量');
                this.calculate();
            }
        },
        totalNum(n){
            this.totalNumber = n;
        }
    }
}
</script>
<style lang="less" scoped>
#tiao{display: inline-block;width: 100%;height: .571rem;background: #d8d8d8;border-radius: .286rem;position: relative;
    #jindu{width: 0px;height: 0.572rem;background-color: #FF9871;border-radius: 0.286rem;
        background: -webkit-gradient(linear, 0 0, 100% 0, from(#2aa2fb), to(#61c2ff));
        background: -webkit-linear-gradient(left, #2aa2fb, #61c2ff);
        background: -moz-linear-gradient(left, #2aa2fb, #61c2ff);
        background: -o-linear-gradient(left, #2aa2fb, #61c2ff);
        background: linear-gradient(left, #2aa2fb, #61c2ff);
        span{width: 1.429rem; height: 1.429rem; border-radius: 50%; background: #61c2ff; display: block; float: right; margin-top: -6px; margin-right: -0.715rem;}
    }
}
</style>
