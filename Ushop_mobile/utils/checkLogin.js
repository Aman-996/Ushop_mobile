/*
检测token
1.app.vue初始化登录状态，初始化用户信息
2.onLanuch检测登录状态
3.动态设置tab文本（我的/未登录）
4.个人中心通过登录状态，显示用户信息
*/
const checkLogin = async (_this) => {
	let userInfo = uni.getStorageSync('userInfo');
	
	// 未登录
	if(userInfo == null) {
		uni.setTabBarItem({
			index:3,
			text:'未登录'
		})
		return false
	} else {
		// 登录成功
		let info = {
			url:'/api/checktoken',
			header: {
				authorization:userInfo.token
			}
		}
		let result = await _this.$http(info)
		if(result.data.code === 200) {
			uni.setTabBarItem({
				index:3,
				text:'个人中心'
			})
			return true
		} else {
			uni.setTabBarItem({
				index:3,
				text:'未登录'
			})
			uni.removeStorageSync('userInfo')
			uni.removeStorageSync('phone')
			return false
		}
	}
}


export default checkLogin
