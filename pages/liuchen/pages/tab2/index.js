// pages/tab2/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchVal: null,//搜索值
    isChoose: false
  },
  changeVal: function(e){
    var val = e.detail.value
    this.setData({ searchVal: val })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  searchIcon: function () {
    console.log(this.data.searchVal)
  },
  choose: function (e) {
    var isChoose = this.data.isChoose
    var isChoose2 = !isChoose
    var lat = e.currentTarget.dataset.lat
    var lng = e.currentTarget.dataset.lng
    this.setData({ isChoose: isChoose2, lat: lat, lng: lng})
  },
  goLocation: function () {
    var isChoose = this.data.isChoose
    var lat = parseFloat(this.data.lat)
    var lng = parseFloat(this.data.lng)
    if (isChoose) {
      wx.openLocation({
        latitude: lat,
        longitude: lng,
        scale: 28
      })
    } else {
      wx.showToast({
        title: '还没选择去的地方哦',
        icon: 'none',
        duration: 1000
      })
    }
  },
  goNext: function (e) {
    wx.navigateTo({
      url: '../xieyi/index',
    })
  }
})