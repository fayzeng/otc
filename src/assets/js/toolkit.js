import apis from '../../axios/apis'
import Ajax from '../../axios'
/**
 * 工具包
 */

 // 缓存集
const storage = {
	
    /*
    * 获取地区号码
    *@params: mandatory {boolean},是否强制获取，默认值为false
    * return {object},地址号码
    */
    getTelCode(mandatory = false){
        const OTC_TELCODE = Toolkit.storage.getItem('OTC_TELCODE');
        let promise = new Promise((resolve, reject) => {
            if(!OTC_TELCODE || mandatory){
                Ajax(apis.country,{
                    token: Toolkit.storage.getUserInfo('token'),
                }).then(res => {
                    const itelCode = [];
                    for(let i=0; i< res.data.length; i++){
                        let o ={};
                        o.value = res.data[i].id;
                        o.phnumber = res.data[i].number;
                        o.text = res.data[i].number + res.data[i].country_name;
                        itelCode.push(o);
                    }
                    Toolkit.storage.setItem('OTC_TELCODE', itelCode );
                    resolve(itelCode);
                }, d => {
                    reject('获取失败');
                })
            }else{
                resolve(OTC_TELCODE);
            }
        })
        return promise;
    },

    /**
     * 添加缓存
     * @param {String} name 要缓存的字段名称
     * @param {Object|String} data 要缓存的数据
     */
    setItem(name, data){
        localStorage.setItem(name, escape(JSON.stringify(data)));
    },

    /**
     * 根据字段取出缓存
     * @param {String} name 缓存的字段名称
     */
    getItem(name){
        return JSON.parse(unescape(localStorage.getItem(name)));
    },

    /**
     * 根据字段名称，在缓存的个人信息数据中取出对应数据
     * @param {String} name 需要获取个人信息中的字段名称
     */
    getUserInfo(name){
        let userInfo = this.getItem('OTC_USERINFO');
        if(!name) return userInfo;
        if(userInfo){
            if(name in userInfo){
                return userInfo[name];
            }else{
                return '';
            }
        }else{
            return '';
        }
    },

    /**
     * 更新缓存中数据
     * @param {String} name 需要更新的缓存名称
     * @param {Object | String} data 需要更新的数据
     */
    upDataInfo(name, data){
        let userInfo = this.getItem(name);
        for(let item in data) {
			userInfo[item] = data[item];
        }
        this.setItem(name, userInfo);
    },

    /**
     * 更新缓存中的个人信息的某个字段数据
     * @param {String} name 需要更新的字段名称
     * @param {Object | String} data 需要更新的数据
     */
    upUserInfo(name, data){
        let userInfo = this.getItem('OTC_USERINFO');
        userInfo[name] = data;
        this.setItem('OTC_USERINFO', userInfo);
    },

	/** 获取账户货币存储信息
	 * @param {string} id 需要查询的特征，或是币种ID，或是币种类型
	 */
	getUserAccount(id){ 
		var account = this.getItem('OTC_ACCOUNT');
        var array = [];
        if(!id) return account;
		if(account){
			for(var i = 0; i < account.length; i++){
				if(id.length == '2'){
					if(account[i].get_currency_info.type == id) 
					array.push(account[i]);
				}else{
					if(account[i].currency_id == id) 
					return account[i];
				}
			}
			return array;
		}
    },
   /**
    * 获取系统货币存储信息
    * @param {string} id 需要查询的特征，或是币种ID，或是币种类型
    */
	getObtain: function(id){  
		if(!id || id.length < 1){return false;}
		var account = this.getItem('OTC_CURRENT');
		var array = [];
		if(account){
			for(var i = 0; i < account.length; i++){
				if(id.length == '2'){
					if(account[i].type == id) 
					array.push(account[i]);
				}else{
					if(account[i].id == id) 
					return account[i];
				}
			}
			return array;
		}		
	},
	/**
	* 统一保留币种数量的小数位
	* @param {string} num 需要简化的数字
	* 
	*/		
	setToFixed(num){
		if(!num) return 0.0000;
		return (num - 0).toFixed(4);
	}

}

