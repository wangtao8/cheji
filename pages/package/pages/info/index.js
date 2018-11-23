// pages/package/pages/info/index.js
var app = getApp();
var api = app.globalData.api
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showNow: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dataAll = JSON.parse(decodeURIComponent(options.data))
    console.log('dataAll:', dataAll)
    var _this = this
    app.getUserId = res => {

    }
    wx.getSystemInfo({
      success(res) {
        var PmHeight = res.windowHeight
        var elTop = PmHeight - 240 + 'rpx'
        console.log('PmHeight:', PmHeight)
        _this.setData({ elTop: elTop, dataAll: dataAll})
      }
    })
  },
  yesFourSHellpMe: function () {
    this.setData({ showNow: true })
  },
  formSubmit: function (e) {
    wx.showLoading({
      title: '请稍后',
    })
    var _this = this
    var id = this.data.dataAll.id
    var price = this.data.dataAll.price
    var name = e.detail.value.name
    var phone = e.detail.value.phone
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        console.log('定位的经纬度：', latitude, longitude)
        var qqmapsdk = new QQMapWX({
          key: 'E6OBZ-I2YK6-QWESQ-MH3TB-OZUKO-THBPD' // 必填
        });
        qqmapsdk.reverseGeocoder({ //逆地址解析
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (addressRes) {
            var address1 = addressRes.result.formatted_addresses.recommend //需要的地址
            var component = addressRes.result.address_component
            var province = component.province
            var city = component.city
            var address = province + city + address1 //未处理的地址
            console.log('最后的地址及需要用到的信息：', address)
            if (name == '') {
              wx.showToast({
                title: '请输入您的姓名',
                icon:'none'
              })
              return false
            }
            if (phone == ''){
              wx.showToast({
                title: '请输入手机号',
                icon: 'none'
              })
              return false
            }
            _this.order(id, phone, price, name, longitude, latitude, address)
          },
          fail: function (e) {
            console.log('错误：', e)
          }
        })
      },
      fail: function(err){
        console.log('err:', err)
        wx.showModal({
          title: '下单提示',
          content: '请点击打开授权页，勾选使用地址',
        })
        wx.hideLoading()
      }
    })
  },
  order: function (packageid, phone, price, name,  lng, lat, address){
    var userId = app.globalData.sessionId
    var _this = this
    wx.request({
      url: api + 'api/v1/wx/bizMaintainPackageOrder/add',
      data: {
        "thirdSessionKey": userId,
        "packageid": packageid,
        "phone": phone,
        "price": price,
        "name": name,
        "lng": lng,
        "lat": lat,
        "address": address
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res){
        console.log('下单结果：', res.data)
        if(res.data.errorCode == 0) {
          wx.showToast({
            title: '下单成功',
            icon: 'success'
          })
          _this.setData({ showNow: true})
        }
      }
    })
  },
  nowOrder: function(){
    this.setData({ showNow: false })
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