var app = getApp()
var api = app.globalData.api
Page({
  data: {
    money: (Math.floor(Math.random()*100000)).toString(),
    Moneys: {
      balance: "0",
      income: "0"
    },
    nums: 100,
    wan: 0
  },
  onLoad: function(){
    app.getUserId = res => {

    }
  },
  getMoneyTed: function(){
    var userId = app.globalData.sessionId
    var _this = this
    wx.request({
      url: api + 'api/v1/wx/open/claimer/order/income/get',
      data: {
        'thirdSessionKey': userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (e) {
        if (e.data.errorCode == 5001) {
          wx.login({
            success: function (res) {
              if (res.code) {
                wx.request({
                  url: api + 'api/v1/wx/getSession?code=' + res.code,
                  success: function (ress) {
                    app.globalData.sessionId = ress.data.data.sessionId
                    _this.getMoneyTed()
                  }
                })
              }
            }
          })
        } else {
          console.log('获得的金额是：', e.data)
          _this.setData({Moneys: e.data.data})
          wx.hideLoading()
        }
      }
    })
  },
  onShow: function () {
    var _this = this
    wx.showLoading({
      title: '加载中...',
    })
    // _this.getMoneyTed()
    _this.getAllCount()
  },
  goBack: function () {
    this.goChangeBack()
  },
  goChangeBack: function () {
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
  getPhoneNumber: function (e) {
  },
  getAllCount: function(){
    var userId = app.globalData.sessionId
    var _this = this
    wx.request({
      url: api + 'api/v1/wx/open/claimer/order/count/FS/get', 
      data: {
        'thirdSessionKey': userId
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log('查询总共的数量:', res.data)
        if (res.data.errorCode == 5001) {
          wx.login({
            success: function (res) {
              if (res.code) {
                wx.request({
                  url: api + 'api/v1/wx/getSession?code=' + res.code,
                  success: function (ress) {
                    app.globalData.sessionId = ress.data.data.sessionId
                    _this.getAllCount(0)
                  }
                })
              }
            }
          })
        } else {
          var wan,wans
          if (parseInt(res.data.data.fixlossCount).toString().length > 4) {
            wans = parseFloat(Math.round(res.data.data.fixlossCount / 100) / 100)
            _this.setData({ dataCount: res.data.data, wans: wans})
          } else {
            wan = parseFloat(Math.round(res.data.data.fixlossCount * 100) / 100)
            _this.setData({ dataCount: res.data.data, wan: wan })
          }
          console.log('最后的金额是：', wans,wan, res.data.data.fixlossCount)
          wx.hideLoading()
        }
      }
    })
  },
  goInfo: function(e){//跳转到理赔详情页
    var _this = this
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../peifuAllOrder/index?status=' + id
    })
     
  },
  lookMoney: function(e){
    var id = e.currentTarget.dataset.id
    if (id == 1) {
      wx.navigateTo({
        url: '../zhangdan/index',
      })
    } else {
      wx.navigateTo({
        url: '../myBankShow/index',
      })
    }
    
    console.log(e.currentTarget.dataset.id)
    
  }
})