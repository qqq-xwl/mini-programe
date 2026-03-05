Page({
  data: {
    dishName: '',
    dishImage: '',
    categories: [],
    selectedCategoryIndex: 0,
    selectedCategory: null,
    dishDescription: '',
    dishPrice: ''
  },
  onLoad() {
    this.fetchCategories();
  },
  fetchCategories() {
    const app = getApp();
    wx.request({
      url: app.globalData.baseUrl + '/categories',
      success: (res) => {
        this.setData({
          categories: res.data
        });
        if (res.data.length > 0) {
          this.setData({
            selectedCategory: res.data[0],
            selectedCategoryIndex: 0
          });
        }
      },
      fail: (err) => {
        console.error('获取分类失败:', err);
        wx.showToast({
          title: '获取分类失败',
          icon: 'none'
        });
      }
    });
  },
  inputDishName(e) {
    this.setData({
      dishName: e.detail.value
    });
  },
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          dishImage: res.tempFilePaths[0]
        });
      }
    });
  },
  selectCategory(e) {
    const index = e.detail.value;
    this.setData({
      selectedCategoryIndex: index,
      selectedCategory: this.data.categories[index]
    });
  },
  inputDishDescription(e) {
    this.setData({
      dishDescription: e.detail.value
    });
  },
  inputDishPrice(e) {
    this.setData({
      dishPrice: e.detail.value
    });
  },
  submitDish() {
    const { dishName, dishImage, selectedCategory, dishDescription, dishPrice } = this.data;
    
    // 验证表单
    if (!dishName) {
      wx.showToast({ title: '请输入菜品名称', icon: 'none' });
      return;
    }
    if (!dishImage) {
      wx.showToast({ title: '请上传菜品图片', icon: 'none' });
      return;
    }
    if (!selectedCategory) {
      wx.showToast({ title: '请选择所属分类', icon: 'none' });
      return;
    }
    if (!dishPrice || parseFloat(dishPrice) <= 0) {
      wx.showToast({ title: '请输入有效的菜品价格', icon: 'none' });
      return;
    }
    
    // 获取token
    const token = wx.getStorageSync('token');
    
    // 提交菜品
    const app = getApp();
    wx.request({
      url: app.globalData.baseUrl + '/dishes',
      method: 'POST',
      header: {
        'Authorization': token
      },
      data: {
        name: dishName,
        price: parseFloat(dishPrice),
        description: dishDescription,
        image: dishImage,
        category_id: selectedCategory.id
      },
      success: (res) => {
        wx.showToast({
          title: '菜品添加成功',
          icon: 'success'
        });
        // 跳回商家管理页面
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      },
      fail: (err) => {
        console.error('添加菜品失败:', err);
        wx.showToast({
          title: '添加菜品失败',
          icon: 'none'
        });
      }
    });
  },
  cancel() {
    wx.navigateBack();
  }
});