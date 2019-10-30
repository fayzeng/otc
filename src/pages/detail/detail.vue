<template>
	<div class="msg">
		<otc-head title="交易详情">
			<template slot="header">
				<i class="iconfont slj-fanhui left otc-back"></i>
			</template>
		</otc-head>

		<div class="wrapper">
			<div class="login" v-if="billDetail">
				<h2>{{billDetail.chart}}<em>{{billDetail.fee}}</em></h2>
				<p>≈ {{billDetail.price}}<span> (CNY)</span></p>
				<span>{{billDetail.statusText}}</span>
			</div>
			<ul class="bill-detail" v-if="billDetail"> 
                <li>
                    <h3>交易单号</h3>
                    <span>{{billDetail.id}}</span>
                </li>
                <li>
                    <h3>交易类型</h3>
                    <span>{{billDetail.typeName}}</span>
                </li>
                <li>
                    <h3>交易时间</h3>
                    <span>{{billDetail.create_time}}</span>
                </li>
                <li>
                    <h3>交易状态</h3>
                    <span>{{billDetail.statusText}}</span>
                </li>
                <li>
                    <h3>手续费({{billDetail.cId}})</h3>
                    <span>{{billDetail.process_fee}}</span>
                </li>
                <li v-if="!!billDetail.trade_address">
                    <h3>对方钱包号</h3>
                    <span>{{billDetail.trade_address}}</span>
                </li>
                <li v-if="!!billDetail.address">
                    <h3>提币地址</h3>
                    <span>{{billDetail.address}}</span>
                </li>
				<li v-if="!!billDetail.remark">
                    <h3>备注</h3>
                    <span>{{billDetail.remark}}</span>
                </li>
            </ul>
		</div>
	</div>

</template>
<script>
	import otcHead from '../../components/head';
	import {Toolkit, otc} from '../../components/public';
	import {Toast,} from 'mint-ui';
	export default {
		components: {
			otcHead,
		},
		data() {
			return {
				billDetail: '',
			}
		},
		mounted() {
			this.isPlus = Toolkit.checker.isPlus();
			this.isPlus.then(() => {
				otc.init();
				this.self = Toolkit.win.getWebview();
				// this.billDetail = this.self.data;
				this.dealData(this.self.data)
			})
		},
		methods: {
			// 处理数据
			dealData(d){
				for(const key in d){
					if(!d[key]) continue;
					if(d[key].length > 20){
						d[key] = d[key].substring(0, 20) + '...';
					}
				}
				this.billDetail = d;
			}
		}
	}
</script>
<style lang="less" scoped>
@assets: '../../assets';
@import '@{assets}/less/import';

.rhidden {display: none;}
.login {width: 100%;height: 10.572rem;text-align: center; color: #fff;
	background: url( '@{assets}/images/home_bg.png'); background-size: 100%; padding: 2.143rem;
	h2{font-size: 1.857rem;font-weight: bold;line-height: 100%;}
	p{ font-size: .929rem;}
	span,p{ line-height: 200%;}
}

.bill-detail {margin-bottom: 30px;
	li{ height: auto;line-height: 50px; background: #002041;  margin: 1px 0px;padding: 0 20px;color: #fff; text-align: left; width: 100%;}
	h3{ font-size: 15px;display: inline-block; }
	span{float: right;font-size: 15px;font-weight: bold;}
}
</style>
