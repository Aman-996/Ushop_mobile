var express = require('express');
var router = express.Router();
const tableName = 'user_sign'
const tableNames = 'user_sign_log'
const { Success, MError } = require("../utils/Result");
const Db = require("../utils/Db");
const {getDate} = require("../utils/index");


//添加会员签到信息
router.post("/signadd", async (req, res) => {
	
    let {uid} = req['body'];
	if (!uid) {
	    res.send(MError("缺少必要字段"));return;
    }else{
		// 首先根据用户uid判断今日是否签过到
		let nowData = await Db.select(req, `SELECT * FROM  ${tableNames} where uid = '${uid}' order by add_time desc limit 1`);//签到日志表
		let signData = await Db.select(req, `SELECT * FROM  ${tableName} where uid = '${uid}'`);//签到主表
		let add_time = new Date().getTime();//当前时间毫秒
		if(nowData == null){
			//新增签到日志表
			let signLogs = {uid,add_time};
			let resultLogs = await Db.insert(req, tableNames, signLogs);
			//新增签到主表
			let sign = {uid,days:1,count_days:1,score:1,last_sign_time:add_time};
			let result = await Db.insert(req, tableName,sign);
			res.send(Success([],'签到成功!'));
		}else{
			//如果有记录再次判读是否是今天的记录
			let nowDate = getDate(new Date()).fullDate;//今日时间 年月日（如：2021-02-03）
			let oldSign = getDate(parseInt(nowData[0].add_time)).fullDate; //最近一次签到时间
			if(nowDate == oldSign){
				console.log('今日已经签到')
				// 如果日期相等说明已经签到
				res.send(Success([],'今日已经签到！'))
			}else{
				let oldDate = getDate(new Date(), -1).fullDate //在当前时间上减去一天 获取昨日时间
				let updateData = {days:signData[0].days+1,score:signData[0].score+1,count_days:signData[0].count_days+1,last_sign_time:add_time};//初始化修改数据
				if(oldDate != oldSign){
					// 如果昨日没有签到记录就只修改累计天数和最后签到时间  将连续签到天数重置为1 不累计积分
					updateData.days = 1;
					delete(updateData.score);
				}
				// console.log(updateData);return;
				let signLogs = {uid,add_time};
				let resultLogs = await Db.insert(req, tableNames, signLogs);
				const resultSign = await Db.update(req, tableName, updateData, `where uid = '${uid}'`);
				console.log(resultLogs,resultSign);
				let msg = updateData.days == 1 ? '今日签到成功!' : `您已连续签到${updateData.days}天，积分+1`
				res.send(Success([],msg))
			}
		}
	}
})

// 查询当前用户签到信息
router.get('/getsign', async (req, res) => {
    // 获取uid
    let {uid} = req['query'];
    if (!uid) {
        res.send(MError("缺少必要条件"));
        return;
    }else{
		// 查询该用户最近10条签到记录
		let signData = await Db.select(req, `SELECT id,uid,add_time FROM  ${tableNames} where uid = '${uid}' order by add_time desc limit 10`);//签到日志表
		res.send(Success(signData,'获取成功'))
	}
  
})


module.exports = router;