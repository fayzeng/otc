<template>
    <header>
        <slot name ='header' ></slot>
        <h1>{{title}}</h1>
    </header>
</template>
<script>
export default{
    name:'otc-head',
    props:['title'],
    data(){
        return{
            
        }
    }
}
</script>
<style lang="less">
@assets: '../assets/';
@import '@{assets}/less/import';
    header{ position:absolute;left:0; top:0;width: 100%; height:4.5rem; background: #002041;line-height: 4.5rem; -webkit-box-shadow: none !important;
            box-shadow: none !important;color: #fff;
             i.left, span.left{font-size: @p_s; width: 33%; text-align: left; position:absolute; top:1.429rem;left:0;padding-left: @p_s; height: 3.142rem;  line-height: 3.142rem;}
             i.right, span.right{font-size: @p_s; width: 33%;text-align: right;position:absolute; top:1.429rem;right:0;padding-right: @p_s;height: 3.142rem; line-height: 3.142rem;}
             h1{  font-size: @fo_s_12 +  0.572rem;  width: 100%;  text-align: center; line-height:  3.142rem;height: 3.142rem; line-height: 3.142rem;margin-top: 1.429rem;}
    }
</style>