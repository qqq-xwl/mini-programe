Page({
  data: {
    cart: [],
    totalPrice: 0
  },
  onLoad() {
    this.loadCart();
  },
  onShow() {
    this.loadCart();
  },
  loadCart() {
    const cart = wx.getStorageSync('cart') || [];
    this.setData({
      cart: cart
    });
    this.calculateTotal();
  },
  calculateTotal() {
    const cart = this.data.cart;
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;
    });
    this.setData({
      totalPrice: total
    });
  },
  decreaseQuantity(e) {
    const index = e.currentTarget.dataset.index;
    const cart = this.data.cart;
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      this.setData({
        cart: cart
      });
      wx.setStorageSync('cart', cart);
      this.calculateTotal();
    }
  },
  increaseQuantity(e) {
    const index = e.currentTarget.dataset.index;
    const cart = this.data.cart;
    cart[index].quantity += 1;
    this.setData({
      cart: cart
    });
    wx.setStorageSync('cart', cart);
    this.calculateTotal();
  },
  deleteItem(e) {
    const index = e.currentTarget.dataset.index;
    const cart = this.data.cart;
    cart.splice(index, 1);
    this.setData({
      cart: cart
    });
    wx.setStorageSync('cart', cart);
    this.calculateTotal();
  },
  goToOrder() {
    // 保存购物车数据到本地存储，供订单页面使用
    wx.setStorageSync('orderCart', this.data.cart);
    wx.setStorageSync('orderTotal', this.data.totalPrice);
    
    wx.navigateTo({
      url: '/pages/order/order'
    });
  }
});