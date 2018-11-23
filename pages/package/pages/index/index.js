// pages/package/pages/index/index.js
var app = getApp();
var api = app.globalData.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getUserId = res => {

    }
    var pageIndex = this.data.pageIndex
    console.log('pageIndex:', pageIndex)
    wx.showLoading({
      title: '加载套餐中...',
    })
    this.searchTc(pageIndex)
  },
  /**
   * 查询套餐
   */
  searchTc: function(e){
    var userId = app.globalData.sessionId
    var _this = this
    console.log('offset:', e == 1)
    wx.request({
      url: api + 'api/v1/wx/bizMaintainPackage/list',
      data: {
        'thirdSessionKey': userId,
        'limit': 5,//每一页显示多少条
        'offset': e == 1 ? 0 : (e-1)*5//从当前多少条开始
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      success: function(res){
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
                    _this.searchTc(e)
                  }
                })
              }
            }
          })
        } else {
          var cont = res.data.data.records
          var total = res.data.data.total
          console.log('查询套餐：', res.data.data.records)
          if (e == 1) {
            _this.setData({ cont: cont, total: total})
          } else {
            var conts = _this.data.cont
            for (var i = 0; i < cont.length; i++){
              conts.push(cont[i])
            }
            _this.setData({ cont: conts, total: total})
          }
          wx.hideLoading()
        }
      }
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
    var pageIndex = this.data.pageIndex + 1
    var total = this.data.total
    var pageSize = Math.ceil(total / 5)
    var _this = this
    console.log('pageIndex:', pageIndex, 'pageSize:', pageSize)
    if (pageIndex <= pageSize) {
      _this.searchTc(pageIndex)
      _this.setData({ pageIndex: pageIndex })
    } else {
      wx.showToast({
        title: '没有更多了',
        icon:'none'
      })
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goInfo: function(e){
    var val = e.currentTarget.dataset.val
    var itemDataString = encodeURIComponent(JSON.stringify(val))//字符串拼接
    console.log('itemDataString:', itemDataString)
    wx.navigateTo({
      url: '../info/index?data=' + itemDataString,
    })
  }
})