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
    windowShow: false,//弹出框
    allData: null,//得到的数据
    isClick: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '加载中...',
    // })
    var _this = this
    var ids = options.ids//理赔类型
    console.log('ids:', ids)
    _this.setData({ ids: ids })
    wx.getSystemInfo({
      success(res) {
        var PmHeight = res.windowHeight
        var elTop = PmHeight - 240 + 'rpx'
        console.log('PmHeight:', PmHeight)
        _this.setData({ elTop: elTop})
      }
    })
    // if (ids !== 9){//9自定义的数据  意义为事故咨询
    //   _this.getAllPtt(ids)
    // } else {
    //   _this.getAllPtt(7)
    // }
  },
  lookScrollChange: function(e) {//监听滚动条滚动
    var scrollTop = e.detail.scrollTop
    var _this = this
    if (scrollTop > 50) {
      _this.setData({ showZXBtn: true, isBottom: 0})
    } else {
      _this.setData({ showZXBtn: false, isBottom: '-128rpx' })
    }
    // console.log(e.detail.scrollTop)
  },
  NowZXBtn: function(){//立即咨询按钮事件
    this.setData({ windowShow: true})
  },
  closeWindow: function(){//关闭咨询窗口
    this.setData({ windowShow: false})
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
  callImg: function(e){
    wx.makePhoneCall({
      phoneNumber: '13348880288'
    })
  },
  callPhones:function(e){
    wx.makePhoneCall({
      phoneNumber: '13348880288'
    })
  },
  goPptInfo: function (e) {//查看单条新闻详情
    var val = e.currentTarget.dataset.value
    var newVal = {}
    for (var nam in val) {
      // console.log(nam)
      if (nam == 'content') {
        console.log(1)
        val[nam] = encodeURIComponent(val[nam])
        newVal.content = val[nam]
      } else {
        console.log(2)
        newVal[nam] = val[nam]
      }
    }
    console.log('newVal:', newVal)
    wx.navigateTo({
      url: '../liPeiNews/index?val=' + JSON.stringify(newVal)
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
  /**
   * 用户提交表单
   */
  formSubmit: function(e){
    var _this = this
    var formValue = e.detail.value
    var userId = app.globalData.sessionId
    _this.setData({ isClick: false })
    wx.showLoading({
      title: '提交中',
    })
    if (formValue.userPhone && formValue.userName) {
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
            }
          })
        }
      })
    } else {
      _this.setData({ isClick: true })
      wx.showToast({
        title: '请完善您的个人信息',
        icon: 'none'
      })
    }
  },
  uploadForm: function (userPhone, userName, longitudes, latitudes, address, userId){
    /*
    *type 值=0为事故代办 值=1为无损赔付 值=2为人伤垫付 值=3为交单理赔 值=4为法律服务 值=5为现场理赔
    */
    var _this = this
    var types = this.data.ids
    console.log('types:', types)
    wx.request({
      url: api + 'api/v1/wx/claim/add',
      data: {
        'phone': userPhone,
        'name': userName,
        'lng': longitudes,
        'lat': latitudes,
        'address': address,
        'thirdSessionKey': userId,
        'type': types
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(e){
        console.log('上传用户信息结果：', e)
        if (e.data.errorCode == 5001) {

        } else {
          _this.setData({ windowShow: false, isClick: true })
          wx.showToast({
            title: '提交成功，请等待答复',
            icon: 'none'
          })
          wx.hideLoading()
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },1000)
        }
      }
    })
  }
})