Page({
  data: {
    categories: [],
    recommendedDishes: []
  },
  onLoad() {
    this.fetchCategories();
    this.fetchRecommendedDishes();
  },
  fetchCategories() {
    const app = getApp();
    wx.request({
      url: app.globalData.baseUrl + '/categories',
      success: (res) => {
        if (res.data.code === 200 && res.data.data) {
          this.setData({
            categories: res.data.data
          });
        } else {
          console.error('获取分类失败:', res.data.msg);
        }
      },
      fail: (err) => {
        console.error('获取分类失败:', err);
      }
    });
  },
  fetchRecommendedDishes() {
    const app = getApp();
    wx.request({
      url: app.globalData.baseUrl + '/dishes',
      success: (res) => {
        if (res.data.code === 200 && res.data.data) {
          // 随机选择4个菜品作为推荐
          const dishes = res.data.data.sort(() => 0.5 - Math.random()).slice(0, 4);
          this.setData({
            recommendedDishes: dishes
          });
        } else {
          console.error('获取推荐菜品失败:', res.data.msg);
        }
      },
      fail: (err) => {
        console.error('获取推荐菜品失败:', err);
      }
    });
  },
  getCategoryIcon(id) {
    const icons = ['🍱', '🍜', '🍔', '🍕', '🍣', '🥗', '🍩', '🥤'];
    return icons[id % icons.length];
  }
});
