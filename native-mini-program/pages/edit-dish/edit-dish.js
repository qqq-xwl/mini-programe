Page({
  data: {
    dishId: '',
    dishName: '',
    dishImage: '',
    categories: [],
    selectedCategoryIndex: 0,
    selectedCategory: null,
    dishDescription: '',
    dishPrice: ''
  },
  onLoad(options) {
    const dishId = options.id;
    this.setData({ dishId });
    this.fetchCategories();
    this.fetchDishDetail(dishId);
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
          wx.showToast({
            title: '获取分类失败',
            icon: 'none'
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
  fetchDishDetail(dishId) {
    const app = getApp();
    wx.request({
      url: app.globalData.baseUrl + '/dishes/' + dishId,
      success: (res) => {
        if (res.data.code === 200 && res.data.data) {
          const dish = res.data.data;
          this.setData({
            dishName: dish.name,
            dishImage: dish.image,
            dishDescription: dish.description || '',
            dishPrice: dish.price.toString()
          });
          // 找到对应的分类索引
          const categories = this.data.categories;
          if (categories.length > 0) {
            const categoryIndex = categories.findIndex(cat => cat.id === dish.category_id);
            if (categoryIndex !== -1) {
              this.setData({
                selectedCategoryIndex: categoryIndex,
                selectedCategory: categories[categoryIndex]
              });
            }
          }
        } else {
          console.error('获取菜品详情失败:', res.data.msg);
          wx.showToast({
            title: '获取菜品详情失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('获取菜品详情失败:', err);
        wx.showToast({
          title: '获取菜品详情失败',
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
    const { dishId, dishName, dishImage, selectedCategory, dishDescription, dishPrice } = this.data;
    
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
      url: app.globalData.baseUrl + '/dishes/' + dishId,
      method: 'PUT',
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
        if (res.data.code === 200) {
          wx.showToast({
            title: res.data.msg || '菜品编辑成功',
            icon: 'success'
          });
          // 跳回商家管理页面
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({
            title: res.data.msg || '菜品编辑失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('编辑菜品失败:', err);
        wx.showToast({
          title: '编辑菜品失败',
          icon: 'none'
        });
      }
    });
  },
  cancel() {
    wx.navigateBack();
  }
});