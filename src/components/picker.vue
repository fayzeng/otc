<template>
	<mt-popup v-model="dispay"  position="bottom" style="width: 100%">
		<ul class="selec-box">
            <li class="cancel" v-tap="{methods: cancel}">取消</li>
            <li class="complete" v-tap="{methods: complete}">完成</li>
        </ul>
        <mt-picker :slots="selectData" @change="onValuesChange" value-key="text">
        </mt-picker>
    </mt-popup>
</template>

<script>
import { Picker, Popup} from 'mint-ui';

export default{
    /**
     * selectItems从父组件传来的数据源
     */
    name: 'codePicker',
    props: [ 'selectItems'],
    data(){
        return{
            dispay: false,      // 变量，用于选择器的显示和隐藏
            selectData:[{                  // 填充选择器数据  参数详见API文档 http://mint-ui.github.io/docs/#/zh-cn2/picker
                flex: 1,
                values: this.selectItems,  
                className: 'slot1',
                textAlign: 'center'
            }]
        }
    },
	
    methods: {
        onValuesChange(picker, values) {
            if(values[0]){
                this.allcountry = values[0].text;
				this.allvalue = values[0].value;
                this.phnumber = values[0].phnumber;
            }
        },
        // 用于选择器的显示
        open(){
			console.log('填充选择器数据' + JSON.stringify(this.selectData[0].values))
			this.selectData[0].values = this.selectItems; //TODO 页面加载  先渲染再触发事件 导致数据数据不同步 不能渲染  只能再赋值
            this.dispay = true;
			
        },
        // 完成事件
        complete(){
            this.$emit('getData', {text: this.allcountry, num: this.phnumber, value: this.allvalue}) // 当点击完成时，触发父组件定义的事件，父组件定义事件的方法（v-on:getData="methods方法"）
            this.dispay = false;
        },
        // 取消事件
        cancel(){
            this.dispay = false;
        },
    }
}
</script>

<style lang="less" scoped>
@assets: '../assets/';
@import '@{assets}/less/import';
	ul.selec-box{height: 2rem;
        li {width: 40px; display: inline-block;line-height: 55px;color: #4199f0;font-size: 15px;border: none;z-index: 9999;}
        li.cancel{margin-left: 20px;float: left;}
        li.complete{float: right;margin-right: 20px;}
    }
</style>