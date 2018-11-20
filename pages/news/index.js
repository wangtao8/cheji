// pages/lipeiInfo/index.js
var app = getApp()
var api = app.globalData.api
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var wss = app.globalData.wss
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    star: 5,//星数z
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    userMotai: true,
    allData2: [],
    sure: true,
    allData: null//得到的数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '加载中...',
    // })
    app.getUserId = res => {

    }
    // if (ids !== 9){//9自定义的数据  意义为事故咨询
    //   _this.getAllPtt(ids)
    // } else {
    //   _this.getAllPtt(7)
    // }
  },
  getAllPtt: function (e) {//得到对应类型下面的图片信息(富文本)
    var _this = this
    wx.request({//新闻案例接口
      url: api + 'api/v1/wx/notice/list',
      data: {
        "newsType": e
      },
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      success: function (res) {
        console.log('富文本2233：', res.data)
        var allPpts = res.data
        _this.setData({ allData: allPpts })
        wx.hideLoading()
      }
    })
  },
  getAllPtt2: function (e) {//得到对应类型下面的图片信息(富文本)
    var _this = this
    wx.request({//新闻案例接口
      url: api + 'api/v1/wx/notice/list',
      data: {
        "newsType": e
      },
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      success: function (res) {
        // console.log('富文本2233：', res.data)
        var allPpts = res.data
        _this.setData({ allData2: allPpts })
        // wx.hideLoading()
      }
    })
  },
  callImg: function (e) {
    wx.makePhoneCall({
      phoneNumber: '18888888888'
    })
  },
  callPhones: function (e) {
    wx.makePhoneCall({
      phoneNumber: '18888888888'
    })
  },
  goPptInfo: function (e) {//查看单条新闻详情
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../liPeiNews/index?id=' +id
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
    wx.showLoading({
      title: '新闻加载中',
    })
    this.getAllPtt2(8)
    this.getAllPtt(10)
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
  /**
   * 用户提交表单
   */
  formSubmit: function (e) {
    var _this = this
    var formValue = e.detail.value
    var userId = app.globalData.sessionId
    wx.showLoading({
      title: '提交中',
    })
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitudes = parseFloat(res.latitude)
        var longitudes = parseFloat(res.longitude)
        console.log(longitudes)
        var qqmapsdk = new QQMapWX({
          key: 'E6OBZ-I2YK6-QWESQ-MH3TB-OZUKO-THBPD' // 必填
        });
        qqmapsdk.reverseGeocoder({//逆地址解析
          location: {
            latitude: latitudes,
            longitude: longitudes
          },
          success: function (addressRes) {
            var address = addressRes.result.formatted_addresses.recommend//需要的地址
            console.log('查看逆解析的地址包括所有信息：', formValue.userPhone, formValue.userName, longitudes, latitudes, address)
            _this.uploadForm(formValue.userPhone, formValue.userName, longitudes, latitudes, address, userId)
            wx.hideLoading()
          }
        })
      }
    })
  }
})