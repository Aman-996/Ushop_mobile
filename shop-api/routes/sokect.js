// let socketio = {}

// function getSocket(server) {
// 	socketio.io = require('socket.io')(server);
// 	let io = socketio.io;
// 	var db = require("../db"); //引入数据库封装模块
// 	io.on('connection', function(socket) {

// 		//此处的socket是当前某个浏览器与服务器的连接对象
// 		//当新的用户连接进来时，向所有人广播ID   sockets 向所有人
		
// 		//发送数据
// 		socket.emit('news', {
// 			hello: 'world'
// 		});
// 		socket.emit('connect', {
// 			msg: '连接成功'
// 		});
// 		//接受数据
// 		socket.on('my other event', function(data) {
// 			console.log(socket.id)
// 			console.log(data);
// 			socket.emit('hello',{content:"第一条"})
// 		})

// 		//类似于登录
// 		socket.on('chooseUser', function(data) {
// 			console.log(data)
// 			socket.join('room')
// 			let id = data.index.id;
// 			let name = data.index.username;
// 			db.query("update user set isonline = 1, socketid= '"+socket.id+"' where id="+ id,[],function(results,fields){
// 				let result = {status: 200, msg :"登录成功，socketId已保存，登录状态变更",socketid: socket.id}
// 				socket.emit('login',result);
// 				io.sockets.emit('addUser',{
// 					id:id,
// 					socketid : socket.id,
// 					content:id+"号玩家"+name+"进来了"
// 				})
// 			  })
			  
// 		})
// 		//退出
// 		socket.on('logout', function(data) {
// 			socket.leave('room')
// 			let id = data.id.id;
// 			let name = data.id.username;
// 			db.query("update user set isonline = 2, socketid= '' where id="+ id,[],function(results,fields){
// 				let result = {status: 200, msg :"退出成功，socketId已清除，登录状态变更" }
// 				socket.emit('logout',result);
// 				io.sockets.emit('leaveRoom',{
// 					id:id,
// 					content:id+"号玩家"+name+"离开了"
// 				})
// 			  })
// 		})
		
// 		//向某个用户发送消息
// 		socket.on('sendUser',function(data){
// 			// data = {
// 			// 	from:"发送者ID",
// 			// 	to:"收到者ID",
// 			// 	content:"内容"
// 			// }
// 			socket.to(data.to).emit('sendClient',data)
// 		})
		
// 		// join/leave加入和离开房间
// 		socket.on('addRoom',function(data){
// 			let room = socket.join(data.room)
// 		})
// 		//监听群聊事件且广播给所有人
// 		socket.on('sendMsgRoom',function(data){
// 			console.log(data)
// 			if(data.to != ""){
// 				socket.to(data.to).emit('danliao',data)
// 			}else{
// 				socket.to(data.room).emit('qunliao',data.content)
// 			}
// 		})
// 	});
// 	// let qq = io.of('/qq');
// 	// qq.on('connection',function(socket){
// 	// 	socket.emit('news',{content:"qq命名空间发送的内容"});
// 	// })
// 	// let wx = io.of('/wx');
// 	// wx.on('connection',function(socket){
// 	// 	socket.emit('news',{content:"wx命名空间发送的内容"});
// 	// })
// }
// // getSocket();
// socketio.getSocket = getSocket;
// module.exports = socketio