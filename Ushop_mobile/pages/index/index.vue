<template>
	<view class="">
		<view class="content u-skeleton">
			
			<!-- head搜索区域 -->
			<view class="head">
				<!-- 搜索框 -->
				<view class="search ">
					<image src="../../static/icon/address2.png" class="u-skeleton-circle"></image>
					<image src="../../static/logo/white.png" class="u-skeleton-circle"></image>
					<view class="search_input u-skeleton-fillet">
						<u-search
							:disabled="true"
							@click="goSearch"
							shape="square"
							action-text=" " 
							bg-color='#fff'
							:input-style="{fontSize:'20rpx'}"
						>
						</u-search>
					</view>
					<image src="../../static/icon/dp.png"  class="dp u-skeleton-circle"></image>
				</view>
				<!-- 快速导航 -->
				<view class="cate">
					<view class="catenavtab u-skeleton-rect">
						<u-tabs ref="tabs"
							:list="catenav"
							name="catename"
							bar-width="30"
							bar-height="8"
							active-color="white"
							bg-color="111"
							font-size="28"
							:show-bar="showBar"
							inactive-color='white'
							:is-scroll="true" 
							:current="currentnav" 
							@change="changecurrent"></u-tabs>
					</view>
					<view class="category u-skeleton-rect" >
						<image src="../../static/icon/cate.png"></image>
						<text>分类</text>
					</view>
				</view>
			</view>
			
			<!-- swiper区域  使用插件实现-->
			<view class="u-skeleton-fillet swiper_banner">
				<u-swiper :list="bannerlist" name="img" :effect3d="true" height="390" @click="goActive"></u-swiper>
			</view>
			<!-- 快速导航区域 -->
			<view class="quicknav">
				<view class="row" v-for="(item,index) in quicknav" :key='index' hover-class="touchOpacity">
					<image :src="item.src" class="u-skeleton-circle"></image>
					<text class="u-skeleton-rect">{{item.text}}</text>
				</view>
			</view>

			<!-- 秒杀商品推荐区域 -->
			<view class="seckill">
				<!-- 秒杀左侧区域 -->
				<view class="leftseckill u-skeleton-rect">
					<view class="title " hover-class="touchOpacity">
						<text>限时秒杀</text>
						<text>查看更多 > </text>
					</view>
					<view class="left_seckill_info">
						<u-count-down bg-color="#5D7E37" 
							color="white" 
							ref="uCountDown" 
							:timestamp=timestamp 
							:autoplay="true" 
							font-size="20"
							height="30"></u-count-down>
					</view>
					<image src="../../static/img/pic/commodity/01.png" mode="widthFix" class="seckill_img"></image>
				</view>
				<!-- 秒杀右侧区域 -->
				<view class="rightseckill">
					<view class="top u-skeleton-rect">
						<view>品牌上新</view>
						<view>9点整，抢大牌</view>
						<view hover-class="touchOpacity">疯抢红包 > </view>
					</view>
					<view class="bottom u-skeleton-rect">
						<view>日用好物</view>
						<view>愿君多采撷</view>
						<view hover-class="touchOpacity">塞满奖券 > </view>
					</view>
				</view>
			</view>
			
			<!-- 推荐商品区域 -->
			<view class="tuijian  u-skeleton-rect">
				<!-- 标题区域 -->
				<view class="tuijian_title">
					<text :class="tjActiveIndex == 0 ? 'tuijian_active' : '' ">双十一尖货预购</text>
					<text :class="tjActiveIndex == 1 ? 'tuijian_active' : '' ">畅购全球</text>
				</view>
				<!-- 滚动商品区域 -->
				<scroll-view scroll-x  class="tuijian_scroll_x">
					<view class="tuijian_scroll_x_row" v-for="(item,index) in tuijianshop" :key="index" hover-class="touchOpacity">
						<image :src="item"></image>
					</view>
				</scroll-view>
			</view>
			
			<!-- 推荐商品区域 -->
			<view class="recommendgood">
				<!-- 推荐导航 -->
				<view class="recommendnav  u-skeleton-fillet">
					<u-subsection
						:bold="bold" 
						:active-color="activeColor" 
						:current="current"
						:mode="mode" 
						:list="['热门推荐', '上新推荐', '所有商品']"
						@change="currentChange"
					></u-subsection>
				</view>
				<view class="recommendlist">
					<view class="recommendrow u-skeleton-rect" 
						v-for="(item,index) in shoplist" :key="index">
						<!--赖加载显示图片  此处注意百度小程序问题需要指定固定高度-->
						<view class="image">
							<u-lazy-load :key="item.id" :image="item.img" height="200" duration="300"></u-lazy-load>		
						</view>
						
						<view class="recommendrowinfo" hover-class="touchOpacity">
							<text>{{item.goodsname}}</text>
							<text>现价格： ￥{{item.price}}</text>
							<text>原价格：￥{{item.market_price}}</text>
							<text @click="toDetail(item.id)">
								立即抢购
							</text>
						</view>
					</view>
				</view>
				<!-- #ifdef H5 -->
				<view class="topview"></view>
				<!-- #endif -->
			</view>
		</view>
		<!--引用组件  引入骨架屏组件-->
		<!--注意： 所以要求在请求数据尚未完成时，填写一些模拟数据，才能让对应的元素有对应的尺寸和位置，供uni.createSelectorQuery查询使用 -->
		<u-skeleton bg-color="rgb(250, 250, 250)" :loading="loading" :animation="animation" 
		:el-color="elColor" :border-radius="borderRadius"></u-skeleton>
	</view>
