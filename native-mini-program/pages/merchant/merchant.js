Page({
  data: {
    activeTab: 'categories',
    categories: [],
    dishes: [],
    newCategoryName: ''
  },
  onLoad() {
    this.fetchCategories();
    this.fetchDishes();
  },
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
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
    wx.request({
      url: 'http://10.168.5.20:5000/api/dishes',
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
  inputCategoryName(e) {
    this.setData({
      newCategoryName: e.detail.value
    });
  },
  addCategory() {
    const name = this.data.newCategoryName.trim();
    if (!name) {
      wx.showToast({
        title: '请输入分类名称',
        icon: 'none'
      });
      return;
    }
    
    // 获取token
    const token = wx.getStorageSync('token');
    
    wx.request({
      url: 'http://10.168.5.20:5000/api/categories',
      method: 'POST',
      header: {
        'Authorization': token
      },
      data: { name: name },
      success: (res) => {
        wx.showToast({
          title: '分类添加成功',
          icon: 'success'
        });
        this.setData({
          newCategoryName: ''
        });
        this.fetchCategories();
      },
      fail: (err) => {
        console.error('添加分类失败:', err);
        wx.showToast({
          title: '分类添加失败',
          icon: 'none'
        });
      }
    });
  },
  editCategory(e) {
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;
    
    wx.showModal({
      title: '编辑分类',
      inputValue: name,
      editable: true,
      success: (res) => {
        if (res.confirm) {
          const newName = res.content.trim();
          if (newName) {
            // 获取token
            const token = wx.getStorageSync('token');
            
            wx.request({
              url: `http://10.168.5.20:5000/api/categories/${id}`,
              method: 'PUT',
              header: {
                'Authorization': token
              },
              data: { name: newName },
              success: (res) => {
                wx.showToast({
                  title: '分类编辑成功',
                  icon: 'success'
                });
                this.fetchCategories();
              },
              fail: (err) => {
                console.error('编辑分类失败:', err);
                wx.showToast({
                  title: '分类编辑失败',
                  icon: 'none'
                });
              }
            });
          }
        }
      }
    });
  },
  deleteCategory(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '删除分类',
      content: '确定要删除这个分类吗？',
      success: (res) => {
        if (res.confirm) {
          // 获取token
          const token = wx.getStorageSync('token');
          
          wx.request({
            url: `http://10.168.5.20:5000/api/categories/${id}`,
            method: 'DELETE',
            header: {
              'Authorization': token
            },
            success: (res) => {
              wx.showToast({
                title: '分类删除成功',
                icon: 'success'
              });
              this.fetchCategories();
            },
            fail: (err) => {
              console.error('删除分类失败:', err);
              wx.showToast({
                title: '分类删除失败',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  },
  addDish() {
    // 跳转到添加菜品页面
    wx.navigateTo({
      url: '/pages/add-dish/add-dish'
    });
  },
  editDish(e) {
    const id = e.currentTarget.dataset.id;
    // 这里可以实现编辑菜品的功能，打开一个新页面或弹窗
    wx.showToast({
      title: '编辑菜品功能开发中',
      icon: 'none'
    });
  },
  deleteDish(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '删除菜品',
      content: '确定要删除这个菜品吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: `http://10.168.5.20:5000/api/dishes/${id}`,
            method: 'DELETE',
            success: (res) => {
              wx.showToast({
                title: '菜品删除成功',
                icon: 'success'
              });
              this.fetchDishes();
            },
            fail: (err) => {
              console.error('删除菜品失败:', err);
              wx.showToast({
                title: '菜品删除失败',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  }
});