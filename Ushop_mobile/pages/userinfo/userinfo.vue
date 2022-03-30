<template>
	<view class="wrap">
		<form @submit="submit">
			<view class="top">
				<view class="item">
					<view class="left">会员昵称</view>
					<input type="text" placeholder-class="line" placeholder="请填写会员昵称" name="nickname"
						v-model="nickname" />
				</view>
				<view class="item">
					<view class="left">会员头像</view>
					<u-upload ref="uUpload" name="avatarurl" :fileList="oldAvatarUrl" max-count="1" :action="action"
						upload-text="上传头像" :auto-upload="false" @on-success="uploadsuccess" @on-error="uploaderror"
						@on-choose-complete="chooseimg" :form-data="formData" :header="header"></u-upload>
				</view>
				<view class="item">
					<view class="left">会员性别</view>
					<view class="right">
						<u-radio-group v-model="sex" @change="radioGroupChange" active-color="orange">
							<u-radio v-for="(item, index) in sexlist" :key="index" :name="item.value">
								{{item.name}}
							</u-radio>
						</u-radio-group>
					</view>
				</view>
				<view class="item" @tap="showBirthdayPicker">
					<view class="left">会员生日</view>
					<input disabled type="text" placeholder-class="line" placeholder="2021-01-24" name="birthday"
						v-model="birthday" />
				</view>
				<view class="item" @click="regionVisible=true">
					<view class="left">所在地址</view>
					<input disabled type="text" placeholder-class="line" placeholder="省市区县、乡镇等" name="region"
						v-model="region" />
				</view>
			</view>
			<!-- 地址选择器 -->
			<regionPicker :visible.sync="regionVisible" mode="region" default-type="value" :hide-area="false"
				@confirm="onConfirm($event,'region')" ref="region"></regionPicker>
			<!-- 生日选择器 -->
			<u-picker mode="time" ref="uPicker" v-model="birthdayShow" @confirm="birthdayConfirm" />
			<button form-type="submit" type="warn">保存并使用</button>
			<button form-type="reset">重置</button>
		</form>
	</view>
</template>

<script>
	// 引入地区模块
	import regionPicker from "@/components/region/w-picker.vue";
	export default {
		components: {
			regionPicker
		},
		data() {
			return {
				id: '', //初始化修改数据id
				// 头像提交服务端地址
				action: this.$baseUrl + `/api/infoedit`,
				// 需要展示的图片列表比如展示需要编辑的用户头像
				oldAvatarUrl: [],
				// 表单数据(不含头像信息)
				formData: {},
				// 初始化header头
				header: {},
				oldImg: '', //初始化旧图片
				regionVisible: false, //初始化地区选择器开关
				nickname: '鲁班', //初始化收件人姓名
				region: '北京市市辖区朝阳区', //初始化地区默认值
				birthday: '1992-02-14',
				birthdayShow: false,
				sexlist: [{
						value: 1,
						name: '男'
					},
					{
						value: 2,
						name: '女'
					},
				],
				sex: 1 //初始化会员性别
			}
		},

		onLoad() {
			this.getuserInfo(1)
		},

		methods: {
			// 2.编辑用户信息
			async submit(e) {
				console.log(e)
				let {
					token
				} = uni.getStorageSync("userInfo")
				let id = this.id
				let sex = this.sex
				let {
					birthday,
					nickname,
					region,
				} = e.detail.value
				//upload组件可以请求服务器地址  formdata是服务器地址所需data参数
				this.formData = {
					id,
					sex,
					birthday,
					nickname,
					region,
				}
				// //upload组件可以请求服务器地址  formdata是服务器地址所需header参数
				this.header = {
					authorization: token
				}
				console.log(this.$refs.uUpload.lists)
				let file = this.$refs.uUpload.lists[0].file || null
				console.log(file)
				if (file == null) { //用户没有操作upload组件  走普通的http请求
					console.log("普通")
					let options = {
						url: "/api/infoedit",
						data: this.formData,
						header: this.header,
						method: "post"
					}
					let result = await this.$http(options)
					console.log(result)
					if (result.data.code == 200) { //
						//重新请求修改之后的用户信息 将最新的用户信息存储到缓存中 并且跳回user页面
						console.log('123')
						this.getuserInfo(2)
					} else if (result.data.code == 403) { //登录失效
						uni.showToast({
							title: "登录失效",
							icon: "error"
						})
						setTimeout(() => {
							// 跳回地址列表页面
							uni.navigateTo({
								url: "../login/login"
							})
						}, 2000)
					} else {
						uni.showToast({
							title: "网络故障~",
							icon: "error"
						})
					}
				} else { //用户操作了upload组件
					console.log("组件")
					setTimeout(() => {
						//upload组件的上传
						this.$refs.uUpload.upload()
					}, 500)
				}

			},
			// 1.请求会员信息
			async getuserInfo(type) {
				let {
					uid,
					token
				} = uni.getStorageSync("userInfo")
				let options = {
					url: "/api/getuserinfo",
					data: {
						uid
					},
					header: {
						authorization: token
					}
				}
				let result = await this.$http(options)
				console.log(result)
				if (result.data.code == 200) { //
					// // 将获取到得用户信息渲染到form表单上
					let userInfo = result.data.list[0]
					
					// type==1 将数据渲染到form表单
					if (type == 1) {
						console.log("表单")
						this.nickname = userInfo.nickname
						//注意upload上传组件的图片数据格式  [{url:''},{},{}]
						this.oldAvatarUrl = [{
							url: this.$baseUrl + userInfo.avatarurl
						}]
						this.sex = userInfo.sex
						this.birthday = userInfo.birthday
						this.region = userInfo.region
						this.id = userInfo.id
					} else { // type==2  更新缓存数据 跳回user页面
						console.log("缓存")
						userInfo.token = uni.getStorageSync("userInfo").token
						console.log(userInfo)
						uni.setStorageSync("userInfo",userInfo)

						uni.showToast({
							title:"修改成功"
						})
						setTimeout(()=>{
						 uni.switchTab({
						 	url:"../user/user"
						 })
						},2000)
					}
				} else if (result.data.code == 403) { //登录失效
					uni.showToast({
						title: "登录失效",
						icon: "error"
					})
					setTimeout(() => {
						// 跳回地址列表页面
						uni.navigateTo({
							url: "../login/login"
						})
					}, 2000)
				} else {
					uni.showToast({
						title: "网络故障~",
						icon: "error"
					})
				}
			},
			// 选择会员地区
			onConfirm(res) {
				console.log(res)
				this.region = res.result
			},
			// 监听本地选择图片
			chooseimg(lists, name) {},
			// 性别标签切换
			radioGroupChange(e) {
				console.log(e)

				this.sex = e
			},

			// 地址默认设置开关
			setDefault(e) {},

			// 开始生日选择器
			showBirthdayPicker() {
				this.birthdayShow = true;
			},
			// 监听时期选择器
			birthdayConfirm(e) {
				console.log(e)
				this.birthday = e.year + "-" + e.month + "-" + e.day
			},

			// 图片上传成功触发 相当于request请求中的sucess回调函数
			uploadsuccess(data, index, lists, name) {
				console.log(data)
				//重新请求修改之后的而用户信息 将最新的用户信息存储到缓存中 并且跳回user页面
				if (data.code == 200) {
					this.getuserInfo(2)
				}
			},
			// 图片上传失败触发
			uploaderror(res, index, lists, name) {},

		}
	}
</script>

<style lang="scss" scoped>
	// 引入样式
	@import '@/static/css/userinfo.scss';
</style>
