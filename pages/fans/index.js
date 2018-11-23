// pages/fans/index.js
var app = getApp()
var api = app.globalData.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
     pageIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this

    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        _this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getFansNums: function(e){//获得粉丝数
    var _this = this
    var userId = this.data.userId;
    wx.request({
      url: api + 'api/v1/wx/fans/counts/get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'thirdSessionKey': userId
      },
      success: function(res){
        if (res.data.errorCode == 5001) {
          wx.login({
            success: function (res) {
              if (res.code) {
                // console.log(res)
                // 发起网络请求
                console.log('重新获得jsCode333:', res.code)
                wx.request({
                  url: api + 'api/v1/wx/getSession?code=' + res.code,
                  success: function (ress) {
                    app.globalData.sessionId = ress.data.data.sessionId
                    _this.getFansNums()
                  }
                })
              }
            }
          })
        } else {
          console.log('获得粉丝数：', res.data.data.fansCount)
          var fansCount = res.data.data.fansCount
          _this.setData({ fansCount: fansCount})
          _this.getFansMoney()
          _this.getExtraMoney()
          _this.getFansInfo(0)
        }
      }
    })
  },
  getFansMoney: function (e) {//获得总共奖金
    var _this = this
    var userId = this.data.userId;
    wx.request({
      url: api + 'api/v1/wx/fans/redpack/counts/get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'thirdSessionKey': userId
      },
      success: function (res) {
        console.log('获得奖金总额：', res.data.data.redpackSum)
        var redpackSum = res.data.data.redpackSum
        _this.setData({ redpackSum: redpackSum})
      }
    })
  },
  getExtraMoney: function (e) {//获得总共提成
    var _this = this
    var userId = this.data.userId;
    wx.request({
      url: api + 'api/v1/wx/fans/redpack/percentage/count',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'thirdSessionKey': userId
      },
      success: function (res) {
        console.log('获得提成：', res.data.data.redPackPercentage)
        var redPackPercentage = res.data.data.redPackPercentage
        _this.setData({ redPackPercentage: redPackPercentage})
      }
    })
  },
  scrollBottom: function(e){
    var pageIndex = this.data.pageIndex + 1
    var allPages = this.data.allPages
    var _this = this
    this.setData({ pageIndex: pageIndex})
    if (pageIndex >= allPages) {
      wx.showToast({
        title: '已加载所有信息'
      })
    } else {
      _this.getFansInfo(pageIndex)
    }
  },
  getFansInfo: function(types){
    var _this = this
    var userId = this.data.userId;
    wx.request({
      url: api + 'api/v1/wx/fans/redpack/list',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'thirdSessionKey': userId,
        'limit': 5,//每一页显示多少条
        'offset': types == 0 ? 0 : types*5//从当前多少条开始
      },
      success: function (res) {
        console.log('获得粉丝的详情：', res.data.data)
        var records = res.data.data.records
        var pages = res.data.data.pages
        if (types == 0) {
          _this.setData({ records: records, allPages: pages})
        } else {
          var record = _this.data.records
          for (var i = 0; i < records.length; i++) {
            record.push(records[i])
          }
          _this.setData({ records: record })
        }
      }
    })
  },
  getUserInfo: function (e) {
    console.log('手动获取的参数:', e.detail.rawData)
    var _this = this
    if (e.detail.rawData) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      var avatarUrl = e.detail.userInfo.avatarUrl
      var nickName = e.detail.userInfo.nickName
      _this.pullUserInfo(avatarUrl, nickName)
    }
  },
  pullUserInfo: function (avatarUrl, nickName) {
    var userId = app.globalData.sessionId
    wx.request({
      url: api + 'api/v1/wx/userinfo/bind',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        'headImg': avatarUrl,
        'wxname': nickName,
        'thirdSessionKey': userId
      },
      success: function (res) {
        console.log('上传用户头像情况：', res.data)
      }
    })
  },
  lookImage:function(e){
    var url = e.currentTarget.dataset.url
    var urls = []
    urls.push(url)
    wx.previewImage({
      urls: urls,
      current: url
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
    var _this = this
    var userId = app.globalData.sessionId
    if (userId) {
      _this.setData({ userId: userId, api: api })
      _this.getFansNums()
    } else {
      app.getUserId = res => {
        _this.getFansNums()
        _this.setData({ userId: res, api: api })
      }
    }
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