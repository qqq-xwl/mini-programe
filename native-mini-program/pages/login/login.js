Page({
  data: {
    selectedRole: 'customer'
  },
  selectRole(e) {
    this.setData({
      selectedRole: e.currentTarget.dataset.role
    });
  },
  async login() {
    try {
      // 模拟微信登录获取 openid
      const openid = 'test-openid-' + Math.random().toString(36).substr(2, 9);
      const nickname = this.data.selectedRole === 'customer' ? '顾客用户' : '商家用户';
      const role = this.data.selectedRole;
      
      wx.request({
        url: 'http://10.168.5.20:5000/api/login',
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          openid: openid,
          nickname: nickname,
          avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20portrait&image_size=square',
          role: role
        },
        success: (res) => {
          if (res.data.id) {
            // 保存用户信息和token到本地存储
            wx.setStorageSync('user', res.data);
            wx.setStorageSync('token', res.data.token);
            // 使用app.js中的登录方法
            const app = getApp();
            app.login(role);
            // 跳转到首页
            wx.switchTab({ url: '/pages/home/home' });
          } else {
            wx.showToast({ title: '登录失败', icon: 'none' });
          }
        },
        fail: (err) => {
          console.error('登录失败:', err);
          wx.showToast({ title: '登录失败，请重试', icon: 'none' });
        }
      });
    } catch (error) {
      console.error('登录失败:', error);
      wx.showToast({ title: '登录失败，请重试', icon: 'none' });
    }
  }
});
