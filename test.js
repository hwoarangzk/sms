var request = require('superagent'),
	sha256 = require('sha256');

var url = 'https://yun.tim.qq.com/v5/tlssmssvr/sendsms?sdkappid={sdkappid}&random={random}';

function getRand(bit) {

	bit = bit || 10000000;

	return Math.round(Math.random() * bit);
}


function send(sdkappid, appkey, phone, msg) {

	if (!phone || /1\d{12}/.test(phone)) {
		return console.log('invalid phone number');
	}

	var rand = getRand(),
		time = Math.round(+new Date() / 1000),
		sig = sha256('appkey=' + appkey + '&random=' + rand + '&time=' + time + '&mobile=' + phone);

	var content = {
		    "tel": { //如需使用国际电话号码通用格式，如："+8613788888888" ，请使用sendisms接口见下注
		        "nationcode": "86", //国家码
		        "mobile": phone //手机号码
		    }, 
		    "type": 0, //0:普通短信;1:营销短信（强调：要按需填值，不然会影响到业务的正常使用）
		    "msg": msg, //utf8编码 
		    "sig": sig, //app凭证，具体计算方式见下注
		    "time": time, //unix时间戳，请求发起时间，如果和系统时间相差超过10分钟则会返回失败
		    "extend": "", //通道扩展码，可选字段，默认没有开通(需要填空)。
		     //在短信回复场景中，腾讯server会原样返回，开发者可依此区分是哪种类型的回复
		    "ext": "" //用户的session内容，腾讯server回包中会原样返回，可选字段，不需要就填空。
		};
	url = url.replace('{sdkappid}', sdkappid)
			.replace('{random}', rand);

	request
		.post(url)
		.send(content)
		.end(function(err, res) {
			if (err) {
				return console.log('send message failed');
			}
			console.log('message sent successfully');
		});
}

module.exports = send;