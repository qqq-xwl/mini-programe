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
    wx.request({
      url: 'http://10.168.5.20:5000/api/categories',
      success: (res) => {
        this.setData({
          categories: res.data
        });
      },
      fail: (err) => {
        console.error('获取分类失败:', err);
      }
    });
  },
  fetchRecommendedDishes() {
    wx.request({
      url: 'http://10.168.5.20:5000/api/dishes',
      success: (res) => {
        // 随机选择4个菜品作为推荐
        const dishes = res.data.sort(() => 0.5 - Math.random()).slice(0, 4);
        this.setData({
          recommendedDishes: dishes
        });
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
