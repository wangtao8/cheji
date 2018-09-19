var app = getApp()
var api = app.globalData.api
Page({
  data: {
    money: (Math.floor(Math.random()*100000)).toString(),
    Moneys: {
      balance: "0",
      income: "0"
    }
  },
  onLoad: function(){
    
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
      title: '加载小金库中...',
    })
    _this.getMoneyTed()
  },
  getPhoneNumber: function (e) {
  },
  goInfo: function(e){//跳转到理赔详情页
    var _this = this
    var id = e.currentTarget.dataset.id
    if (id == 6) {
      wx.navigateTo({
        url: '/pages/peifuorder/index?ids=' + id
      })
    } else if (id == 7) {
      wx.navigateTo({
        url: '/pages/peifuorderList/index?ids=' + id
      })
    } else if(id == 8){
      wx.navigateTo({
        url: '/pages/recharge/index'
      })
    } else {
      wx.navigateTo({
        url: '/pages/peifuAllOrder/index?status=' + id
      })
    }  
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