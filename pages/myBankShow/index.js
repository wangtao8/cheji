// pages/myBankShow/index.js
var app = getApp()
var api = app.globalData.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankUserName: '无',
    bankcard: '无'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
  },
  editBank: function(e){
    var ids = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../bindBank/index?ids='+ids
    })
  },

  getAllUserInfo: function () {//获取用户的所有信息
    var _this = this
    var userId = app.globalData.sessionId
    wx.request({
      url: api + 'api/v1/wx/user/get',
      data: {
        'thirdSessionKey': userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('获得所有信息222：', res.data)
        if (res.data.errorCode == 5001) {
          wx.login({
            success: function (res) {
              if (res.code) {
                // console.log(res)
                // 发起网络请求
                console.log('重新获得jsCode222:', res.code)
                wx.request({
                  url: api + 'api/v1/wx/getSession?code=' + res.code,
                  success: function (ress) {
                    app.globalData.sessionId = ress.data.data.sessionId
                    _this.getAllUserInfo()
                  }
                })
              }
            }
          })
        } else {
          var bankUserName = res.data.data.bankUserName.substr(-1) || '无'
          var bankcard = res.data.data.bankcard.substr(-4) || '无'
          _this.setData({
            bankUserName: bankUserName,
            bankcard: bankcard
          })
          wx.hideLoading()
        }
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
    this.getAllUserInfo()
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