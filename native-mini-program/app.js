// app.js
App({
  onLaunch() {
    // 检查登录状态
    this.checkLoginStatus();
  },
  checkLoginStatus() {
    const userRole = wx.getStorageSync('userRole');
    if (!userRole) {
      // 未登录，跳转到登录页面
      wx.redirectTo({
        url: '/pages/login/login'
      });
    }
  },
  globalData: {
    userRole: null,
    baseUrl: 'http://120.53.244.154:5000/api'
  },
  // 登录方法
  login(role) {
    wx.setStorageSync('userRole', role);
    this.globalData.userRole = role;
  },
  // 退出登录方法
  logout() {
    wx.removeStorageSync('userRole');
    this.globalData.userRole = null;
    wx.redirectTo({
      url: '/pages/login/login'
    });
  },
  // 获取当前用户角色
  getUserRole() {
    if (!this.globalData.userRole) {
      this.globalData.userRole = wx.getStorageSync('userRole');
    }
    return this.globalData.userRole;
  }
});