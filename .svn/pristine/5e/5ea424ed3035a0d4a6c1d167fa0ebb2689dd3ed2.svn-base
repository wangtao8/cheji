// pages/vedioInfo/index.js
var app = getApp()
var api = app.globalData.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    srcs: null,
    markers: [],
    phones: null,
    index: 0,
    array: ['真实', '不真实', '未判断']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    var curId = options.curId//事故列表id
    var lat = parseFloat(options.lat)
    var lng = parseFloat(options.lng)
    var videoSrc = options.videoSrc
    var isHuaWei = videoSrc.indexOf('mp4') > -1 ? 1 : 0
    var userId = app.globalData.sessionId
    var userType = app.globalData.userType
    var unread = options.unread
    var reason = options.reason//审核失败的原因
    var phone = options.phone//推送爆料人的电话
    var sgId = options.sgId//事故id
    var realness = options.realness == 'undefined' ? 2 : options.realness//事故真实情况
    console.log('传递过来的信息：', options, lat, lng, curId, realness)
    var id = options.id// 为3显示为事故推送的页面 为1显示为我的推送列表的页面 两者的差别在于是否显示导航到现场的按钮
    var markers = [{
      id: 1
      , iconPath: "/images/location.png"
      , latitude: lat
      , longitude: lng
      , width: 15
      , height: 15
      , callout: {
        content: "事发地",
        fontSize: 8,
        padding: 4,
        borderRadius: 4,
        color: '#ffffff',
        bgColor: '#040000bf',
        display: 'ALWAYS'
      }
    }]
    console.log('是不是视频链接：', isHuaWei)
    _this.setData({ curId: curId, lat: lat, lng: lng, videoSrc: videoSrc, markers: markers, id: id, reason: reason, phones: phone, isHuaWei: isHuaWei, index: realness, sgId: sgId})
    // console.log('改变状态所需参数:', userId, curId, unread, unread == '未查看', _this.data.phones)
    if (userType && unread == '未查看') {
      _this.changeReadStauts(curId)
    }
    // console.log('设置过后的值：', _this.data.lat, _this.data.lng)
  },
  bindPickerChange: function(e){
    var _this = this
    var val = e.detail.value
    if(val == 2) {
      wx.showModal({
        title: '提示',
        content: '不能选择此项',
      })
    } else {
      wx.showLoading({
        title: '请稍等...',
      })
      _this.changeStatus(val)
    }
  },
  changeStatus: function (e) {//改变事故真实性
    var _this = this
    var userId = app.globalData.sessionId
    var sgId = _this.data.sgId//事故id
    wx.request({
      url: api + 'api/v1/wx/accid/changeRealness',
      data: {
        'id': sgId,
        'status': e,
        'thirdSessionKey': userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log('改变事故真实情况：', res.data)
        _this.setData({ index: e })
        wx.hideLoading()
      }
    })
  },
  lookImg: function () {//预览图片
    var temps = this.data.videoSrc
    var urls = []
    urls.push(temps)
    wx.previewImage({
      current: temps, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  makePhoneCall: function(){
    var phone = this.data.phones
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  changeReadStauts: function (e) {
    var _this = this
    var userId = app.globalData.sessionId
    var curId = e//事故id
    var userType = app.globalData.userType
    console.log('改变状态++++++++++++++++++++++++')
    wx.request({
      url: api + 'api/v1/wx/accids/pushRecord/updateStatus',
      data: {
        'thirdSessionKey': userId,
        'id': curId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('改变状态后的回调值：', res.data)
        if (res.data.errorCode == 5001) {
          wx.login({
            success: function (res) {
              // console.log(res)
              // 发起网络请求
              console.log('jsCode:', res.code)
              wx.request({
                url: api + 'api/v1/wx/getSession?code=' + res.code,
                success: function (ress) {
                  console.log('改变状态接收成功：', ress.data.data.sessionId)
                  app.globalData.sessionId = ress.data.data.sessionId
                  if (userType){
                    _this.changeReadStauts(curId)
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    var _this = this
    _this.mapCtx = wx.createMapContext('myMap')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideShareMenu()
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
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  daohang: function () {
    var _this = this
    var lat = _this.data.lat
    var lng = _this.data.lng
    wx.openLocation({
      latitude: lat,
      longitude: lng,
      scale: 28,
      success: function(e){
        console.log('11111:', e)
      },
      complete: function(e){
        console.log('22222:', e)
      }
    })
  },
  goNext: function(){
    wx.navigateTo({
      url: '../tab/index',
    })
  }
})