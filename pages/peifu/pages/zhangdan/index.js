// pages/zhangdan/index.js
var app = getApp()
var api = app.globalData.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 0,
    allData: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  getMoneyInfo: function(e){
    var _this = this
    var userId = app.globalData.sessionId
    var pageIndex = _this.data.pageIndex + 1
    var pageSizes = 10 + 10 * pageIndex

    wx.showNavigationBarLoading()
    wx.request({
      url: api + 'api/v1/wx/open/claimer/yckmx/get',
      data: {
        'thirdSessionKey': userId,
        'limit': e == 1 ? 10 : 20,
        'offset': e == 1 ? pageSizes : 0
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.errorCode == 5001) {
          wx.login({
            success: function (res) {
              if (res.code) {
                wx.request({
                  url: api + 'api/v1/wx/getSession?code=' + res.code,
                  success: function (ress) {
                    app.globalData.sessionId = ress.data.data.sessionId
                    _this.getMoneyInfo(0)
                  }
                })
              }
            }
          })
        } else {
          if (e == 0) {//刷新的情况
            var content = res.data.data.records
            var pageAll = res.data.data.total
            // console.log('点击时得到的数据：', content)
            for(var i = 0; i < content.length; i++) {
              var newData = content[i].createTime
              var dataBefore = newData.split(" ")[0]
              var dataAfter = newData.split(" ")[1]
              content[i].dataBefore = dataBefore
              content[i].dataAfter = dataAfter
            }
            console.log('content:', content)
            _this.setData({
              allData: content,
              pageAll: pageAll,
              pageIndex: 0
            })
          } else {//上拉的情况
            console.log('账单上拉:', res.data)
            var pageAll = res.data.data.total
            var nowData = res.data.data.records
            var dataList = _this.data.allData
            for (var i = 0; i < nowData.length; i++) {
              dataList.push(nowData[i])
            }
            _this.setData({
              allData: dataList,
              pageAll: pageAll,
              pageIndex: pageIndex,
              pageSize: pageSizes
            })
          }

          wx.hideLoading()
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
        }
      }
    })
    // var userId = app.globalData.sessionId || 'x'
    // wx.request({
    //   url: api + 'api/v1/wx/open/claimer/yckmx/get',
    //   data: {
    //     "thirdSessionKey": userId
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   success: function(e){
    //     console.log('查询充值记录：', e)
    //   }
    // })
  },
  goAddMoney: function(){
    wx.navigateTo({
      url: '../recharge/index',
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
    this.getMoneyInfo(0)
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
    this.getMoneyInfo(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMoneyInfo(1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})