// 更新工具
const updateVersion = {
    ios(isStore){
        // TODO 待完善
        
    },

    /**
     * 安卓更新
     * @param {Boolean} d.isUpdate 是否强制更新
     * @param {String} d.intro 版本文本信息
     * @param {String} d.version 版本号
     * @param {String} d.url 下载地址
     */
    android(d){
        if(d.isUpdate == 1){ 
            plus.nativeUI.confirm(d.version + '\n' + d.intro,
            i => {
                if(0 == i.index) {
                    plus.runtime.openURL(d.url);
                }
            }, '独龙OTC新版本 ' + d.version, ["立即更新"]);
        }else{
            plus.nativeUI.confirm(d.version + '\n' + d.intro,
            i => { 
                if(0 == i.index) {
                    plus.runtime.openURL(d.url);
                }
            }, '独龙OTC新版本 ' + d.version, ["立即更新", '取消']);
        }
    }
}

const updateResources = {
    downFile(url, onStateChanged){
        const dtask = plus.downloader.createDownload(url);
        dtask.addEventListener( "statechanged", onStateChanged, false );
        dtask.start(); 
        return dtask; 
    },

    installFile(path){
        return new Promise((resolve, reject) => {
            plus.runtime.install(path, {},
                (widgetInfo) => {
                    resolve(widgetInfo);
                },
                (error) => {
                    console.log("安装版本失败[" + error.code + "]：" + error.message);
                    reject(error);
                })
        })
    }
}

const tools = {
    convers(int = 0){
        if(int >= 2048) return (int/1024/1024).toFixed(2) + 'MB';
        else if(int >= 1024) return (int/1024).toFixed(2) + 'KB';
        else return int + 'B'
    },

    networkSpeed(){

    }
}

export class Update {
    static get UVersion(){
        return updateVersion;
    }

    static get UResources(){
        return updateResources
    }

    static get Tools(){
        return tools;
    }
}

export default Update;