</template>
<script>
	import checkLogin from '@/utils/checkLogin.js'
	export default {
		data() {
			return {
				showBar:true,//初始化分类导航底部滑块开关
				currentnav:0,//初始化分类导航下标
				loading: true, // 是否显示骨架屏组件
				animation: true,
				elColor: '#FFC8B4',
				borderRadius: 10,
				mode: 'subsection',
				current: 0,//热推默认选项卡
				activeColor: 'orange',
				bold: true,
				change: true,
				activeIndex:0,//默认分类下标
				catenav:[],
				bannerlist: [],//初始化轮播图数据
				url:this.$baseUrl,//图片前缀
				quicknav:[
					{src:'../../static/icon/seckill.png',text:'限时秒杀'},
					{src:'../../static/icon/top.png',text:'畅销商品'},
					{src:'../../static/icon/brand.png',text:'品质大牌'},
					{src:'../../static/icon/selfsupport.png',text:'小U自营'},
					{src:'../../static/icon/integral.png',text:'积分商城'}
				],
				seckill:{},//秒杀数据
				tuijianshop:[
					'../../static/img/pic/commodity/01.png',
					'../../static/img/pic/commodity/02.png',
					'../../static/img/pic/commodity/03.png',
					'../../static/img/pic/commodity/04.png',
					'../../static/img/pic/commodity/05.png',
				],
				tjActiveIndex:0,
				goodsIndex:0,
				hotGoods:[],//商品推荐中所有数据,
				shoplist:[],//当前选项卡数据,
				timestamp:"",//倒计时
			}
		},
		onLoad() {
			// 请求一级导航栏
			this.reqDate();
			// 请求轮播图
			this.reqBanner();
			// 请求商品推荐
			this.reqGoods();
			// 请求倒计时
			this.reqTime()
		},
		onShow() {
			checkLogin(this)
		},
		methods: {
			// 跳转到搜索页面
			goSearch(){
				uni.navigateTo({
					url:'../search/search'
				})
			},
			
			// 请求首页一级分类
			async reqDate() {
				let info = {
					url:'/api/getcate',
				}
				let result = await this.$http(info)
				this.catenav = result.data.list	
				this.loading = false
			},
			
			// 点击快速分类导航
			changecurrent(index){
				this.currentnav = index
				let cateid = this.catenav[index].id
				uni.navigateTo({
					url:`../goodlist/goodlist?type=1&cateid=${cateid}` 
				})
			},
			
			// 请求首页轮播图
			async reqBanner() {
				let info = {
					url:'/api/getbanner',
				}
				let result = await this.$http(info)
				this.bannerlist = result.data.list
				// 循环给Img添加前缀
				this.bannerlist.forEach(item => {
					item.img = this.$baseUrl + item.img
				})
			},
			
			// 切换选项卡
			currentChange(index) {
				this.shoplist = this.hotGoods[index].content
			},
			
			// 请求首页商品推荐
			async reqGoods() {
				let info = {
					url:'/api/gethortgoods'
				}
				let result = await this.$http(info)
				// 处理图片格式
				result.data.list.forEach(item => {
					item.content.forEach(item2 => {
						item2.img = this.$baseUrl + item2.img
					})
				})
				this.hotGoods = result.data.list
				this.shoplist = result.data.list[0].content
			},
			
			// 请求倒计时
			async reqTime() {
				let info = {
					url:'/api/getseckill'
				}
				let result = await this.$http(info)
				this.timestamp = parseInt(((result.data.list[0].endtime - new Date().getTime())/1000))
			},
		
			// 点击立即抢购跳转
			toDetail(id) {
				uni.navigateTo({
					url:`../gooddesc/gooddesc?id=${id}`
				})
			},
		
			// 点击轮播图跳转
			goActive(index) {
				let params = JSON.stringify(this.bannerlist[index])
				uni.navigateTo({
					url:`../active/active?params=${params}`
				})
			}
		}
	}
</script>

<style>
	/* 引入样式 */
	@import url("@/static/css/index.css");
</style>
