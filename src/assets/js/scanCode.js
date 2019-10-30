/**
 * 扫描/生成二维码
 */
import QRCode from 'qrcode'

const sc = {
    /**
     * 开启扫一扫控件
     * @param {String} id Dom id
     * @param {Function} cb 扫描成功后的回调
     * @param {Array} filter 扫描类型的过滤
     * @param {Object} styles 扫描框的样式
     * @return {Object} 扫描控件对象
     */
    scan(id, cb, filter = [], styles){
        const style = Object.assign({
            frameColor: "#da5454",              // 扫描框颜色
            scanbarColor: "#da5454",            // 扫描条颜色
            background: "#000"                  // 条码识别空背景颜色
        }, styles)
        try {
            if(brcode) return brcode;
        } catch (error) {
            const brcode =  new plus.barcode.Barcode(id, filter, style);
            brcode.onmarked = (type, result) => {
                const res = result.replace(/[\n\"]/g, '');
                cb(res);
            }
            brcode.start({conserve:true, filename:"_doc/barcode/"});
            return brcode;
        }
    },

    /**
     * 生成二维码
     * @param {String} str 要生成的二维码内容
     * @param {Function} cb 生成后的回调
     * @return {String} 生成后的图片url
     */
    qrcode(str, cb){
        QRCode.toDataURL(str)
        .then(url => {
            cb(url);
        })
        .catch(err => {
            console.log(err);
        })
    }
}

export default sc;