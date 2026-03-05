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
  fetchDishes() {
    const categoryId = this.data.selectedCategory;
    let url = 'http://10.168.5.20:5000/api/dishes';
    if (categoryId > 0) {
      url += `?category_id=${categoryId}`;
    }
    wx.request({
      url: url,
      success: (res) => {
        this.setData({
          dishes: res.data
        });
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