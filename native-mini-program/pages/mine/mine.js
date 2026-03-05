Page({
  data: {
    userRole: 'customer',
    orders: []
  },
  onLoad() {
    // 从本地存储获取用户角色
    const userRole = wx.getStorageSync('userRole') || 'customer';
    this.setData({
      userRole: userRole
    });
    this.fetchOrders();
  },
  fetchOrders() {
    wx.request({
      url: 'http://10.168.5.20:5000/api/orders',
      success: (res) => {
        this.setData({
          orders: res.data
        });
      },
      fail: (err) => {
        console.error('获取订单失败:', err);
      }
    });
  },
  viewOrders() {
    // 跳转到订单列表页面
    wx.showToast({
      title: '查看订单功能开发中',
      icon: 'none'
    });
  },
  goToMerchant() {
    // 跳转到商家管理页面
    wx.navigateTo({
      url: '/pages/merchant/merchant'
    });
  },
  logout() {
    // 清除本地存储的用户信息
    wx.removeStorageSync('userRole');
    
    // 跳转到登录页面
    wx.redirectTo({
      url: '/pages/login/login'
    });
  }
});