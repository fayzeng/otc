<template>
        <div class="" style="position: relative; width: 100%; height: 100%;">
			<img src="../../assets/images/geng.png" style="width: 40%;position: absolute;top: 20%;left: 30%;">
			<p class="speed" id="speedtirle">
				<span id="speed-tirle" v-show="downInfo.isSpeed">速度 <i>{{downInfo.speed}}</i></span>
			</p>
			<div class="container">
				<span class="bar-unfill">
					<span class="bar-fill" :style="{width: downInfo.percentage + '%'}"></span>
				</span>
			</div>
			<p class="speed testing">
				<span class="testing-title">{{downInfo.text}} <i>{{downInfo.downloadedSize}}</i>/<i>{{downInfo.totalSize}}</i></span>
				<span class="percentage">{{downInfo.percentageText}}</span>
			</p>
		</div>
</template>
<script>
import {Ajax, Toolkit, Backbutton, Vc, apis} from '../../components/public';
import Update from '../../assets/js/update'
import {Toast} from 'mint-ui'

export default {
    data(){
        return {
			downInfo: {
				text: '正在下载更新',					// 下载提示字样
				totalSize: 0,							// 下载总大小
				downloadedSize: 0,						// 已经下载的大小
				percentage: 0,							// 进度条的控制
				percentageText: '0%',					// 已经下载的百分比
				speed: '0',								// 下载速度
				isSpeed: true							// 速度栏的显示控制
			}
        }
    },
    mounted(){
		const isPlus =  Toolkit.checker.isPlus();
        isPlus.then(() => {
			
			this.self = Toolkit.win.getWebview();
			if(this.self.d) this.downloadStrart();
			// 测试evalJS
			// Toolkit.win.evalID('HBuilder', {
			// 	'updateTest': ['通过参数传进来的', '第二个参数'],
			// 	'updateTest2': ['通过参数传进来的2', '第二个参数2']
			// })

		})
    },
    methods: {
		// 开始下载
		downloadStrart(){
			const startDate = new Date();
			Update.UResources.downFile(this.self.d.url, (download, status) => {
				// download.state 下载链接状态 3代表 连接成功 准备传输数据 具体参见http://www.html5plus.org/doc/zh_cn/downloader.html#plus.downloader.DownloadState
				if(download.state == 3){	
					this.downloadIng(startDate, download, status);
				}else if(download.state == 4){
					if(status == 200){	// status 状态为是否下载成功
						this.downloadSuccess(download, status);
					}else{
						this.downloadError(download, status);
					}
				}
			})
		},
		// 开始下载后的回调
		downloadIng(startDate, download, status){
			const endDate = new Date();
			this.downInfo.speed = (download.downloadedSize / (endDate - startDate)).toFixed(2) + 'kb/s';
			this.downInfo.totalSize = Update.Tools.convers(download.totalSize);
			this.downInfo.downloadedSize = Update.Tools.convers(download.downloadedSize);
			this.downInfo.percentageText = (download.downloadedSize / download.totalSize * 100).toFixed(0) + '%';
			this.downInfo.percentage = download.downloadedSize / download.totalSize * 100;
		},
		// 下载成功
		downloadSuccess(download, status){
			this.downInfo.text = '下载完成';
			this.downInfo.isSpeed = false;
			this.installStart(download, status);
		},
		// 下载失败
		downloadError(download, status){
			this.downInfo.text = '下载失败';
			this.downInfo.isSpeed = false;
		},
		// 安装
		installStart(download, status){
			Update.UResources.installFile(download.filename)
				.then(() => {
					this.downInfo.text = '更新完成';
					plus.nativeUI.confirm('更新成功，立即重启', function(e){
						if(e.index == 0) plus.runtime.restart();
					}, {
						title: '提示',
						buttons: ['重启']
					})
				})
				.catch(() => {
					if(this.self.d.isUpdate){
						this.downInfo.text = '更新失败';
						plus.nativeUI.confirm('更新失败', function(e){
							if(e.index == 0) plus.runtime.restart();
						}, {
							title: '提示',
							buttons: ['关闭']
						})
					}else{
						plus.nativeUI.confirm('更新失败', function(e){
							if(e.index == 0){
								this.downloadStrart();
							}else{
								this.self.close();
								Toolkit.win.openWV('login.html');
							}
						}, {
							title: '提示',
							buttons: ['重试','跳过']
						})
					}
				})
		}
    }
}
</script>
<style lang="less">
@assets: '../../assets';
@import '@{assets}/less/import';
.container { width: 80%; position: absolute; bottom: 30%; left: 10%; border: 1px solid #000; border-radius: 1.786rem;} 
.bar-unfill { width: 100%;height: .357rem; display:block; background:#fff; border-radius:8px }
.bar-fill { width: 0; height: .357rem; display:block; background:#6ad5f9; border-radius:8px;
    background: linear-gradient(to left,  #0854c5, rgb(153, 188, 252));
}
.speed { position: absolute; bottom: 33%; left: 10%; color: #fff; font-size: .857rem;}
.testing{bottom: 23%; width: 80%; height: 2.143rem; overflow: hidden; display: inline-block;}
.testing-title{height: 1.429rem; overflow: hidden; display: inline-block;}
.testing .percentage{color: white; font-size: 1rem; float: right; font-weight: bold;}
.speed-data,.testing-data{ padding-left: .714rem;}
</style>
