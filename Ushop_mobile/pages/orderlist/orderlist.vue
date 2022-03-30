<template>
	<view>
		<view class="wrap">
			<view class="u-tabs-box">
				<u-tabs-swiper 
					activeColor="#f29100" 
					ref="tabs" 
					:list="list" 
					:show-bar="showBar"
					:current="current" 
					@change="change" 
					:is-scroll="false" 
					swiperWidth="750">
				</u-tabs-swiper>
			</view>
			<swiper 
				class="swiper-box" 
				:current="swiperCurrent" 
				@transition="transition" 
				@animationfinish="animationfinish"
			>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page-box">
							<block v-if="dataBuffer ==false">
								<ordernull />
							</block>
							<block v-else>
								<view class="order" v-for="(res,index) in orderList" :key="res.id">
									<view class="top">
										<view class="left">
											<u-icon name="home" :size="30" color="rgb(94,94,94)"></u-icon>
											<view class="store">编号: {{ res.ordernumber }}</view>
											<u-icon name="arrow-right" color="rgb(203,203,203)" :size="26"></u-icon>
										</view>
										<view class="right">待付款</view>
									</view>
									<view class="item" v-for="(item, index) in res.child" :key="index">
										<view class="left"><image :src="item.img" mode="aspectFill"></image></view>
										<view class="content">
											<view class="title u-line-2">{{ item.goodsname }}</view>
											<view class="type"></view>
											<view class="delivery-time">下单时间 {{res.addtime}}</view>
										</view>
										<view class="right">
											<view class="price">
												￥{{ priceInt(item.price) }}
												<text class="decimal">.{{ priceDecimal(item.price) }}</text>
											</view>
											<view class="number">x{{ item.num }}</view>
										</view>
									</view>
									<view class="total">
										共{{res.countnumber }}件商品 合计:
										<text class="total-price">
											￥{{ res.countmoney }}.
											<text class="decimal">{{priceDecimal(res.countmoney)}}</text>
										</text>
									</view>
									<view class="bottom">
										<view class="more"><u-icon name="more-dot-fill" color="rgb(203,203,203)"></u-icon></view>
										<view class="exchange btn">继续购买</view>
										<view class="exchange btn">撤销订单</view>
										<view class="evaluate btn">立即支付</view>
									</view>
								</view>
								<u-loadmore :status="loadStatus[0]" bgColor="#f2f2f2"></u-loadmore>
							</block>
							
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page-box">
							<block v-if="dataBuffer ==false">
								<ordernull />
							</block>
							<block v-else>
								<view class="order" v-for="(res, index) in  orderList" :key="index">
									<view class="top">
										<view class="left">
											<u-icon name="home" :size="30" color="rgb(94,94,94)"></u-icon>
											<view class="store">编号: {{ res.ordernumber }}</view>
											<u-icon name="arrow-right" color="rgb(203,203,203)" :size="26"></u-icon>
										</view>
										<view class="right">待发货</view>
									</view>
									<view class="item" v-for="(item, index) in res.child" :key="index">
										<view class="left"><image :src="item.img" mode="aspectFill"></image></view>
										<view class="content">
											<view class="title u-line-2">{{ item.goodsname }}</view>
											<view class="type"></view>
											<view class="delivery-time">下单时间 {{res.addtime}}</view>
										</view>
										<view class="right">
											<view class="price">
												￥{{ priceInt(item.price) }}
												<text class="decimal">.{{ priceDecimal(item.price) }}</text>
											</view>
											<view class="number">x{{ item.num }}</view>
										</view>
									</view>
									<view class="total">
										共{{ res.countnumber }}件商品 合计:
										<text class="total-price">
											￥{{ priceInt(res.countmoney) }}.
											<text class="decimal">{{ priceDecimal(res.countmoney) }}</text>
										</text>
									</view>
									<view class="bottom">
										<view class="more"><u-icon name="more-dot-fill" color="rgb(203,203,203)"></u-icon></view>
										<view class="logistics btn">继续购买</view>
										<view class="exchange btn">撤销订单</view>
										<view class="evaluate btn">提醒发货</view>
									</view>
								</view>
								<u-loadmore :status="loadStatus[1]" bgColor="#f2f2f2"></u-loadmore>
							</block>
							
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;">
						<view class="page-box">
							<block v-if="dataBuffer == false">
								<ordernull />
							</block>
							<block v-else>
								<view class="order" v-for="(res,index) in orderList" :key="index">
									<view class="top">
										<view class="left">
											<u-icon name="home" :size="30" color="rgb(94,94,94)"></u-icon>
											<view class="store">编号: {{ res.ordernumber }}</view>
											<u-icon name="arrow-right" color="rgb(203,203,203)" :size="26"></u-icon>
										</view>
										<view class="right">待确认</view>
									</view>
									<view class="item" v-for="(item, index) in res.child" :key="index">
										<view class="left"><image :src="item.img" mode="aspectFill"></image></view>
										<view class="content">
											<view class="title u-line-2">{{ item.goodsname }}</view>
											<view class="type"></view>
											<view class="delivery-time">下单时间 {{res.addtime}}</view>
										</view>
										<view class="right">
											<view class="price">
												￥{{ priceInt(item.price) }}
												<text class="decimal">.{{ priceDecimal(item.price) }}</text>
											</view>
											<view class="number">x{{ item.num }}</view>
										</view>
									</view>
									<view class="total">
										共{{res.countnumber }}件商品 合计:
										<text class="total-price">
											￥{{ res.countmoney }}.
											<text class="decimal">{{priceDecimal(res.countmoney)}}</text>
										</text>
									</view>
									<view class="bottom">
										<view class="more"><u-icon name="more-dot-fill" color="rgb(203,203,203)"></u-icon></view>
										<view class="exchange btn">继续购买</view>
										<view class="exchange btn">撤销订单</view>
										<view class="evaluate btn">确认收货</view>
									</view>
								</view>
								<u-loadmore :status="loadStatus[2]" bgColor="#f2f2f2"></u-loadmore>
							</block>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view class="page-box">
							<block v-if="dataBuffer ==false">
								<ordernull />
							</block>
							<block v-else>
								<view class="order" v-for="(res, index) in  orderList" :key="index">
									<view class="top">
										<view class="left">
											<u-icon name="home" :size="30" color="rgb(94,94,94)"></u-icon>
											<view class="store">编号: {{ res.ordernumber }}</view>
											<u-icon name="arrow-right" color="rgb(203,203,203)" :size="26"></u-icon>
										</view>
										<view class="right" v-if="res.status == 0">待支付</view>
										<view class="right" v-else-if="res.status == 1">待发货</view>
										<view class="right" v-else-if="res.status == 2">待收货</view>
									</view>
									<view class="item" v-for="(item, index) in res.child" :key="index">
										<view class="left"><image :src="item.img" mode="aspectFill"></image></view>
										<view class="content">
											<view class="title u-line-2">{{ item.goodsname }}</view>
											<view class="type"></view>
											<view class="delivery-time">下单时间 {{res.addtime}}</view>
										</view>
										<view class="right">
											<view class="price">
												￥{{ priceInt(item.price) }}
												<text class="decimal">.{{ priceDecimal(item.price) }}</text>
											</view>
											<view class="number">x{{ item.num }}</view>
										</view>
									</view>
									<view class="total">
										共{{ res.countnumber }}件商品 合计:
										<text class="total-price">
											￥{{ priceInt(res.countmoney) }}.
											<text class="decimal">{{ priceDecimal(res.countmoney) }}</text>
										</text>
									</view>
									<view class="bottom">
										<view class="more"><u-icon name="more-dot-fill" color="rgb(203,203,203)"></u-icon></view>
										<block v-if="res.status ==0">
											<view class="exchange btn">继续购买</view>
											<view class="exchange btn">撤销订单</view>
											<view class="evaluate btn">立即支付</view>
										</block>
										<block v-else-if="res.status ==1">
											<view class="logistics btn">继续购买</view>
											<view class="exchange btn">撤销订单</view>
											<view class="evaluate btn">提醒发货</view>
										</block>
										<block v-else-if="res.status ==2">
											<view class="logistics btn">查看物流</view>
											<view class="exchange btn">撤销订单</view>
											<view class="evaluate btn">确认收货</view>
										</block>	
									</view>
								</view>
								<u-loadmore :status="loadStatus[3]" bgColor="#f2f2f2"></u-loadmore>
							</block>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>

