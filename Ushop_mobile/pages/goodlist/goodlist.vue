<template>
	<view class="goodlist" v-if="dataBuffer">
		<!-- head区域 -->
		<view class="head">
			<view class="search">
				<u-search 
					:disabled="true"
					@click="goSearch"
					shape="square"
					:show-action="true" 
					action-text="搜索" 
					:animation="true" 
					margin="10rpx 0rpx">
				</u-search>
			</view>
			<view class="sortbox">
				<view  class="sort">
					<view hover-class="touchOpacity">综合排序</view>
					<view hover-class="touchOpacity">销量</view>
					<view hover-class="touchOpacity" @click="pricesort">
						<text>价格</text>
						<image src="../../static/icon/sort.png"></image>
					</view>
					<view hover-class="touchOpacity">好评度</view>
					<view hover-class="touchOpacity">店铺</view>
				</view>	
				<view class="filter" hover-class="touchOpacity">
					<image src="../../static/icon/filter.png"></image>
					<text>筛选</text>
				</view>
			</view>
			
		</view>

		<!-- 提示标语区域 -->
		<view class="biaoyu" hover-class="touchOpacity">
			<u-notice-bar mode="vertical" :list="list"  :show="true" :close-icon="true"></u-notice-bar>
		</view>
		
		<!-- 商品列表区域 -->
		<view class="list" >
			<view 
				class="row" 
				v-for="(item,index) in goodlist" :key="index" @click="toDetail(index)"
			>
				<!-- 执行图片赖加载 此处注意百度小程序问题需要指定固定高度-->
				<view class="image">
					<u-lazy-load :key="index" :image="item.img" height="218"></u-lazy-load>
				</view>
				<view class="info" hover-class="touchOpacity">
					<text>{{item.goodsname}}</text>	
					<view class="money">
						<text>￥{{item.price}}</text> <text>￥{{item.market_price}}</text>
					</view>
					<text>双11.11限制200起</text>
					<text space="ensp">3565评论   99%好评</text>	
				</view>
			</view>
		</view>
		
		<!-- 底部悬浮球 -->
		<view 
			v-if="topBuffer"
			class="quick_top" 
			hover-class="touchOpacity"
			@click="back"
		>
			<image src="../../static/icon/totop.png"></image>
		</view>
	</view>
	<view v-else>
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
				value2:'',
				list: [
					'筛选11.11大促商品,亲,请速速赶来',
					'筛选11.11大促商品,亲,请速速赶来',
				],
				show: false,
				mode: 'right',
				mask: true, // 是否显示遮罩
				closeable: true,
				closeIconPos: 'top-right',
				topBuffer:false,//控制悬浮球显示
				dataBuffer:true,
				goodlist:[],//列表数据
				page:1,
				size:5,
				totalPage:1
			}
		},
		
		onLoad(option){
			this.reqList()
		},
		
		// 上拉触底
		onReachBottom() {
			this.page ++
			if(this.page > this.totalPage) {
				uni.showToast({
					title:'没有更多数据了',
					icon:'error'
				})
				return
			}
			this.reqList()
		},
		
		// 页面滚动出现置顶
		onPageScroll(e) {
			if(e.scrollTop > 80) {
				this.topBuffer = true
			} else {
				this.topBuffer = false
			}
		},
		
		methods: {
			// 跳转到搜索页面
			goSearch(){
			},
			
			// 价格筛选事件
			pricesort(){
				uni.showActionSheet({
					itemList:['升序','降序']
				})
			},
			
			// 请求列表数据
			async reqList() {
				uni.showLoading({
					title:'正在努力加载中……'
				})
				let {page,size} = this
				let {cateid,type} = this.$mp.query
				let info = {
					url:'/api/getgoodlist',
					data:{
						cateid,
						type,
						page,
						size
					}
				}
				let result = await this.$http(info)
				this.goodlist = result.data.list.goodData
				if(result.data.code === 200) {
					uni.hideLoading()
					if(this.goodlist == null) {
						this.dataBuffer = false
					} else {
						this.dataBuffer = true
						// 修改图片格式
						this.goodlist.forEach(item => {
							item.img = this.$baseUrl + item.img
						})
						this.goodlist = this.goodlist.concat(result.data.list.goodData)
						// console.log(this.goodlist)
						 //当前分类下的总页码
						this.totalPage = result.data.list.totalPage
					}
				} else {
					uni.hideLoading()
					uni.showToast({
						title:'网络开小差了~',
						icon:'error'
					})
				}
			},
		
			// 点击置顶回到顶部
			back() {
				uni.pageScrollTo({
				    scrollTop: 0,
				    duration: 200
				});
			},
		
			// 点击跳转详情页
			toDetail(index) {
				let id = this.goodlist[index].id
				uni.navigateTo({
					url:`../gooddesc/gooddesc?id=${id}`
				})
			}
		}
		
		
	}
</script>

<style>
	/* 引入样式 */
	@import url("@/static/css/goodlist.css");
</style>
