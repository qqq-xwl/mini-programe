Page({
  data: {
    dish: {},
    quantity: 1
  },
  onLoad(options) {
    const dishId = options.id;
    this.fetchDishDetail(dishId);
  },
  fetchDishDetail(dishId) {
    wx.request({
      url: `http://10.168.5.20:5000/api/dishes/${dishId}`,
      success: (res) => {
        this.setData({
          dish: res.data
        });
      },
      fail: (err) => {
        console.error('获取菜品详情失败:', err);
      }
    });
  },
  decreaseQuantity() {
    if (this.data.quantity > 1) {
      this.setData({
        quantity: this.data.quantity - 1
      });
    }
  },
  increaseQuantity() {
    this.setData({
      quantity: this.data.quantity + 1
    });
  },
  addToCart() {
    const dish = this.data.dish;
    const quantity = this.data.quantity;
    
    // 从本地存储获取购物车数据
    const cart = wx.getStorageSync('cart') || [];
    
    // 检查购物车中是否已有该菜品
    const existingIndex = cart.findIndex(item => item.id === dish.id);
    
    if (existingIndex !== -1) {
      // 已有该菜品，更新数量
      cart[existingIndex].quantity += quantity;
    } else {
      // 新菜品，添加到购物车
      cart.push({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
        quantity: quantity
      });
    }
    
    // 保存到本地存储
    wx.setStorageSync('cart', cart);
    
    // 提示用户
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  }
});