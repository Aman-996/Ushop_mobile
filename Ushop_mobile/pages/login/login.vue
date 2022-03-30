<template>
	<view class="box">
		<!-- logo -->
		<view class="login_title">
			欢迎登录小U商城
		</view>
		<image class="login_logo"  src="../../static/logo/orange.png" alt="" />
		<button class="login_but" hover-class="touchOpacity" open-type="getPhoneNumber" @getphonenumber="toWXLogin">
			微信用户一键登录
		</button>
		<view  class="login_text" hover-class="touchOpacity" @click="toTextLogin">手机号验证注册/登录</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
			}
		},
		onLoad() {},
		methods: {
			// 进入手机登录页面(短信登录)
			toTextLogin(){
				uni.navigateTo({
					url:'../textlogin/textlogin'
				})
			},
			// 使用微信一键登录
			toWXLogin(e) {
				// #ifdef MP-WEIXIN
				wx.login({
					success:async (res) => {
						let info = {
							url:'/api/wxlogin',
							data:{
								code:res.code,
								iv:e.detail.iv,
								encryptedData:e.detail.encryptedData,
							},
							method:'POST'
						}
						let result = await this.$http(info)
						console.log(result)
						if(result.data.code == 200) {
							uni.setStorageSync('userInfo',result.data.list)
							uni.showToast({
								title:result.data.msg
							})
							setTimeout(()=>{
								uni.switchTab({
									url:'../index/index'
								})
							},2000)
						} else {
							uni.showToast({
								title:result.data.msg,
								icon:'error'
							})
						}
					}
					
				})
				// #endif 
			}
		}
	}
</script>

<style>
	/* 导入外部的样式文件 */
	@import url("@/static/css/login.css");
</style>
