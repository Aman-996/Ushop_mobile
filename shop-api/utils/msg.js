const schedule = require('node-schedule');//定时任务模块

// 定义发送消息方法
const pushMsg = async(info)=>{
	var http = require('http');
	var appkey = 'BC-aa0cb5ea03fd44aa9937f15b65b6c8d3';
	var channel = 'nodechannel';
	var content = info || 'Hello, 我是你的接口!';
	var queryParams = 'appkey=' + appkey + '&channel=' + channel + '&content=' + content;

	var options = {
		hostname: 'rest-hangzhou.goeasy.io',
		path: '/publish',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	};

	var req = http.request(options, (res) => {
		res.setEncoding('utf8');
		res.on('data', (result) => {
			console.log(`响应结果: ${result}`);
		});
		
	});

	req.on('error', (e) => {
		console.error('错误',e);
	});

	req.write(queryParams);
	req.end();
}


/**
 * 定时任务
 *  *  *  *  *  *  *
 *  秒(0 - 59, OPTIONAL)  分(0 - 59)  时(0 - 23)  日(1 - 31)  月(1 - 12)  周(0 - 7)
 */ 
const scheduleCronstyle=(info)=>{
    //每分钟的第30秒定时执行一次: 每周1的1点1分30秒触发
    schedule.scheduleJob('30 1 1 * * 1',()=>{
		// 定时从数据库中获取最新消息推送到goEasy
		pushMsg(info);console.log('触发任务')
    });
}


// 导出
module.exports = {
	pushMsg,
	scheduleCronstyle
}