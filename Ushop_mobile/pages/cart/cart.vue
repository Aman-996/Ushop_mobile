<template>
	<block v-if="isLogin">
		<view class="cart_box" v-if="buffer">
			<view class="cart_head">
			<view class="cart_menu">
				<text>全部(20)</text>
				<text>降价(4)</text>
				<text>常卖(2)</text>
				<text>分类</text>
			</view>
			<view class="cart_ticket">
				<!-- 此处使用checkbox是因为支付宝switch没有checkbox类型 -->
				<!-- <switch type="checkbox" :checked="true" color="#ff6040"  /> -->
				<checkbox  color="#FF6040" value="true" />
				<text class="cart_ticket_text1">小U自营</text>
				<text class="cart_ticket_text2">以免运费 |</text>
				<text class="cart_ticket_text3">领券</text>
			</view>
		</view>
		
		<view class="container" >	
			<view class="top">
				<scroll-view 
					class="scroll-view_H" 
					scroll-x="true" 
					scroll-left="0" 
					v-for="(item,index) in cartList"
					:key="item.id"
				>
					<view class="cartInfo" id="demo1">
						<!-- 明日来写购物车基本信息 -->
						<view class="cartInfochild">
							<!-- 选择框 -->
							<view class="cartInfo_switch common">
								<!-- 点击当前商品 -->
								<checkbox-group @change="item.status = !item.status">
									<checkbox
										color="#FF6040" 
										:checked="item.status"
										value="1"
									/>
								</checkbox-group>
								
								<!-- <switch type="checkbox" :checked="true"  color="#ff6040" /> -->
							</view>
							<!-- 图片 -->
							<view class="cartInfo_image common">
								<image :src="item.img" mode="widthFix"></image>
							</view>
		
							<!-- 信息 -->
							<view class="cartInfo_info">
								<label style="font-size: 32rpx;">{{item.goodsname}}</label>
								<label style="font-size: 24rpx; color: #ccc;">规格：不错的商品</label>
								<label style="font-size: 20rpx; color: #FF6040;">比加入降低￥100</label>
								<label style="color:#FF6040;">￥
									<text style="font-size: 40rpx;color:#FF6040;">{{item.price}}
									</text> <text>￥{{item.price + 100}}</text>
								</label>
							</view>
							<!-- 加减数量 -->
							<view class="cartInfo_num">
								<view class="cartInfo_num_child">
									<label @click="reduce(index)">－</label>
									<label >{{item.num}}</label>
									<label @click="add(index)">＋</label>
								</view>
							</view>
						</view>
		
					</view>
					<view class="cartDel" id="demo2" @click="del(index)">
						<label for="">删除</label>
					</view>
				</scroll-view>
			</view>
			
			<!-- 底部 -->
			<view class="foot">
				<view class="footd1">
					<checkbox-group  @change="changeAll">
						<checkbox  color="#FF6040" value="1"  :checked="allChecked"  />
					</checkbox-group>
					<!-- <switch type="checkbox" :checked="true" color="#ff6040" /> -->
					<label>全选</label>
				</view>
				<view class="footd2">
					<view class="footd2sp1">合计：<label style="color: #FF6040;">￥ {{allPrice}}</label></view>
					<label class="footd2sp2">不含运费，已优惠￥0.00</label>
				</view>
				<!-- 跳到提交订单，结算页面 -->
				<view class="footd3" hover-class="touchOpacity" @click="toOrder">
					<!-- 被选中的商品的个数 -->
					<label>去结算({{allNum}}件)</label>
				</view>
			</view>
		
		</view>
		</view>
	<!-- 无数据提示 -->
		<view v-else>
			<cartnull />
		</view>
	</block>
	<block v-else>
		<button type="default" @click="toLogin">去登录</button>
	</block>
</template>

