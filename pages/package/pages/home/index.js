var app = getApp()
var api = app.globalData.api
Page({
  data: {
    money: (Math.floor(Math.random() * 100000)).toString(),
    Moneys: {
      balance: "0",
      income: "0"
    },
    nums: 100
  },
  onLoad: function (options) {
    var id = options.id
    this.setData({id : id})
    console.log('页面的currentTab：', id)
    app.getUserId = res => {
      
    }
  },
  onShow: function () {
    var _this = this
    var id = this.data.id
    if (id == 1) {//客户端口
      _this.getAllCount()
    } else {//修理厂端口
      _this.getAllCount2()
    }
  },
  getPhoneNumber: function (e) {
  },
  getAllCount: function () {
    var userId = app.globalData.sessionId
    var _this = this
    wx.request({
      url: api + 'api/v1/wx/maintain/user/order/count/get',
      data: {
        'thirdSessionKey': userId
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log('查询总共的数量:', res.data)
        _this.setData({ dataCount: res.data.data })
      }
    })
  },
  getAllCount2: function () {
    var userId = app.globalData.sessionId
    var _this = this
    wx.request({
      url: api + 'api/v1/wx/maintain/repaireman/order/count/get',
      data: {
        'thirdSessionKey': userId
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log('查询总共的数量:', res.data)
        _this.setData({ dataCount: res.data.data })
      }
    })
  },
  goInfo: function (e) {//跳转到理赔详情页
    var _this = this
    var id = e.currentTarget.dataset.id//代表自己的curenttable
    var fenlei = this.data.id//代表是从哪个端口进来的 1代表客户 2代表修理厂
    wx.navigateTo({
      url: '../stuatsList/index?status=' + id + '&fenlei=' + fenlei
    })
  },
  lookMoney: function (e) {
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