import qs from 'qs'
import md5 from 'md5'
import apis from './apis'
import { Indicator } from 'mint-ui'
import conf from '../assets/js/web.config'
import Toolkit from '../assets/js/toolkit';
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

const fetchAjax = (url = '', data = {}) => {
    let o = dataScreen(data, []);                         // 发送前对参数进行处理
    o.sign = md5(getObjSort(o));                            // 进行md5加密
    // url = conf.DLT_HOST + url;
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "include", // include, *same-origin, omit
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(o), // body data type must match "Content-Type" header
    })
    .then(response => {
        if(response.ok){
            return response.json();
        }else{
            console.log(JSON.stringify(response))
        }
    })
    .then(data => {
        console.log('data is', data)
    })
    .catch(error => {
        console.log('error is', error)
    });
}
export default fetchAjax


// 用例
// Fajax(`/trade/index/getUserAccount`, {
//     username: Toolkit.storage.getUserInfo('username'),
//     token: Toolkit.storage.getUserInfo('token'),
// })
// .then(data => console.log(JSON.stringify(data))) 
// .catch(error => console.error(error));