// 检查相关
const checkRuntime = {

    /**
     * 获取网络环境
     */
    getNet(){
        let nt = plus.networkinfo.getCurrentType();
		switch(nt) {
			case plus.networkinfo.CONNECTION_ETHERNET:
			case plus.networkinfo.CONNECTION_WIFI:
				return 'wifi';
				break;
			case plus.networkinfo.CONNECTION_CELL2G:
			case plus.networkinfo.CONNECTION_CELL3G:
			case plus.networkinfo.CONNECTION_CELL4G:
				return 'network';				
				break;
			default:
				return 'no';
				break;
		}
    },

    /**
     * 检查plus环境
     */
    isPlus(){
        const promise = new Promise((resolve, reject) => {
            if(navigator.userAgent.indexOf("Html5Plus") < 0){ // 不支持5+ API
                console.log('当前环境不支持plus，请用手机访问！');
                // reject();
            }else{                                          // 支持5+ API
                document.addEventListener('plusready',resolve,false);
            }
        });
        return promise;
    },

    /**
     * 获取资源版本号
     * @return promise 对象
     */
    getProperty(){
        const promise = new Promise((resolve, reject) => {
            plus.runtime.getProperty(plus.runtime.appid, (inf) => {
                let v = inf.version.match(/\.([^\.]+)$/)[1];
                if(v.toString().length < 3){
                    v = '000';
                }
                resolve(v);
            })
        })

        return promise;
    }
}

// 窗口相关
const win = {
    /**
     * 获取窗口对象
     * @param {String} viewId 窗口id
     * @return 窗口对象 当无参数时，返回当前窗口对象
     */
    getWebview(viewId){
        if(viewId) return plus.webview.getWebviewById(viewId)
        else return plus.webview.currentWebview();
    },

    /**
     * 创建窗口方法
     * @param {String} url 要加载的页面地址
     * @param {String} id 窗口的ID
     * @param {Object} styles 窗口样式
     * @param {Object} extras 窗口参数
     */
    create(url, id, styles, extras){
        const option = Object.assign({
            render: 'always',
            popGesture: 'hide'
        }, styles);
        return plus.webview.create(url, id, option, extras)
    },

    /**
     * 打开窗口逻辑（传参及回调）
     * @param {String} viewId 窗口ID
     * @param {Object} extras 需要设置的参数
     * @param {Boolean} isReset 是否需要重载
	 * @param {Function} cllback 完成后的回调方法
     */
    openWV(viewId, extras, isReset = false, cb){
        let wv = plus.webview.getWebviewById(viewId);
        if(wv) {
            if(isReset) {   // 由于reload无法实现重载，帮先关闭窗口，再创建。
                wv.close('none');
                this.open(viewId, extras, cb);
			}else {
				plus.webview.show(wv, "pop-in", 300, cb);
			}
        } else {
            this.open(viewId, extras, cb);
        }
    },
    
    /**
     * 打开新窗口
     * @param {String} viewId 窗口ID
     * @param {Object} extras 需要设置的参数 
     * @param {Function} cllback 完成后的回调方法
     */
    open(viewId, extras, cb){
        this.waitToggle(true);
        let w = this.create(viewId, viewId, {}, extras)
        setTimeout(() => {
            plus.webview.show(w, "pop-in", 300, cb);
        }, 300);
        
        w.onloaded = () => {
            this.waitToggle(false);
            this.winRecycling();
        }
    },

    /**
     * 窗口管理，当存在数里大于设定数量后，就消除最先打开的窗口
     */
    winRecycling(){
        const maxWin = 10;           // 最大窗口数量
        const wvs = plus.webview.all();
        const indexs = ['homepage.html', 'transaction.html', 'my_index.html', 'index.html'];        // 排除的不可清除的窗口
        if (wvs.length >= maxWin) {
            let num = wvs.length - maxWin;
            let x = 0;
            for (let i = 0; i < wvs.length; i++) {
                if (wvs[i].id !== plus.runtime.appid && indexs.indexOf(wvs[i].id) == -1) {
                    wvs[i].close('none');
                    x++;
                    if(x >= num) break;
                }
            }
        } 
    },

    /**
     * 关闭多个窗口
     * @param {Array} viewIds 窗口ID集合
     */
    closeWV(viewIds){
        if(Array.isArray(viewIds)){
            for(let i = 0; i < viewIds.length; i++) {
                if(plus.webview.getWebviewById(viewIds[i])) {
                    plus.webview.getWebviewById(viewIds[i]).close();
                }
            }
        }else{
            return false;
        }
    },

    /**
     * 运行非本身窗口里定义的方法
     * @param {String} viewId 窗口ID
     * @param {String | Object | Array} modthods 方法名称及参数组成的json对象或数组对象
     */
    evalID(viewId, modthods){
        let webview = plus.webview.getWebviewById(viewId);
		if(webview) {
            if(Array.isArray(modthods)){    // 如果modthods为数组
                modthods.forEach((item) => {
                    if(item instanceof Object){
                        Object.keys(item).forEach((key) => {
                            if(Array.isArray(item[key])){
                                webview.evalJS(key + '("'+ item[key].join('","') +'")');
                            }else{
                                webview.evalJS(key + '("'+ item[key] +'")');
                            }
                        })
                    }else{
                        webview.evalJS(item + '()');
                    }
                })
            }else if(modthods instanceof Object){       // 如果modthods为Object
                Object.keys(modthods).forEach((key) => {
                    if(Array.isArray(modthods[key])){
                        webview.evalJS(key + '("'+ modthods[key].join('","') +'")');
                    }else{
                        webview.evalJS(key + '("'+ modthods[key] +'")');
                    }
                })
            }else{
                webview.evalJS(modthods + '()');
            }

		}
    },

    /**
     * 打开或关闭等待框
     * @param {Boolean} boole 打开或关闭等待框
     */
    waitToggle(boole){
        if(boole) plus.nativeUI.showWaiting();
        else plus.nativeUI.closeWaiting();
    },

    /**
     * 获取当前窗口ID
     * @param {String} url 窗口地址
     */
    getViewId(url){
        let index = url.toString().lastIndexOf('/');
        let str = url.substr(index + 1);
        if(str && ~str.indexOf('.html')) return str;
        else return '';
    },

    /**
     * 自动消失的弹出框
     * @param {String} msg 消息内容
     * @param {Object} option 参数，同plus API    
     */
    toast(msg, option){
        plus.nativeUI.toast(msg, option)
    }

}

