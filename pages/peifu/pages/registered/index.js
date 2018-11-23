// pages/registered/index.js
var app = getApp()
var api = app.globalData.api
Page({
  /**
   * 页面的初始数据
   */
  data: {
    region: ['四川省', '成都市', '锦江区']
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
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
  formSubmit: function(e){
    // console.log(e.detail.value)
    wx.showLoading({
      title: '注册中...',
    })
    var userId = app.globalData.sessionId || 'x'
    var dataAll = e.detail.value
    var name = dataAll.username
    var phone = dataAll.userphone
    var province = dataAll.city.split('，')[0]
    var city = dataAll.city.split('，')[1]
    var area = dataAll.city.split('，')[2]
    if(name && phone) {
      wx.request({
        url: api + 'api/v1/wx/open/claimer/register',
        data: {
          'name': name,
          'phone': phone,
          'province': province,
          'city': city,
          'area': area,
          'thirdSessionKey': userId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          console.log('注册结果：', res.data)
          if (res.data.errorCode == 0) {
            wx.showToast({
              title: '注册成功!',
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
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
        title: '请填写用户名及手机号！',
        icon: 'none'
      })
    }
    // console.log(name, phone, province, city, area, userId)
    
  },
  getPhoneNumber: function (e) {
    var _this = this
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    var userId = app.globalData.sessionId
    wx.request({
      url: api + 'api/v1/wx/decodeUserInfo',
      data: {
        'sessionId': userId,
        'iv': e.detail.iv,
        'encryptedData': e.detail.encryptedData
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log('获取用户电话：', JSON.parse(res.data.data).phoneNumber)
        var phone = JSON.parse(res.data.data).phoneNumber
        _this.setData({ phone: phone })
      }
    })
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