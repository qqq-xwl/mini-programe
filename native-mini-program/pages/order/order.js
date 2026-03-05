Page({
  data: {
    orderCart: [],
    orderTotal: 0
  },
  onLoad() {
    // 从本地存储获取订单数据
    const orderCart = wx.getStorageSync('orderCart') || [];
    const orderTotal = wx.getStorageSync('orderTotal') || 0;
    
    this.setData({
      orderCart: orderCart,
      orderTotal: orderTotal
    });
  },
  submitOrder() {
    const orderItems = this.data.orderCart.map(item => ({
      dish_id: item.id,
      quantity: item.quantity,
      price: item.price
    }));
    
    // 获取用户ID（从本地存储中获取）
    const user = wx.getStorageSync('user');
    const user_id = user ? user.id : 1; // 默认用户ID为1
    
    const orderData = {
      user_id: user_id,
      items: orderItems,
      total_price: this.data.orderTotal
    };
    
    // 调用后端API提交订单
    const app = getApp();
    wx.request({
      url: app.globalData.baseUrl + '/orders',
      method: 'POST',
      data: orderData,
      success: (res) => {
        if (res.data.code === 200) {
          // 订单提交成功
          wx.showToast({
            title: res.data.msg || '订单提交成功',
            icon: 'success'
          });
          
          // 清空购物车
          wx.removeStorageSync('cart');
          wx.removeStorageSync('orderCart');
          wx.removeStorageSync('orderTotal');
          
          // 跳转到我的页面
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/mine/mine'
            });
          }, 1500);
        } else {
          wx.showToast({
            title: res.data.msg || '订单提交失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('提交订单失败:', err);
        wx.showToast({
          title: '订单提交失败',
          icon: 'none'
        });
      }
    });
  }
});