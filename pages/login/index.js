// pages/registered/index.js
var app = getApp()
var api = app.globalData.api
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getUserId = res => {
      console.log('接收到的userID:', res)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  formSubmit: function(e){
    // console.log(e.detail.value)
    wx.showLoading({
      title: '登陆中...',
    })
    var userId = app.globalData.sessionId || 'x'
    var dataAll = e.detail.value
    var account = dataAll.username
    var password = dataAll.password
    if (account && password) {
      wx.request({
        url: api + 'api/v1/wx/openClaim/login',
        data: {
          'account': account,
          'password': password,
          'thirdSessionKey': userId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log('登陆结果：', res.data)
          if (res.data.errorCode == 0) {
            wx.showToast({
              title: '登陆成功！',
            })
            setTimeout(function () {
              wx.redirectTo({
                url: "../processItr/pages/peifu/index",
              })
            }, 1000)
          } else {
            wx.showToast({
              title: res.data.errorMsg,
              icon: 'none'
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请填写用户名及密码！',
        icon: 'none'
      })
    }
    // console.log(name, phone, province, city, area, userId)
    
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