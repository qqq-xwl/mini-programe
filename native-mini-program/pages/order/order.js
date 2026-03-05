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
    
    const orderData = {
      items: orderItems,
      total_price: this.data.orderTotal
    };
    
    // 调用后端API提交订单
    wx.request({
      url: 'http://10.168.5.20:5000/api/orders',
      method: 'POST',
      data: orderData,
      success: (res) => {
        // 订单提交成功
        wx.showToast({
          title: '订单提交成功',
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