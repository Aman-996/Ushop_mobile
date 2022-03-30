const checktoken = async (_this) => {
	/*
					1.判断缓存信息中有没有userinfo
						  有--------判断登录有效期token
								 有效----设置tab文字为我的
								 失效----设置tab文字为未登录
						  没有----设置tab文字为"未登录"
				*/
	let userInfo = uni.getStorageSync("userInfo") || null
	if (userInfo == null) { //未登录
		uni.setTabBarItem({
			index: 3,
			text: "未登录"
		})
		return false
	} else { //已经登录
		let options = {
			url: "/api/checktoken",
			header: {
				authorization: userInfo.token
			}
		}

		let result = await _this.$http(options)
		console.log(result)
		if (result.data.code == 200) { //登录有效
			uni.setTabBarItem({
				index: 3,
				text: "我的"
			})

			return true
		} else { //登录失效
			uni.setTabBarItem({
				index: 3,
				text: "未登录"
			})
			// 清除缓存信息
			uni.removeStorageSync("userInfo")
			uni.removeStorageSync("phone")
			return false
		}
	}
}
export default checktoken
