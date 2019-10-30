/**
 * 整站API配置文档
 */
const apis = {
    HEADERS: {},
	getVersion: {
		url: '/index/System/getVersion',
		method: 'post',
		text: '版本'
	},
    text: {
        url: '/index/index/text',
        method: 'post'
    },
    login: {
        url: '/index/index/login',  
        method: 'post',
		text: '登录接口'
    },
    country: {
        url: '/index/index/getPhonePrefix', 
        method: 'post',
		text: '获取国家及区号'
    },
    sendCode: {
        url: '/index/index/sendCode',  
        method: 'post',
		text: '发送验证码'
    },
    validateSendCode: {
        url: '/index/index/validateSendCode',  
        method: 'post',
		text: '检查验证码和电话号码是否匹配'
    },
    sendMailCode: {
        url: '/index/index/sendMailCode',
        method: 'post',
		text: '获取邮箱注册验证码'
    },
    validateSendMailCode: { 
        url: '/index/index/validateSendMailCode',  
        method: 'post',
		text: '检查验证码和邮箱是否匹配'
    },
    forgetLoginPass: {
        url: '/index/index/forgetLoginPass',  
        method: 'post',
		text: '忘记登录密码'
    },
    registerpass: {
        url: '/index/index/register',  
        method: 'post',
		text: '注册密码'
    },
    getUserAccount: {
        url: '/trade/index/getUserAccount',  
        method: 'post',
		text: '首页获取用户账户信息'
    },
    getCurrencyList: {
        url: '/trade/index/getCurrencyList',  
        method: 'post',
		text: '首页获取系统可用币种'
	},
	uploadIDCard: {
		url: '/index/Idcard/uploadIDCard',
		method: 'post',
		text: '提交实名认证信息'
	},
	cash: {
        url: '/index/user/withdrawCash',  
        method: 'post',
		text: '提现'
    },
	getUserBankList: {
		url: '/index/user/getUserBankList',  
		method: 'post',
		text: '获取提现通道'
	},
	withdrawCash: {
		url: '/trade/index/withdrawCash',  
		method: 'post',
		text: '提币'
	},
	getTradeFee: {
		url: '/trade/index/getTradeFee',  
		method: 'post',
		text: '获取提币汇率'
	},
	recharge: {
        url: '/trade/Rechargewithdraw/recharge',  
        method: 'post',
		text: '充值'
    },
	rechargegetChannel: {
        url: '/trade/Rechargewithdraw/Index',  
        method: 'post',
		text: '充值通道接口'
    },
	getCurrencyTradeList: {
		url: '/trade/index/getCurrencyTradeList',  
		method: 'post',
		text: '获取币种交易详情'
	},
	deliveryGoods: {
        url: '/trade/exchange/deliveryGoods',  
        method: 'post',
		text: '确认发货'
    },
	takeDeliveryGoods: {
		url: '/trade/exchange/takeDeliveryGoods',  
		method: 'post',
		text: '确认收货'
	},
	rechargeForeignCurrency: {
		url: '/trade/rechargewithdraw/rechargeForeignCurrency',  
		method: 'post',
		text: '登记接口'
	},
    getAuthStatus: {                     
        url:'/index/idcard/getAuthStatus',
        method: 'post',
		text: '获取实名认证审核状态'
    },
    saveUserInfo:{                       
        url: '/index/user/saveUserInfo',
        method: 'post',
		text: '修改个人信息'
    },
	getBankInfo:{                       
	    url: '/trade/index/getBankInfo',
	    method: 'post',
		text: '获取银行卡号所属银行'
	},
	putUserReceiveInfo:{                       
	    url: '/index/user/putUserReceiveInfo',
	    method: 'post',
		text: '添加用户收款信息'
	},
	getUserReceiveInfo:{                       
	    url: '/trade/index/getUserReceiveInfo',
	    method: 'post',
		text: '获取用户收款信息'
	},
    delTradeAddress:{                       
        url: '/index/currency/delTradeAddress',
        method: 'post',
		text: '删除外来币种'
    },
    getAllTradeAddress:{                       
        url: '/index/currency/getAllTradeAddress',
        method: 'post',
		text: '获取外来币种地址'
    },
    openNewCurrency:{                       
        url: '/index/currency/openNewCurrency',
        method: 'post',
		text: '新增外来币种账户'
    },
    updateTradeAddress:{                       
        url: '/index/currency/updateTradeAddress',
        method: 'post',
		text: '修改外来币种账户'
    },
    setPayPass:{                       
        url: '/index/user/setPayPass',
        method: 'post',
		text: '设置支付密码'
    },
    saveLoginPass:{                       
        url: '/index/user/saveLoginPass',
        method: 'post',
		text: '修改登录密码'
    },
    savePayPass:{                       
        url: '/index/user/savePayPass',
        method: 'post',
		text: '修改支付密码'
    },
    getVersionIntro:{                       
        url: '/index/System/getVersionIntro',
        method: 'post',
		text: '版本说明'
    },
    getBusinessInfo:{                       
        url: '/index/agent/getBusinessInfo',
        method: 'post',
		text: '获取代理商信息'
    },
	sendCodeEmail:{                       
		url: '/index/index/sendCodeEmail',
		method: 'post',
		text: '邮箱获取忘记支付密码验证码'
	},
	validateSendCode:{                       
		url: '/index/index/validateSendCode',
		method: 'post',
		text: '检查验证码和电话号码是否匹配'
	},
	validateSendMailCode:{                       
		url: '/index/index/validateSendMailCode',
		method: 'post',
		text: '检查验证码和邮箱是否匹配'
	},
	forgetPayPass:{                    
		url: '/index/user/forgetPayPass',
		method: 'post',
		text: '找回支付密码'
	},
	getLastExchangeRecord:{                       
		url: '/trade/exchange/getLastExchangeRecord',
		method: 'post',
		text: '消息快讯'
	},
	getBtcUsdt:{                      
		url: '/trade/index/getBtcUsdt',
		method: 'post',
		text: 'BTC信息'
	},
	getLastPriceAndVolume:{                      
		url: '/trade/index/getLastPriceAndVolume',
		method: 'post',
		text: '币种成交信息'
	}, 
	getAd:{                    
		url: '/index/System/getAd',
		method: 'post',
		text: '轮播图'
	},
	getMyExchangeList:{                     
		url: '/trade/exchange/getMyExchangeList',
		method: 'post',
		text: '卖出记录'
	},
	getPurchaseRecord:{                     
		url: '/trade/exchange/getPurchaseRecord',
		method: 'post',
		text: '买入记录'
	},
	getExchangeDetailInfo:{                     
		url: '/trade/exchange/getExchangeDetailInfo',
		method: 'post',
		text: '上架详情'
	},
	offLoading:{                    
		url: '/trade/exchange/offLoading',
		method: 'post',
		text: '下架'
	},
	getExchangeList:{                    
		url: '/trade/exchange/getExchangeList',
		method: 'post',
		text: '交易所列表'
	},
	putOnShelves:{                    
		url: '/trade/exchange/putOnShelves',
		method: 'post',
		text: '上架'
	},
	prePurchase:{                    
		url: '/trade/exchange/prePurchase',
		method: 'post',
		text: '购买预下单'
	},
	cancelTrade:{                    
		url: '/trade/index/cancelTrade',
		method: 'post',
		text: '取消订单'
	},
	purchase:{                    
		url: '/trade/exchange/purchase',
		method: 'post',
		text: '购买'
	},
	prePay:{                    
		url: '/trade/scan/prePay',
		method: 'post',
		text: '扫码下单'
	},
	pays:{                    
		url: '/trade/scan/pay',
		method: 'post',
		text: '扫码支付'
	},
	changeAutoPutExchange:{
		url: '/index/con_ex_merchant/changeAutoPutExchange',
		method: 'post',
		text: '改变自动上架开关'
	},
	getExchangeCurrencyPrice:{
		url: '/trade/exchange/getExchangeCurrencyPrice',
		method: 'post',
		text: '获取币种上架单价'
	},
	tradeTypeDetail:{
		url: '/tradeTypeDetail.json',
		method: 'get',
		text: '获取交易类型匹配JSON'
	},
	getUserInfoByUsername:{
		url: '/index/index/getUserInfoByUsername',
		method: 'post',
		text: '获取转账接收方信息'
	},
	appeal:{
		url: '/trade/index/appeal',
		method: 'post',
		text: '用户申诉'
	},
	remindSellerToDelivery:{
		url: '/trade/index/remindSellerToDelivery',
		method: 'post',
		text: '提醒卖家发货'
	},
	getTradeList:{
		url: '/trade/index/getTradeList',
		method: 'post',
		text: '获取交易记录'
	}   
}

export default apis;