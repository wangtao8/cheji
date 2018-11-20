// pages/liPeiNews/index.js
var WxParse = require('../../utils/wxParse.js');
var app = getApp()
var api = app.globalData.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newVal: null//新闻信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    var id = options.id
    this.setData({id:id})
    console.log('接收的id:', id)
    this.getLiulan()
    this.getAllPtt(id)
  },
  getAllPtt: function (e) {//得到对应类型下面的图片信息(富文本)
    var _this = this
    wx.request({//新闻案例接口
      url: api + 'api/v1/wx/notice/list',
      data: {
        "id": e
      },
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      success: function (res) {
        // console.log('富文本2233：', res.data[0].content)
        var allPpts = res.data[0]
        var htmls = allPpts.content
        WxParse.wxParse('article', 'html', htmls, _this, 5);
        _this.setData({ newVal: allPpts})
        wx.hideLoading()
      }
    })
  },
  getLiulan: function (e) {//得到浏览量
    var _this = this
    var userId = app.globalData.sessionId
    var id = this.data.id
    wx.request({//新闻案例接口
      url: api + 'api/v1/wx/notice/updatepv',
      data: {
        "thirdSessionKey": userId,
        'id': id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        // console.log('更新浏览量状态：', res)
        // _this.setData({ allData2: allPpts })
      }
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
      title: '加载中',
    })
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
  
  }
})