<template>
    <mt-popup v-model="dispay" position="bottom" style='width:100%;'>
        <ul class="selec-box">
            <li class="cancel" v-tap="{methods: cancel}">取消</li>
            <li class="complete" v-tap="{methods: complete}">完成</li>
        </ul>
        <mt-picker :slots="slots" value-key="text" @change="onValuesChange" ></mt-picker>
    </mt-popup>
</template>
<script>
    import {Picker, Toast} from 'mint-ui'
    export default {
        props: ['isDisplay', 'selectItems'],
        data(){
            return {
                dispay: this.selectItems,                 // 控制显示年月选择器
                ddCreatetime: '',                       // 存储选择后的年月，格式‘2018-4’
                slots: [{                               // 选择器数据
                    flex: 1,
                    defaultIndex: 0,
                    values: this.getYears(),
                    className: 'slot1',
                    textAlign: 'center'
                },{
                    flex: 1,
                    values: this.getMonths(),
                    className: 'slot3',
                    textAlign: 'center'
                }]
            }
        },
		mounted() {
			 console.log(this.isDisplay)
		},
        methods: {
            // 选择年月时的change事件
            onValuesChange(picker, values) {
                if(values[0]){
                    let months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
                    let nowDate = new Date();
                    let nowYear = nowDate.getFullYear();
                    if(values[0] != nowYear){
                        picker.setSlotValues(1, months);
                    }else{
                        picker.setSlotValues(1, this.getMonths());
                    }
                    this.ddCreatetime = values[0] + '-' + values[1];
                }
            },
            // 获取当年过去的月份
            getMonths(){ 
                let months = [];
                let nowDate = new Date();
                let nowMonth = nowDate.getMonth();
                let x = nowMonth;
                for(let i = 0; i <= x; i++){
                    months.push(i + 1);
                }
                return months
            },
            // 获取当前年份之前的十年
            getYears(){ 
                let years = [];
                let nowDate = new Date();
                let nowYear = nowDate.getFullYear();
                for(let i = 0; i < 10; i++){ 
                    years.push(nowYear)
                    nowYear --;
                }
                return years
            },
            // 完成事件
            complete(){
                this.$emit('getData', {dt: this.ddCreatetime})                  // 当点击完成时，触发父组件定义的事件，父组件定义事件的方法（v-on:getData="methods方法"）
                this.dispay = false;
            },
            // 取消事件
            cancel(){
                this.dispay = false;
            },
            // 手动打开选择器
            open(){
                this.dispay = true;
            }
        },
        components: {Picker}
    }
</script>
<style lang="less" scoped>
    @fontsize: 15px;
    ul.selec-box{
        li{width: 40px; display: inline-block;line-height: 55px;color: #4199f0;font-size: @fontsize;}
        li.cancel{margin-left: 20px;}
        li.complete{float: right;margin-right: 20px;}
    }
</style>