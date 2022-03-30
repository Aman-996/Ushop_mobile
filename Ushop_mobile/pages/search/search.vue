<template>
	<view>
		<!-- 搜索框 -->
		<view class="search_view">
			<u-search
				shape="square"
				:show-action="true" 
				action-text="搜索" 
				:clearabled="true"  
				:animation="true" 
				v-model="keywords"
				@change="search"
				@clear="clear"
				:focus="true">
			</u-search>
		</view>
		<view class="list" v-if="buffer">
			<view class="row" v-for="(item,index) in goodsList" @click="toDetail(index)">
				<image :src="item.img" mode="widthFix"></image>
				<view class="info">
					<text>{{item.goodsname}}</text>	
					<text>￥{{item.price}}</text>	
					<text>3565评论</text>	 
				</view>
			</view>
		</view>
		<view class="api" v-else>
			没有数据亲！
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				buffer:true,//页面显示开关,
				keywords:'',//初始化搜索关键词
				goodsList:[]//列表数据
			}
		},
		onLoad(options){
			
		},
	
		methods: {
			// 输入框输入时请求数据
			async search(value){
				// console.log(value)
				let info = {
					url:'/api/search',
					data:{
						keywords:value
					}
				}
				let result = await this.$http(info)
				if(result.data.code === 200) {
					this.goodsList = result.data.list
					if(this.goodsList == null) {
						this.buffer= false
					} else {
						this.buffer= true
						// 处理图片
						this.goodsList.map(item => {
							item.img = this.$baseUrl + item.img
						})
					}
				} else {//400
					this.buffer= false
				}
			},
			
			clear(){
				this.buffer= false
			},
			
			// 点击去详情页
			toDetail(index) {
				let id = this.goodsList[index].id
				uni.navigateTo({
					url:`../gooddesc/gooddesc?id=${id}`
				})
			}
		},
		
	}
</script>

<style>
	/* 引入样式 */
	@import url("@/static/css/search.css");
</style>