// dom操作
const dom = {
    /**
     * 当前DOM是否包含指定的样式名称
     * @param {HTMLElement} elem dom元素
     * @param {String} cls 样式名称
     */
    hasClass(elem, cls) {
        cls = cls || '';
        if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
        return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
    },
    
    /**
     * 给指定的DOM添加样式
     * @param {HTMLElement} elem dom元素
     * @param {String} cls 样式名称
     */
    addClass(elem, cls) {
        if(!this.hasClass(elem, cls)) {
            elem.className = elem.className == '' ? cls : elem.className + ' ' + cls;
        }
    },
    
    /**
     * 给指定的DOM移除样式
     * @param {HTMLElement} elem dom元素
     * @param {String} cls 样式名称 
     */
    removeClass(elem, cls) {
        if (hasClass(elem, cls)) {
            var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
            while (newClass.indexOf(' ' + cls + ' ') >= 0) {
                newClass = newClass.replace(' ' + cls + ' ', ' ');
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        }
    },

    /**
     * 让当前页所有input失去焦点，解决键盘不能关闭的问题
     */
    blur(){
        const input = document.getElementsByTagName('input');
        for(let i = 0; i < input.length; i++){
            input[i].blur();
        }
    }
}

// 数据处理
const update = {
    /**
     * 给小数位保留4位
     * @param {String || Number} num 要处理的数据
     */
    fixed(num) {
        if (!num) return 0.0000;
        return (num - 0).toFixed(4);
    }
}

export class Toolkit {
    static get checker(){
        return checkRuntime;
    }

    static get win(){
        return win;
    }

    static get storage(){
        return storage;
    }

    static get dom(){
        return dom;
    }

    static get update(){
        return update;
    }
}

export default Toolkit;