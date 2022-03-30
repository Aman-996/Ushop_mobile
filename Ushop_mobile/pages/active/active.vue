<template>
	<view class="wrap">
		<block v-if="dataBuffer">
			<view class="top">
				<image :src="activeImg" mode="widthFix" class="topBanner"></image>
				<image src="../../static/active.png" mode="widthFix" class="bottomBanner"></image>
			</view>
			<u-waterfall v-model="flowList" ref="uWaterfall">
				<template v-slot:left="{leftList}">
					<view class="demo-warter" v-for="(item, index) in leftList" :key="index" @click=toDetail1(index)>
						<!-- 警告：微信小程序中需要hx2.8.11版本才支持在template中结合其他组件，比如下方的lazy-load组件 -->
						<!-- <u-lazy-load threshold="-450" border-radius="10" :image="item.image" :index="index"></u-lazy-load> -->
						<u-lazy-load threshold="-450" border-radius="10" :image="item.img" :index="index"></u-lazy-load>
						<view class="demo-title">
							{{item.goodsname}}
						</view>
						<view class="demo-price">
							{{item.price}}元
						</view>
						<view class="demo-tag">
							<view class="demo-tag-owner">
								自营
							</view>
							<view class="demo-tag-text">
								放心购
							</view>
						</view>
						<view class="demo-shop">
							{{item.shop}}
						</view>
						<u-icon name="close-circle-fill" color="#fa3534" size="34" class="u-close" @click="remove(item.id)"></u-icon>
					</view>
				</template>
				<template v-slot:right="{rightList}">
					<view class="demo-warter" v-for="(item, index) in rightList" :key="index" @click=toDetail2(index)>
						<!-- <u-lazy-load threshold="-450" border-radius="10" :image="item.image" :index="index"></u-lazy-load> -->
						<u-lazy-load threshold="-450" border-radius="10" :image="item.img" :index="index"></u-lazy-load>
						<view class="demo-title">
							{{item.goodsname}}
						</view>
						<view class="demo-price">
							{{item.price}}元
						</view>
						<view class="demo-tag">
							<view class="demo-tag-owner">
								自营
							</view>
							<view class="demo-tag-text">
								放心购
							</view>
						</view>
						<view class="demo-shop">
							{{item.shop}}
						</view>
						<u-icon name="close-circle-fill" color="#fa3534" size="34" class="u-close" @click="remove(item.id)"></u-icon>
					</view>
				</template>
			</u-waterfall>
			<u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
		</block>
		<!-- 无数据提示 -->
		<u-empty 
			text="暂无数据~~去逛逛~~" mode="list" 
			:show="!dataBuffer" 
			color="orange" icon-color="orange"
		></u-empty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeData:{},
				loadStatus: 'loadmore',
				flowList: [],
				page:1,
				size:4,
				totalPage:0,
				dataBuffer:true,
				activeImg:"",//顶部广告图
				cateid:"",//id
				page:1,
				type:2,
				size:5,
				totalPage:1,
			}
		},
		onLoad(option){
			// this.flowList = list;
			// 设置活动标题和活动图
			let info = JSON.parse(option.params)
			// console.log(info)
			uni.setNavigationBarTitle({
				title:info.title
			})
			this.activeImg = info.img
			this.cateid = info.second_cateid
			// 获取列表数据
			this.reqList()
		},
		
		onReachBottom() {
			this.page++
			if (this.page > this.totalPage) {
				this.loadStatus = "nomore"
				return
			}
			this.loadStatus = "loading"
			this.reqList()
		},
	
		methods: {
			remove(id) {
				this.$refs.uWaterfall.remove(id);
			},
			clear() {
				this.$refs.uWaterfall.clear();
			},
			// 请求页面列表数据
			async reqList() {
				let {cateid,page,type,size} = this
				let info = {
					url:'/api/getgoodlist',
					data:{
						cateid,
						page,
						type,
						size
					}
				}
				let result = await this.$http(info)
				if(result.data.code == 200) {
					if(result.data.list.goodData == null) {
						this.dataBuffer = false
					} else {
						this.dataBuffer = true
						// 处理图片
						result.data.list.goodData.forEach(item => {
							item.img = this.$baseUrl + item.img
						})
						this.flowList = this.flowList.concat(result.data.list.goodData)
						this.totalPage = result.data.list.goodData.totalPage
					}
				} else { //404
					this.dataBuffer = false
				}
			},
	
		}
	}
</script>

<style lang="scss" scoped>
	// 引入样式
	@import '@/static/css/active.scss'
</style>
