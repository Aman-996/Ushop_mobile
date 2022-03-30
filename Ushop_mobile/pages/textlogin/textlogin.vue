<template>
	<view class="login_box">
		<u-top-tips ref="uTips"></u-top-tips>
		<view class="text_login">
			<!-- logo -->
			<image class="login_logo" src="../../static/logo/orange.png" alt="" />

			<!-- 表单区域 -->
			<view class="login_phone">
				<text>手机号</text>
				<input type="text" maxlength="11" v-model="phone" />
			</view>
			<view class="login_code">
				<text>验证码</text>
				<input type="text" maxlength="4" v-model="code" />
				<view hover-class="touchOpacity" @click="getCode">{{msg}}</view>
			</view>

			<!-- 登录按钮 -->
			<view class="login_but" hover-class="touchOpacity" @click="login">
				<text space="ensp">登 录</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: null, //手机号
				code: null, //验证码
				msg:'获取验证码',
				isGetCode:false,//值为真时，代表正在进行倒计时
				
			}
		},
		methods: {
			// 点击获取验证码
			async getCode() {
				let phone = this.phone
				let regExp = /^1[3-9][0-9]{9}$/ //验证手机号格式
				if (!regExp.test(this.phone)) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					})
					return
				}
				
				// 验证是否正在进行倒计时
				if(this.isGetCode) {
					uni.showToast({
						title:'请勿重复获取！',
						icon:'none'
					})
					return
				}
				
				this.isGetCode = true
				
				// 获取验证码
				let info = {
					url:'/api/sms',
					data:{
						phone:this.phone
					}
				}
				let result = await this.$http(info)
				if(result.data.code === 200) {
					// 将手机号与验证码存入缓存中
					uni.setStorageSync('userInfo_phone',phone)
					uni.setStorageSync('userInfo_code',result.data.list.code)
					// 验证码弹框
					this.$refs.uTips.show({
									title: '验证码为' + result.data.list.code,
									type: 'success',
									duration: '3000'
								})
					// 验证码按钮状态
					let num = 6
					let time = setInterval(() => {
						num --
						this.msg = num + '秒后重新获取验证码'
						if(num < 1) {
							clearInterval(time)
							this.msg = '重新获取验证码'
							num = 6
							this.isGetCode = false
						}
					},1000)
				} else { //404
					uni.showToast({
						title:'网络开小差啦！',
						icon:'none'
					})
				}
				
			},
			
			// 点击登录
			async login() {
				let phone = this.phone
				let code = this.code
				// 获取缓存中的手机号与验证码
				let storagePhone = uni.getStorageSync("userInfo_phone")
				let storageCode = uni.getStorageSync("userInfo_code")
				
				// 验证手机号
				if(phone == null || storagePhone == null || phone != storagePhone) {
					uni.showToast({
						title:'请输入正确的手机号',
						icon:'none'
					})
					return
				}
				
				// 验证验证码
				if(code == null || storageCode == null || code != storageCode) {
					uni.showToast({
						title:'请输入正确的验证码',
						icon:'none'
					})
					return
				}
				let info = {
					url: '/api/smslogin',
					data: {
						phone: phone
					},
					method:'POST'
				}
				let result = await this.$http(info)
				if(result.data.code === 200) {
					uni.showToast({
						title:result.data.msg
					})
					uni.setStorageSync('userInfo',result.data.list)
				} 
				setTimeout(()=> {
					uni.switchTab({
						url:'../index/index'
					})
				},2000)
			}
		}
	}
</script>

<style>
	/* 引入样式 */
	@import url("@/static/css/textlogin.css");
</style>
