import Toolkit from './toolkit'
/**
 * 所有页面需要的，监听安卓物理返回键
 * init入口函数，传入一个Object
 */
const otc = {
    init(o){
        const option = Object.assign({
            isBack: false,          // 按物理返回键时是否直接退出APP
            isHome: false,          // 是否是首页
            style: null,            // 给当前窗口追加样式
            preload: []             // 预加载窗口组
        }, o);
        if(option.preload.length > 0) this.preload(option.preload, option.isHome);
        if(option.style) this.addStyle(option.style);
        this.startBack(option.isBack);
        this.backEvent();
    },
    /**
     * 预加载窗口
     * @param {Array} p 窗口对象组，包含id、style、extras参数
     */
    preload(p, isHome){
        for(let i = 0; i < p.length; i++){
            if(p[i].id){
                const wv = Toolkit.win.getWebview(p[i].id)
                if(!wv) {
                    const newWv = Toolkit.win.create(p[i].id, p[i].id, p[i].style, p[i].extras);
                    if(isHome){
                        const index = Toolkit.win.getWebview('index.html')
                        index.append(newWv);
                    }
                    Toolkit.win.winRecycling();
                }
            }
        }
    },
    // 给当前窗口添加样式，如：
    // softinputMode: "adjustResize" // 弹出软键盘时自动改变webview的高度
    // 'popGesture': 'none' // 关闭右滑
    addStyle(s){
        const self = Toolkit.win.getWebview();
        self.setStyle(s)
    },
    // 监听安卓物理返回键
    startBack(isBack){
        var firstBack = 0;
        plus.key.addEventListener('backbutton', () => {
            const currentWebview = Toolkit.win.getWebview();
            const now = Date.now || function () {
                return new Date().getTime();
            };

            currentWebview.canBack(function (evt) {
                /**
                 * 有可后退的历史记录，则后退。
                 * 否则，关闭当前窗口。
                 * 如果当前窗口是入口页，那么执行退出的逻辑。
                 */
                if (currentWebview.id === plus.runtime.appid || isBack) {
                    if (!firstBack) {
                        firstBack = now();
                        plus.nativeUI.toast('再按一次退出应用');

                        setTimeout(function () {
                            firstBack = 0;
                        }, 2000);
                    } else if (now() - firstBack < 2000) {
                        plus.runtime.quit();
                    }
                } else {
                    if (evt.canBack) {
                        history.back();
                    } else {
                        if(currentWebview.id == 'scan.html') currentWebview.close('pop-out');
                        else currentWebview.hide('pop-out');
                    }
                }
            });
        }, false);
    },
	
	back(){
		const currentWebview = Toolkit.win.getWebview();
		currentWebview.canBack(function (evt) {
			if (evt.canBack) {
				history.back();
			} else {
				currentWebview.close('auto');
			}
		});		
	},

    /**
     * 可手动取消监听
     */
    stopBack(){
        plus.key.removeEventListener('backbutton', () => {
            console.log("监听事件移除成功！")
        }, false);
    },

    /**
     * 自动监听带有otc-back样式名的DOM
     * 对其进行关闭当前页的操作
     */
    backEvent(){
        document.addEventListener('click', (e) => {
            const isOtcback = Toolkit.dom.hasClass(e.target, 'otc-back');
            if(isOtcback){
                Toolkit.win.getWebview().hide('auto');
            }
        })
    }
}


export default otc