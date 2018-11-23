// pages/processItr/pages/processItrList/index.js
var app = getApp()
var api = app.globalData.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['理赔明细', '理赔照片', '理赔资料'],
    currentTab: 0,//tab页的下标
    array: ['未接车','已接车', '已交车', '已结算'],
    index: 0,
    images: null,
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    var index
    var allDatas = JSON.parse(decodeURIComponent(options.allData))
    console.log('这边页面接收的数据：', allDatas)
    if (allDatas.statusName == '服务中') {

      _this.setData({ array: ['已接车', '已交车']})

    } else if (allDatas.statusName == '已交车') {

      _this.setData({ array: ['已交车', '已结算'] })

    } else if (allDatas.statusName == '已结算') {

      _this.setData({ array: ['已结算'] })

    } else {

      _this.setData({ array: ['未接车', '已接车'] })
      
    }
    this.setData({ allDatas: allDatas})
    app.getUserId = res => {
      
    } 
  },
  goBack: function(){
    this.goChangeBack()
  },
  sureSaveCar: function () {//确认接车
    var userId = app.globalData.sessionId
    var id = this.data.allDatas.id
    wx.request({
      url: api + 'api/v1/wx/openClaim/partner/accept',
      data: {
        'thirdSessionKey': userId,
        'id': id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('更改状态--确认接车：', res.data)
      }
    })
  },
  outThisCar: function () {//确认交车
    var userId = app.globalData.sessionId
    var id = this.data.allDatas.id
    wx.request({
      url: api + 'api/v1/wx/openClaim/partner/placed',
      data: {
        'thirdSessionKey': userId,
        'id': id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('更改状态--确认交车：', res.data)
      }
    })
  },
  carMoneyPay: function () {//已结算
    var userId = app.globalData.sessionId
    var id = this.data.allDatas.id
    wx.request({
      url: api + 'api/v1/wx/openClaim/partner/settle',
      data: {
        'thirdSessionKey': userId,
        'id': id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('更改状态--已结算：', res.data)
      }
    })
  },
  moneyChange: function(e){//改变定损金额
    var money = e.detail.value
    var userId = app.globalData.sessionId
    var id = this.data.allDatas.id
    wx.request({
      url: api + 'api/v1/wx/openClaim/partner/addFixloss',
      data: {
        'thirdSessionKey': userId,
        'id': id,
        'fixloss': money
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('更改定损金额：', res.data)
      }
    })
  },
  noCar: function () {//未接车
    var userId = app.globalData.sessionId
    var id = this.data.allDatas.id
    wx.request({
      url: api + 'api/v1/wx/openClaim/partner/unaccept',
      data: {
        'thirdSessionKey': userId,
        'id': id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('更改状态--未接车：', res.data)
      }
    })
  },
  goChangeBack: function(){
    var userId = app.globalData.sessionId
    var _this = this
    wx.request({
      url: api + 'api/v1/wx/openClaim/logout',
      data: {
        'thirdSessionKey': userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('退出登陆返回结果：', res.data)
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
                    _this.goChangeBack()
                  }
                })
              }
            }
          })
        } else {
          wx.reLaunch({
            url: '/pages/my/index'
          })
        }
      }
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var array = this.data.array
    var index = e.detail.value
    var nowData = array[index]
    var _this = this
    console.log('nowData:', nowData)
    if (nowData == '已接车') {
      _this.sureSaveCar()
    } else if (nowData == '已交车') {
      _this.outThisCar()
    } else if (nowData == '已结算') {
      _this.carMoneyPay()
    } else {
      _this.noCar()
    }
    this.setData({
      index: e.detail.value
    })
  },
  navbarTap: function (e) {//列表切换
    var _this = this
    var index = e.currentTarget.dataset.idx
    var userId = app.globalData.sessionId
    var ids = _this.data.ids
    var num = Math.floor(Math.random() * 10)
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
      images: num
    })
  },
  lookImage: function(e){
    var nowIndex = e.currentTarget.dataset.now
    var index = e.currentTarget.dataset.index
    var _this = this
    var urls
    if (nowIndex == 1) {
      urls = _this.data.allDatas.claimImgList
    } else {
      urls = _this.data.allDatas.detailImgList
    }
    wx.previewImage({
      current: urls[index],
      urls: urls
    })
    console.log(index)
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