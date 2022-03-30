
<template>
	<view>
		<view class="item" 
			v-for="(res, index) in siteList" :key="res.id" 
			v-if="dataBuffer" @click="chooseAddress(index)"
		>	<u-icon name="close-circle-fill" :size="40" color="#ff5500" :index="res.id" @click.native.stop="del(index)"></u-icon>
			<view class="top" >
				<view class="name">{{ res.username }}</view>
				<view class="phone">{{ res.userphone }}</view>
				<view class="tag">
					<text class="red" v-if="res.status == 1">默认</text>
				</view>
			</view>
			<view class="bottom" >
				{{res.location+res.useraddress}}
				<u-icon name="edit-pen" :size="40" color="#999999" :index="res.id" @click.native.stop="changeAddress(res.id)"></u-icon>
			</view>
		</view>
		<view v-else>
			暂无收货地址信息!
		</view>
		<view class="addSite" @tap="toAddSite">
			<view class="add">
				<u-icon name="plus" color="#ffffff" class="icon" :size="30"></u-icon>新建收货地址
			</view>
		</view>
	</view>
</template>

<script>

export default {
	data() {
		return {
			siteList: [],//初始化地址数据
			dataBuffer:true
		};
	},
	onLoad() {
		this.getAllAddress()
	},
	methods: {
		// 请求所有收获地址
		async getAllAddress() {
			let uid = uni.getStorageSync('userInfo').uid
			let token = uni.getStorageSync('userInfo').token
			let info = {
				url:'/api/addresslist',
				data:{
					uid
				},
				header:{
					authorization:token
				}
			}
			let result = await this.$http(info)
			if(result.data.code == 200) {
				if(result.data.list == null) {
					this.localBuffer = false
				} else {
					this.localBuffer = true
					this.siteList = result.data.list
				}
			}
		},
		
		// 修改地址
		changeAddress(id) {
			uni.navigateTo({
				url:`./addSite?flag=1&id=${id}`
			})
		},
		
		// 跳转到新增地址页面
		toAddSite(){
			uni.navigateTo({
				url:'./addSite'
			})
		},
		
		// 删除地址
		del(index) {
			let id = this.siteList[index].id
			uni.showModal({
				title:'提示',
				content:'确定要删除吗？',
				success:async (res) => {
					if(res.confirm) {
						let info = {
							url:'/api/addressremove',
							data:{
								id
							},
							header:{
								authorization:uni.getStorageSync('userInfo').token
							},
							method:'POST'
						}
						let result = await this.$http(info)
						if(result.data.code == 200) {
							this.siteList.splice(index,1)
							if(this.siteList.length == 0) {
								this.dataBuffer = false
							} else {
								this.dataBuffer = true
							}
						} else if(result.data.code === 403) {
							uni.showToast({
								title:'登录失败',
								icon:'error'
							})
							setTimeout(()=>{
								uni.navigateTo({
									url:'../login/login'
								})
							},2000)
						} else {
							uni.showToast({
								title:'网络开小差了……',
								icon:'error'
							})
							setTimeout(()=>{
								uni.navigateTo({
									url:'../login/login'
								})
							},2000)
						}
					}
				}
			})
		},
	
		// 选中地址改变默认地址
		chooseAddress(index) {
			let addressInfo = JSON.stringify(this.siteList[index])
			console.log(addressInfo)
			uni.navigateTo({
				url:`../order/order?type=1&info=${addressInfo}`
			})
		}
	}
};
</script>

<style lang="scss" scoped>
	// 引入样式
	@import  '@/static/css/address.scss';
</style>
