<template>
	<div class="msg">
		<otc-head title="扫码支付">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
			</template>
		</otc-head>

		<div class="wrapper">
			 <!-- <div class="navlist">
				<ul>
					<li class="navli"  v-for="(item,index) in navList" :class="{'activeT':nowIndex===index}" @click="tabClick(index)"><i>{{item.name}}</i>
					</li>
				</ul>
			</div> -->
			<div class="swiper-container">
				<div class="swiper-wrapper">
					<div class="swiper-slide">Slide 1</div>
					<div class="swiper-slide">Slide 2</div>
					<div class="swiper-slide">Slide 3</div>
					<div class="swiper-slide">Slide 4</div>
					<div class="swiper-slide">Slide 5</div>
					<div class="swiper-slide">Slide 6</div>
					<div class="swiper-slide">Slide 7</div>
					<div class="swiper-slide">Slide 8</div>
					<div class="swiper-slide">Slide 9</div>
					<div class="swiper-slide">Slide 10</div>
				</div>
				<!-- Add Pagination -->
				<div class="swiper-pagination"></div>
			</div>


		</div>
	</div>

</template>
<script>
import otcHead from '../../components/head'
import {Ajax, Toolkit, otc, Vc, apis} from '../../components/public'
import Swiper from 'swiper'
export default {
	name: "swiper",
	components: {
		otcHead
	},
	data() {
		return {
			navList:[
			{name:'热门答疑'},
			{name:'北清状元'},
			{name:'北清状元'},
			{name:'北清状元'},
			{name:'北清状元'},
			{name:'北清状元'},
        	],
        	nowIndex:0,
		}
	},
	created(){

	},
	mounted() {
		this.isPlus = Toolkit.checker.isPlus();
		 var that=this
      var swiper = new Swiper('.swiper-container', {
				slidesPerView: 3,
				spaceBetween: 30,
				pagination: {
					el: '.swiper-pagination',
					clickable: true,
				},
			});
		this.isPlus.then(() => {
			otc.init();
		})
	},
	methods: {
		tabClick(index){
        this.nowIndex = index
      },
	},

}
</script>
<style lang="less">
@assets: '../../assets';
@import '@{assets}/less/import';
.wrapper{background: #fff;}
 .swiper-container {
      width: 100%;
      height: 100%;
	}
	.swiper-wrapper{ display: -webkit-box;}
    .swiper-slide {
      text-align: center;
      font-size: 18px;
      background: #fff;
      /* Center slide text vertically */
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
    }

</style>