<script>

	// 引入数据为空提示组件
	import cartnull from '@/components/cartnull/cartnull.vue';
	export default {
		components:{cartnull},
		data() {
			return {
				cartList:[],//初始化购物车数据
				buffer: true, //检测购物车是否有数据
				isLogin:false //是否登录
			}
		},
		// 页面显示时
		onShow() {
			this.getCar()
		},
		
		computed:{
			// 总价
			allPrice() {
				let Price = 0
				this.cartList.forEach(item => {
					if(item.status) {
						return Price += item.price * item.num
					}
				})
				return Price	
			},
			
			// 数量
			allNum() {
				let Num = 0
				this.cartList.forEach(item => {
					if(item.status) {
						return Num += item.num
					}
				})
				return Num
			},
			
			// 全选
			allChecked() {
				let Checked = this.cartList.every(item => 
					item.status
				)
				return Checked
			}
		},
		
		methods:{
			// 去登录
			toLogin() {
				uni.navigateTo({
					url:'../login/login'
				})
			},
			
			// 封装修改接口
			async Edit(id,type) {
				let userInfo = uni.getStorageSync('userInfo') || null
				if(userInfo == null) {
					this.isLogin = false
					return	
				} else {
					this.isLogin = true
					let info = {
						url:'/api/cartedit',
						data:{
							id,
							type
						},
						header:{
							authorization:userInfo.token
						},
						method:'POST'
					}
					let result = await this.$http(info)
					if(result.data.code == 200) {
						this.getCar()
					}
				}
			},			 
			
			// 请求购物车列表
			async getCar() {
				let userInfo = uni.getStorageSync('userInfo') || null
				if(userInfo == null) {
					this.isLogin = false
					return
				} else {
					this.isLogin = true
					let info = {
						url:'/api/cartlist',
						data: {
							uid:userInfo.uid
						},
						header:{
							authorization:userInfo.token
						}
					}
					let result = await this.$http(info)
					if(result.data.code === 200) {
						if(result.data.list == null) {
							this.buffer = false
						} else {
							this.buffer = true
							result.data.list.forEach((item,index) => {
								item.status = item.status == 1 ? true : false  
								item.img = this.$baseUrl + item.img
							})
							this.cartList = result.data.list
						}
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
				}
			},
			
			// 商品减
			async reduce(index) {
				if(this.cartList[index].num <= 1) {
					uni.showToast({
						title:'不能再减啦',
						icon:'none'
					})
					return
				}
			
				this.Edit(this.cartList[index].id,1)
			},
			
			// 商品加
			async add(index) {
				if(this.cartList[index].num >= 5) {
					uni.showToast({
						title:'已经到商品上限啦',
						icon:'none'
					})
					return
				}
				this.Edit(this.cartList[index].id,2)
			},
		
			// 删除商品
			del(index) {
				uni.showModal({
					title:'提示',
					content:'确定删除吗',
					success:async (res) => {
						if (res.confirm) {
						    let userInfo = uni.getStorageSync('userInfo') || null
						    if(userInfo == null) {
						    	this.isLogin = false
						    	return	
						    } else {
						    	this.isLogin = true
						    	let info = {
						    		url:'/api/cartdelete',
						    		data:{
						    			id:this.cartList[index].id
						    		}, 
						    		header:{
						    			authorization:userInfo.token
						    		},
						    		method:'POST'
						    	}
						    	let result = await this.$http(info)
						    	if(result.data.code == 200) {
									uni.showToast({
										title:result.data.msg
									})
						    		this.getCar()
						    	}
						    }
						}
					}
				})
				
			},
			
			// 全选
			changeAll(e) {
				let Check = e.detail.value[0] == "1" ? true : false 
				this.cartList.map(item => {
					item.status = Check
				})
			},
		
		
			// 去结算
			toOrder() {
				if(this.allNum != 0) {
					let newList = this.cartList.filter(item => {
						return item.status
					})
					uni.setStorageSync('userOrder',{newList:newList,countmoney:(this.allPrice).toFixed(2),countnumber:this.allNum})
					uni.navigateTo({
						url:'../order/order'
					})
				} else {
					uni.showToast({
						title:'暂无结算商品',
						icon:'error'
					})
				}
				
			}
		}
}
</script>

<style scoped>
	/* 引入样式文件 */
	@import url("@/static/css/cart.css");
</style>
