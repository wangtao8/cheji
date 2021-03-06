// pages/recharge/index.js
var app = getApp()
var api = app.globalData.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: [100,200,500,1000],
    k: null,
    moneyYes: null,
    isFocus: false//是否获得焦点
  },
  chooseM: function(e){
    var ids = e.currentTarget.dataset.id
    var moneyYes = this.data.money[ids]
    this.setData({ k: ids, moneyYes: moneyYes })

    isFocus: false
  },
  chooseM: function(e){
    var ids = e.currentTarget.dataset.id
    var moneyYes = this.data.money[ids]
    this.setData({ k: ids, moneyYes: moneyYes })
  },
  getFocus: function(e){
    this.setData({ isFocus: true})
  },
  getBlur: function(e){
    this.setData({ isFocus: false })
  },
  chooseVal: function(e){
    var val = parseInt(e.detail.value)
    this.setData({ moneyYes: val, k: null})
  },
  rechargeBtn: function(e){
    var moneyYes = parseInt(this.data.moneyYes)
    if (!!moneyYes){
      var userId = app.globalData.sessionId
      wx.request({
        url: api + 'api/v1/wx/open/wxpay/unifiedOrder',
        data: {
          "thirdSessionKey": userId,
          "amount": moneyYes
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (e) {
          console.log('充值接口返回的参数：', e.data.data)
          var needData = e.data.data
          var nonceStr = needData.nonceStr
          var prepay_id = 'prepay_id=' + needData.prepay_id
          var sign = needData.sign
          var signType = needData.signType
          var timeStamp = needData.timeStamp
          // 支付接口
          wx.requestPayment({
            'timeStamp': timeStamp,
            'nonceStr': nonceStr,
            'package': prepay_id,
            'signType': 'MD5',
            'paySign': sign,
            'success': function (res) {
              wx.showToast({
                title: '充值成功！',
                icon: 'success'
              })
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1
                })
              },1000)
              console.log('支付成功返回的信息：', res)
            },
            'fail': function (res) {
              console.log('支付失败返回的信息：', res)
            },
            'complete': function (res) { }
          })
        }
      })
    } else {
      wx.showToast({
        title: '请输入金额',
        icon: 'none'
      })
    }
    console.log(moneyYes)
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

  }
})