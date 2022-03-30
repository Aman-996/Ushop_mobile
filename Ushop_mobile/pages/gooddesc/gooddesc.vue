<template>
	<view class="container">
		<!-- 详情图片 -->
		<view class="detailImage">
			<image :src="goodDesc.img">
		</view>
		
		<!-- 详情基本信息 -->
		<view class="detailInfo">
			<view class="detailPrice">
				<view class="detailPrice_left">
					<text>￥</text>
					<text>{{goodDesc.price}}</text>
					<text>￥{{goodDesc.market_price}}</text>
				</view>
				<view class="detailPrice_right" hover-class="touchOpacity">
					<image src="../../static/icon/follow.png"></image>
					<text>收藏</text>
				</view>
			</view>		
			<view class="detaildesc">
				<text>{{goodDesc.goodsname}}</text>
				<!-- <text>敏感肌可用，控油祛痘、男女可用、泡沫绵密、净透毛孔</text> -->
			</view>
			<view class="detailslogan">11.11限时299元起</view>
			<view class="detaillook" hover-class="touchOpacity">
				<text>此商品于2020-11-11,结束闪购特卖，品牌美妆闪购专场</text>
				<text>查看 ></text>
			</view>
		</view>
		
		<!-- 基本信息改变 -->
		<view class="changeInfo">
			<!-- 优惠券 -->
			<view class="ticketstage">
				<view class="ticketstage_title">领券</view>
				<view class="ticketstage_ticket">
					<view class="">100</view><view >50</view><view >20</view>
				</view>
			</view>
			<!-- 分期 -->
			<view class="ticketstage">
				<view class="ticketstage_title">分期</view>
				<view class="ticketstage_stage" hover-class="touchOpacity">
						<text @click="choiceStage">{{stage[value]}}</text>
						<text> > </text>
				</view>
			</view>
			
			<!-- 商品属性 -->
			<view class="changeState">
				<view class="productStat">
					<label for="">商品属性</label>
				</view>
				<view class="productGuige">
					<label>{{goodDesc.specsname}}</label>
					<view class="threed3i1" @click="actived(index)" :class="activeIndex == index ? 'changethreed3i1' : '' " v-for="(item,index) in goodDesc.specsattr" :key='item'>{{item}}</view>
					<!-- <view class="threed3i1"  >灰色</view> -->
				</view>
			</view>
		</view>
		<!-- 商品详情 -->
		 <view class="productDetail">
			<view class="productDetailTitle">商品详情</view>
			<!-- 需要处理图片自适应问题 -->
			<view class="" >
				
			</view>
		</view>
		
		<!-- 商品评价区域 -->
		<view class="productEval">
			<view class="eval">商品评价</view>
			<view v-for="(item,index) in evals" :key="index">
				<label class="evalUsername">{{item.name}}</label>
				<label class="evalUsertitle">{{item.title}}</label>					
				<view class="evalImage">
					<image v-for="(i,ind) in item.img" :key="ind" :src="i">
				</view>
				<label class="evalTime">{{item.time}}</label>
			</view>
		</view>
		
		<!-- 底部按钮 -->
		<view class="navigation">
			<view class="left">
				<view class="item">
					<u-icon name="server-fill" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="text u-line-1">客服</view>
				</view>
				<view class="item">
					<u-icon name="home" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="text u-line-1">店铺</view>
				</view>
				<view class="item car" @click="toCar">
					<u-badge class="car-num" :count="cartCount" type="error" :offset="[-3, -6]"></u-badge>
					<u-icon name="shopping-cart" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="text u-line-1">购物车</view>
				</view>
			</view>
			<view class="right">
				<view class="cart btn u-line-1" @click="addCar">加入购物车</view>
				<view class="buy btn u-line-1">立即购买</view>
			</view>
		</view>
		
		<!-- 分享给朋友 微信端 -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="shareFriend" >
			<button type="default" open-type="share">
				<image src="../../static/icon/wxshare.png" mode=""></image>
			</button>
		</view>
		<!-- #endif -->
		
		<!-- 客服 -->
		<view class="kefu">
			<button type="default" open-type="contact">
				<image src="../../static/icon/kefu.png" @click="goKefu"></image>
			</button>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				stage:['可选3/6/12期','3期','6期','12期'],//分期默认值
				value:0,//默认分期提示
				cartCount:'',//初始化购物车右上角角标
				goodDesc:{},
				activeIndex:0, //属性高亮
				evals: [{  //评价内容
					name: '小李白',
					title: '效果很好，物流到位，下次继续来',
					img: ["../../static/img/detail/pingjia1.jpg","../../static/img/detail/pingjia1.jpg","../../static/img/detail/pingjia1.jpg","../../static/img/detail/pingjia1.jpg","../../static/img/detail/pingjia2.jpg","../../static/img/detail/pingjia3.jpg"],
					time: '2020-01-13'
				}]
			}
		},
		onLoad(options) {
			// 请求详情页数据
			this.reqInfo()
		},
		methods: {
			// 客服页面
			goKefu(){
				uni.navigateTo({
					url:'../HM-chat/HM-chat'
				})
			},
			
			// 分期事件
			choiceStage(){
				uni.showActionSheet({
					itemList:['3期','6期','12期'],
					itemColor:'#FF6040',
					success:res=>{
						this.value = res.tapIndex+1
					},
					fail:err=>{this.value=0}
				})
			},
		
			// 请求详情页数据
			async reqInfo() {
				let id = this.$mp.query.id
				let info = {
					url:'/api/getgoodsinfo',
					data:{
						id
					}
				}
				let result = await this.$http(info)
				this.goodDesc = result.data.list[0]
				// 处理图片
				this.goodDesc.img = this.$baseUrl + this.goodDesc.img
				// 处理属性数组
				this.goodDesc.specsattr = this.goodDesc.specsattr.split(',')
			},
			
			// 处理属性高亮
			actived(index) {
				this.activeIndex = index
			},
		
			// 加入购物车
			async addCar() {
				let userInfo = uni.getStorageSync('userInfo') || null
				if(userInfo == null) {
					uni.showToast({
						title:'请先前往登录',
						icon:'error'
					})
					setTimeout(() => {
						uni.navigateTo({
							url:'../login/login'
						})
					},1000)
				} else {
					let {token,uid} = userInfo
					let goodsid = this.$mp.query.id
					let num = 1
					let info = {
						url:'/api/cartadd',
						data:{
							uid,
							goodsid,
							num
						},
						header:{
							authorization:token
						},
						method:'POST'
					}
					let result = await this.$http(info)
					if(result.data.code == 200) {
						this.cartCount ++ 
						uni.showToast({
							title:result.data.msg
						})
					} else if(result.data.code == 403) { //登录失败
						uni.showToast({
							title:'请先前往登录',
							icon:'error'
						})
						setTimeout(() => {
							uni.navigateTo({
								url:'../login/login'
							})
						},1000)
					} else {
						uni.showToast({
							title:'请先前往登录',
							icon:'error'
						})
					}
				}
				
			},
		
			// 跳转购物车页
			toCar(){
				uni.switchTab({
					url:"../cart/cart"
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	/* 引入样式 */
	@import '@/static/css/gooddesc.scss';
</style>

