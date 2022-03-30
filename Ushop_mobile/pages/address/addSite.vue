<template>
	<view class="wrap">
		<form  @submit="submit">
			<view class="top">
				<view class="item">
					<view class="left">收货人</view>
					<input type="text" 
						placeholder-class="line" 
						placeholder="请填写收货人姓名" 
						name="username"
						v-model="username"
					 />
				</view>
				<view class="item">
					<view class="left">手机号码</view>
					<input type="text" 
						placeholder-class="line"  
						placeholder="请填写收货人手机号" 
						name="userphone"
						v-model="userphone"
					/>
				</view>
				
				<view class="item" @click="regionVisible=true">
					<view class="left">所在地址</view>
					<input
						disabled
						type="text"
					  	placeholder-class="line" 
					  	placeholder="省市区县、乡镇等" 
					  	name="location" 
					  	v-model="location"
					  />
				</view>
				
				<view class="item address">
					<view class="left">详细地址</view>
					<textarea type="text" 
						placeholder-class="line" 
						placeholder="街道、楼牌等" 
						name="useraddress"
						v-model="useraddress"
					/>
				</view>
				<!-- <view class="site-clipboard">
					<textarea placeholder-class="line" value="" placeholder="粘贴文本,可自动识别姓名和地址等" />
					<view class="clipboard">
						地址粘贴板
						<u-icon name="arrow-down" class="icon" :size="20"></u-icon>
					</view>
				</view> -->
			</view>
			<view class="bottom">
				<view class="tag">
					<view class="left">标签</view>
					<view class="right">
						<u-radio-group v-model="label" @change="radioGroupChange" active-color="orange">
							<u-radio 
								v-for="(item, index) in list" :key="index" 
								:name="item.name"
							>
								{{item.name}}
							</u-radio>
						</u-radio-group>
					</view>
				</view>
				<view class="default">
					<view class="left">
						<view class="set">设置默认地址</view>
						<view class="tips">提醒：每次下单会默认推荐该地址</view>
					</view>
					<view class="right">
						<switch 
							color="red" 
							@change="setDefault" 
							name="status"
							:checked="status"
						 />
					</view>
				</view>
			</view>
			<regionPicker
				:visible.sync="regionVisible"
				mode="region"
				default-type="value"
				:hide-area="false"
				@confirm="onConfirm($event,'region')"
				ref="region" 
			></regionPicker>
			<button form-type="submit" type="warn">保存并使用</button>
			<button form-type="reset" >重置</button>
		</form>
	</view>
</template>

<script>

// 引入提示模块 
let {load,hideload,isLogin,tip} = require('@/utils/tip.js');
let app = getApp();
import regionPicker from "@/components/region/w-picker.vue";

export default {
	components:{regionPicker},
	
	data() {
		return {
			regionVisible:false,//初始化地区选择器开关	
			username:'',//初始化收件人姓名
			userphone:'',//初始化收件人手机号
			useraddress:'',//初始化收件人详情地址
			location:'',//初始化地区默认值
			label:'家',//初始化地址标签
			list: [
				{
					name: '家'
				},
				{
					name: '公司'
				},
				{
					name: '学校'
				}
			],
			status:false,
			siteUrl:'addressadd',//初始化请求url地址
			id:'',//初始化修改数据id
			flag:0 //为区别修改和新增地址，为1是修改，为0是新增
		};
	},
	onLoad(option){
		this.flag = option.flag
		if(this.flag == 1) {
			uni.setNavigationBarTitle({
				title:'修改地址'
			})
			this.getOneAddress()
		} else {
			uni.setNavigationBarTitle({
				title:'新增地址'
			})
		}
	},
	methods: {
		// 设置会员地区
		onConfirm(res){
			this.location = res.result;
		},
		
		// 设置默认地址
		setDefault(){},
		
		// 切换标签
		radioGroupChange(e) {
			this.label = e
		},
		
		// 提交表单
		// 执行修改
		async submit(e) {
			let {uid,token} = uni.getStorageSync('userInfo')
			let {location,status,useraddress,username,userphone} = e.detail.value
			let label = this.label
			let info = {}
			if(this.flag == 1) {
				info = {
					url:'/api/addressedit',
					data:{
						id:this.$mp.query.id,
						username,
						userphone,
						location,
						useraddress,
						status:status ? 1 : 0,
						label
					},
					header:{
						authorization:token
					},
					method:'POST'
				}
			} else {
				info = {
					url:'/api/addressadd',
					data:{
						uid,
						username,
						userphone,
						location,
						useraddress,
						status:status ? 1 : 0,
						label
					},
					header:{
						authorization:token
					},
					method:'POST'
				}
			}
			let result = await this.$http(info)
			if(result.data.code == 200) {
				uni.showToast({
					title:result.data.msg,
					icon:'success'
				})
				setTimeout(()=> {
					uni.navigateTo({
						url:'./address'
					})
				},2000)
			} else if(result.data.code == 403) {
				uni.showToast({
					title:"需重新登录喔~",
					icon:'loading'
				})
				setTimeout(()=> {
					uni.navigateTo({
						url:'../login/login'
					})
				},2000)
			} else {
				uni.showToast({
					title:"网络又开小差了~",
					icon:'error'
				})
				setTimeout(()=> {
					uni.navigateTo({
						url:'../index/index'
					})
				},2000)
			}
		},
		
		// 获取修改表单数据
		async getOneAddress() {
			let id = this.$mp.query.id
			let uid = uni.getStorageSync('userInfo').uid
			let token = uni.getStorageSync('userInfo').token
			let info = {
				url:'/api/addresslist',
				data:{
					uid,
					id
				},
				header:{
					authorization:token
				}
			}
			let result = await this.$http(info)
			console.log(result)
			if(result.data.code == 200) {
				let address = result.data.list[0]
				this.username = address.username
				this.userphone = address.userphone
				this.useraddress = address.useraddress
				this.location = address.location
				this.label = address.label
				this.status = address.status == 1 ? true : false
			} else if(result.data.code === 403) {
				uni.showToast({
					title:'登录失败',
					icon:'error'
				})
				this.isLogin = false
			} else {
				uni.showToast({
					title:'网络开小差了……',
					icon:'error'
				})
			}
		},		
	
	}
}
</script>

<style lang="scss" scoped>
	// 引入样式
	@import  '@/static/css/addsite.scss';
</style>
