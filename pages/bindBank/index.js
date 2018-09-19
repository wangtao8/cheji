// pages/bindBank/index.js
var app = getApp()
var api = app.globalData.api
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  formSubmit: function (e) {
    var _this = this
    wx.showModal({
      title: '提示',
      content: '银行卡与您结算有关，如户名卡号不对应会导致入账失败！',
      cancelText: '我再看看',
      confirmText: '没问题',
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          var submitData = e.detail.value
          console.log('form发生了submit事件，携带数据为：', submitData)
          var userId = app.globalData.sessionId || 'x'
          submitData.thirdSessionKey = userId
          wx.showLoading({
            title: '请稍等...',
          })
          if (submitData.bankcard.length >= 15) {
            _this.bindBank(submitData)
          } else {
            wx.showToast({
              title: '请输入正确的银行卡号',
              icon: 'none'
            })
          }
        }
      }
    })
  },
  bindBank: function(e){
    var _this = this
    wx.request({
      url: api + 'api/v1/wx/open/claimer/bindCard',
      data: e,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res){
        if (res.data.errorCode == 5001) {
          console.log('绑定银行卡的信息：', res.data)
          wx.login({
            success: function (res) {
              if (res.code) {
                // console.log(res)
                // 发起网络请求
                wx.request({
                  url: api + 'api/v1/wx/getSession?code=' + res.code,
                  success: function (ress) {
                    app.globalData.sessionId = ress.data.data.sessionId
                    _this.bindBank()
                  }
                })
              }
            }
          })
        } else {
          if(res.data.errorCode == 0) {
            wx.showToast({
              title: '绑定成功!',
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          } else {
            wx.showToast({
              title: '出现了未知的问题，请稍后重试！',
              icon: 'none'
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ids = options.ids
    this.setData({ids : ids})
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

  }
})