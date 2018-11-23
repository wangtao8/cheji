// pages/fourSInfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://chejiqiche.com/video/notice/timg.jpg',
      'https://chejiqiche.com/video/notice/timg2.jpg',
      'https://chejiqiche.com/video/notice/timg3.jpg',
      'https://chejiqiche.com/video/notice/timg9.jpg',
      'https://chejiqiche.com/video/notice/timg10.jpg',
      'https://chejiqiche.com/video/notice/timg11.jpg',
      'https://chejiqiche.com/video/notice/timg12.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 1500,
    duration: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('fourSinfo里面接收到的数据：', JSON.parse(options.dataList))
    var dataAll = JSON.parse(options.dataList)
    var huanjing = dataAll.detailImg
    var indexImg = dataAll.indexImg
    this.setData({ dataAll: dataAll, huanjing: huanjing, indexImg: indexImg})
  },
  lookImage: function(e){
    var index = e.currentTarget.dataset.id
    var urls = this.data.huanjing
    wx.previewImage({
      current: urls[index],
      urls: urls
    })
  },
  lookFirst: function(e){
    var urls = []
    urls[0] = this.data.indexImg
    wx.previewImage({
      current: this.data.indexImg,
      urls: urls
    })
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
  callImg: function (e) {
    wx.makePhoneCall({
      phoneNumber: '13348880288'
    })
  },
  goLocation: function(e) {
    var lat = e.currentTarget.dataset.lat
    var lng = e.currentTarget.dataset.lng
    wx.openLocation({
      latitude: lat,
      longitude: lng,
      scale: 28
    })
  }
})