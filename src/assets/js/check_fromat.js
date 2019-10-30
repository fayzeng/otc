export default {
	/**
	 * 验证类
	 * @param {String} b 需要验证的字符串
	 */
	isEmail: function(b){
		var a =  /^\w+(\.)?\w+@\w+(\.\w+)+$/;
		return a.test(b)
	},
	
	//验证手机号码
	isPhone: function(b) {
		var a = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
		return a.test(b)
	},
	
	//验证身份证
	isIdentity: function(b) {
		//var a = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
		var a = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
		return a.test(b)
	},
	
	//验证汉子字符
	isCharacter: function(b) {
		var a = /^[\u4E00-\u9FA5]+$/;
		return a.test(b)
	},
	
	//验证银行卡号
	isBank: function(b) {
		var a = /^\d{15}|\d{16}|\d{19}$/;
		return a.test(b)
	},
	
	//验证密码
	isPassword: function(b){
		var a = /^\S{6,}$/;
		return a.test(b)
	},
	
	//验证交易密码
	istradePass: function(b){
		var a = /^\d{6}$/;
		return a.test(b)
	},
	//验证金额
	ismoney: function(b){
		var a = /^\d+(\.\d{1,2})?$/;
		if(!a.test(b)) {
			return false
		} else {
			return true
		}
	},
}