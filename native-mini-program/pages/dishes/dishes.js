Page({
  data: {
    categories: [],
    dishes: [],
    selectedCategory: 0
  },
  onLoad(options) {
    // 如果有category_id参数，设置为选中分类
    if (options.category_id) {
      this.setData({
        selectedCategory: parseInt(options.category_id)
      });
    }
    this.fetchCategories();
    this.fetchDishes();
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
  fetchDishes() {
    const app = getApp();
    const categoryId = this.data.selectedCategory;
    let url = app.globalData.baseUrl + '/dishes';
    if (categoryId > 0) {
      url += `?category_id=${categoryId}`;
    }
    wx.request({
      url: url,
      success: (res) => {
        if (res.data.code === 200 && res.data.data) {
          this.setData({
            dishes: res.data.data
          });
        } else {
          console.error('获取菜品失败:', res.data.msg);
        }
      },
      fail: (err) => {
        console.error('获取菜品失败:', err);
      }
    });
  },
  selectCategory(e) {
    const categoryId = parseInt(e.currentTarget.dataset.id);
    this.setData({
      selectedCategory: categoryId
    });
    this.fetchDishes();
  },
  goToDishDetail(e) {
    const dishId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/dish-detail/dish-detail?id=${dishId}`
    });
  }
});