import axios from 'axios'
import qs from 'qs'
import md5 from 'md5'
import apis from './apis'
import conf from '../assets/js/web.config'
import Toolkit from '../assets/js/toolkit';

// 发送请求前的动作
axios.interceptors.request.use(config => { 
    // 可以显示loading 
    Toolkit.win.waitToggle(true); 
    return config  
}, error => {  
    return Promise.reject(error)  
})

// 接收响应前的动作
axios.interceptors.response.use(response => {  
    // 可以清除loading 
    Toolkit.win.waitToggle(false); 
    return response  
}, error => {  
    return Promise.resolve(error)  
})

/**
 * 过滤不需要加密的字段
 * @param {Object} data 请求的传送数据
 * @param {Array} body 不需要加密传送的字段名称
 * return 数据对象
 */
function dataScreen(data, body){
    let obj = {};
    let o = {};
    for(let item in data){
        if(~body.indexOf(item)){
            o[item] = data[item];
        }else{
            obj[item] = data[item];
        }
    }
    return obj;
}

/**
 * 对Object按字段名排序
 * @param {Object} obj 排序的数据源
 * return 拼接好的字符串
 */
function getObjSort(obj) {
    let storage = Toolkit.storage;
    let keys = Object.keys(obj).sort();
    if(arguments.length <= 0) return false;
    let str = '';
    for(let i = 0; i < keys.length; i++) {
        str += obj[keys[i]];
    }
    return ((obj.username || '') + storage.getUserInfo('token') + str);
}

/**
 * Ajax 请求
 * @param {Object} opts 请求的配置参数 
 * @param {Object} data 请求的传送数据
 * @param {Array} body 不需要加密传送的字段名称
 * @param {String} describe 接口描述
 * return Ajax promise
 */
const axiosAjax = (opts, data, body = []) => {
    // let o = dataScreen(data, body);                         // 发送前对参数进行处理
    // o.sign = md5(getObjSort(o));                            // 进行md5加密
    let o = dataScreen(data, []);                         // 发送前对参数进行处理
    o.sign = md5(getObjSort(dataScreen(data, body)));                            // 进行md5加密
	console.log(opts.text + "[后台]——" + JSON.stringify(o));

    // axios.defaults.withCredentials = true;                  //让ajax携带cookie

    let publicOpts = {                                      // 传给后台的公共参数
        // username: '1234567890'
    }

    let headers = {}
    // headers.sign = sign;

    let defaultOpts = {                                     // 请求的配置
        url: opts.url,                                      // 请求的url
        method: opts.method,                                // 请求的类型
        baseURL: process.env.NODE_ENV == 'development' ? '' : conf.DLT_HOST,                             // 请求的前缀
        timeout: 10000,                                     // 超时的时间
        headers: Object.assign(headers, apis.HEADERS),
        params: Object.assign(publicOpts, o),             // get请求的参数序列
        data: qs.stringify(Object.assign(publicOpts, o)), // post请求的参数序列
    }

    if(opts.method=='get') delete defaultOpts.data;   
    else delete defaultOpts.params;

    let promise = new Promise((resolve, reject) => {
        // 发起请求
        axios(defaultOpts).then(
            (res) => {
                let d = res.data;
                if (d.msg == 1) {  
                    resolve(d);
                }else if(d.msg == 3){
                    Toolkit.win.openWV('login.html');
                }else{
                    reject(d);
                }
                console.log(opts.text + "——" + JSON.stringify(res.data))
            }
        ).catch(
            (error) => {
								console.log('errpr' + error);
                Toolkit.win.waitToggle(false);
                reject(error);
            }
        )
    })
      
    return promise;
}

export default axiosAjax;