// 引入订单为空提示组件
import ordernull from '@/components/ordernull/ordernull.vue';

export default {
	components:{ordernull},
	data() {
		return {
			showBar:true,//初始化底部滑块开关
			orderList:[],//初始化订单列表数据
			dataBuffer:false,//数据展示开关
			list: [
				{
					name: '待付款'
				},
				{
					name: '待发货'
				},
				{
					name: '待收货'
				},
				{
					name: '全部订单',
				}
			],
			current: 0,
			swiperCurrent: 0,
			tabsHeight: 0,
			dx: 0,
			loadStatus: ['loadmore','loadmore','loadmore','loadmore'],
			size: 2,// 每次查询条数
			page: 1,// 分页页码
			totalPage:0,//总页码
		};
	},
	onLoad(option){
		
		// 兼容百度小程序
		// #ifdef MP-BAIDU
			this.showBar = false;
		// #endif
		
		// 处理不同的订单状态 （默认请求状态是0的数据）
		let index = option.index || 3
		// 给轮播图和current赋值
		this.swiperCurrent = index
		this.current = index
		
		// 请求列表数据
		this.getOrderList()
	},
	computed: {
		// 价格小数
		priceDecimal() {
			return val => {
				if (val !== parseInt(val)) return val.slice(-2);
				else return '00';
			};
		},
		// 价格整数
		priceInt() {
			return val => {
				if (val !== parseInt(val)) return val.split('.')[0];
				else return val;
			};
		}
	},
	methods: {
		// tab栏切换
		change(index) {
			
			// 兼容支付宝小程序
			// #ifdef MP-ALIPAY
			this.current = index;
			// #endif
			this.swiperCurrent = index;
			
			this.orderList = [],
			this.page = 1
			this.size = 2
			this.totalPage = 0,
			this.getOrderList()
		},
		
		transition({ detail: { dx } }) {
			// this.$refs.tabs.setDx(dx);
		},
		animationfinish({ detail: { current } }) {
			this.$refs.tabs.setFinishCurrent(current);
			this.swiperCurrent = current;
			this.current = current;
			
			this.orderList = [],
			this.page = 1
			this.size = 2
			this.totalPage = 0,
			this.getOrderList()
		},
	
		// 请求订单列表
		async getOrderList() {
			let {uid,token} = uni.getStorageSync('userInfo')
			let {size,page} = this
			let info = {
				url:'/api/orderlist',
				data:{
					uid,
					size,
					page,
					status: this.swiperCurrent == 3 ? "" : this.swiperCurrent //全部订单得status为空
				},
				header:{
					authorization:token
				}
			}
			let result = await this.$http(info)
			if(result.data.code == 200) {
				if(result.data.list == null) {
					this.dataBuffer = false
				} else {
					this.dataBuffer = true
					result.data.list.data.map(item => {
						item.child.map(item2 => {
							item2.img = this.$baseUrl + item2.img
						})
					})
					console.log(result)
					this.orderList = this.orderList.concat(result.data.list.data)
					this.totalPage = result.data.list.totalPage
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
	
		// 上拉加载数据
		reachBottom() {
			this.page++
			if(this.page >= this.totalPage) {
				this.loadStatus.splice(this.swiperCurrent,1,'nomore')
				return
			}
			this.loadStatus[this.swiperCurrent] = 'loading'
			this.getOrderList()
		}
	}
};
</script>

<style>
	/* #ifndef H5 */
	page {
		height: 100%;
		background-color: #f2f2f2;
	}
	/* #endif */
</style>
<style lang="scss" scoped>
	// 引入样式
	@import '@/static/css/order.scss';
</style>
