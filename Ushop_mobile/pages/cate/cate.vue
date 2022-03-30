<template>
	<view class="u-wrap">
		<view class="u-search-box">
			<u-search 
				shape="square"
				:show-action="true" 
				action-text="搜索" 
				:clearabled="true"  
				:animation="true" 
				v-model="keywords"
				:disabled="true"
				@click="goSearch"
			></u-search>
		</view>
		<view class="container" :style="{'height':cateHeight+'px'}">
				<!-- left左侧一级分类列表 -->
				<scroll-view scroll-y class="left">
					<!-- 循环遍历的 -->
					<view class="left_list" 
						v-for="(item,index) in cateTitle2" 
						:key="item.id" 
					>
						<text class="activeIndex" :class="activeIndex == index ? 'activeList' : ''" @click = "changeTab(index)" >{{item.catename}}</text>
					</view>
				</scroll-view>
				<!-- right右侧二级分类详情 -->
				<scroll-view scroll-y  class="right" :scroll-into-view="id">			
					<view class="right_box" :id="'id'+index" v-for="(item,index) in cateTitle2" :key="item.id">
						<view class="row_title">{{item.catename}}</view>
						<view class="row">
							<view 
								class="row_list" 
								v-for="(m,i) in item.children" 
								:key="m.id" 
								@click=toGoodList(m.id)
							>	
								<image :src="url + m.img" mode="widthFix"></image>
								<text>{{m.catename}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>
<script>
	
	export default {
		data() {
			return {
				id:'id0',//设置右侧默认置顶分类id
				activeIndex:0,//默认左侧分类选中下标
				cateHeight:'',//初始化分类容器高度
				keywords:'',
				cateTitle2:[],
				url:this.$baseUrl
			}
		},
		onLoad() {
			// 获取分类列表
			this.reqCateList2();
			
			// 动态获取当前设备的高度
			this.cateHeight = uni.getSystemInfoSync().windowHeight;
		},
			
		methods:{
			// 获取二级分类列表
			async reqCateList2() {
				let info = {
					url:'/api/getcates'
				}
				let result = await this.$http(info);
				this.cateTitle2 = result.data.list
			},
		
			// 跳转到商品列表
			toGoodList(cateid) {
				let id = cateid
				uni.navigateTo({
					url:`../goodlist/goodlist?type=2&cateid=${id}`
				})
			},
		
			// 侧边栏高亮效果
			changeTab(index) {
				this.activeIndex = index
				this.id = 'id' + index
			}
		}
	
	}
</script>

<style lang="scss" scoped>
/* 引入样式 */
	@import url("@/static/css/cate.css");
</style>
