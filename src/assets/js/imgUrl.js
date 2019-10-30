/**
 * 打开手机相册或拍照得到一张照片，并返回图片本地地址及base64数据
 * 错误回调信息
 * { code: '41', msg: '拍照图片拉取失败'};
 * { code: '31', msg: '相册图片拉取失败'};
 * { code: '21', msg: '图片处理失败'};
 * 成功回调信息返回两个参数（本地地址，base64数据）
 */
class ImgUrl {
    /**
     * 入口方法 打开对应手机功能
     * option.type值分为 [picture || photo]
     * @param {Object} option 包含（类型[相册/相机]、成功方法、失败方法）
     */
    open(option){
        this.type = option.type;                                    // 功能类型(必要)
        this.onError = option.error || new Function();              // 失败方法(选要)
        this.onSuccess = option.success;                            // 成功方法(必要)

        if(this.type == 'picture'){                                 // 相机
            this.openPicture();
        }else if(this.type == 'photo'){                             // 相册
            this.openPhoto();
        }
    }

    /**
     * 打开相机功能
     */
    openPicture(){
        const cmr = plus.camera.getCamera(); // 相机对象
        cmr.captureImage((p) => { // 拍照事件
                this.fileUrl(p);
            }, (error) => {
                this.onError(error, '41');
                console.log("---" + "捕获图像失败: " + error.message);
            }, {} //建议使用系统匹配路径
        );
    }

    /**
     * 打开相册功能
     */
    openPhoto(){
        plus.gallery.pick((p) => {
            this.fileUrl(p);	
        }, (error) => {
            this.onError(error, '31');
            console.log("---" + "捕获图像失败: " + error.message);
        })
    }

    /**
     * 用文件路径转换成文件对象
     * @param {String} p 文件路径
     */
    fileUrl(p){
        var that = this;
        plus.io.resolveLocalFileSystemURL(p, function(entry){
            entry.file(function(e){
                that.rotateImg(e);	
            })
        });
    }

    /**
     * 为做兼容，需要对图片进行旋转处理
     * @param {Object} e 转换后的文件对象
     */
    rotateImg(e){
        const p = e.fullPath;
        plus.zip.compressImage({
            src: p,
            dst: '_doc/' + e.name + '.jpg',
            overwrite: true,
            rotate: 0 // 不管有没有被旋转，统一旋转0度
        }, (event) => {
            if(plus.os.name == 'iOS'){ // 此处IOS需做路径转换处理，在转换时利用文件对象再去转base64，而安卓则直接可以用路径去加载文件
                this.getBase64(e);	
            } else{
                this.getBase64(p);
            }
        }, (error) => {
            this.onError(error, '21');
            console.log("图片旋转时发生错误!");
        });
    }

    /**
     * 根据图片地址加载图片后得到base64数据
     * @param {Object} e 文件路径 or 文件对象
     */
    getBase64(e){
        const reader = new plus.io.FileReader(); 			// 构建文件对象
        reader.readAsDataURL(e);						// 添加文件（此处安卓可以直接添加文件路径，而IOS则需要文件对象）
        reader.onloadend = (event) => {			// 文件加载 完成后的事件回调
            this.onSuccess(event.target.fileName, event.target.result); 	// 执行成功函数，统一把路径及base64传过去
        };
    }
}

export { ImgUrl };
export default ImgUrl;