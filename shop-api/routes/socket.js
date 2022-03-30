var express = require('express');
var router = express.Router();
const tableName = 'address'
const { Success, MError } = require("../utils/Result");
const Db = require("../utils/Db");



//发送消息 
router.get("/getMessage", async (req, res) => {
    
	  var appkey = 'Your appkey';
	  var channel = 'my_channel';
	  var content = 'Hello, GoEasy!';
	
	  var queryParams = 'appkey='+appkey+'&channel='+channel+'&content='+content;
	
	  var options = {
	    hostname: '<REST Host>',
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
	    console.error(e);
	  });
	
	  req.write(queryParams);
	  req.end();

	// res.send(Success([], "地址添加成功"))
	// res.send(MError("添加失败，请查看字段信息是否正确"));

    
});




module.exports = router;