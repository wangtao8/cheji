// pages/peifuAllOrder/index.js
var app = getApp()
var api = app.globalData.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['全部', '未完善', '未接车', '服务中', '已交车', '已结算', '已完善'],
    status: ['','','-1','1','2','3', '1'],//navbar对应的状态值
    currentTab: 0,//tab页的下标
    pageIndex: 0//当前页码
  },
  navbarTap: function (e) {//列表切换
    var _this = this
    var index = e.currentTarget.dataset.idx
    var status = e.currentTarget.dataset.status//当前上传的状态码
    console.log('status:', status)
    var userId = app.globalData.sessionId
    var ids = _this.data.ids
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中...',
    })
    if (index == 1){
      _this.getOrderData(0, 0, 0)
    } else if(index == 6){
      _this.getOrderData(0, 0, 1)
    } else {
      _this.getOrderData(0, status, '')
    }
  },
  getOrderData: function (e, status, isComplete) { //查询分类订单接口
    var _this = this
    var userId = app.globalData.sessionId
    var pageIndex = _this.data.pageIndex + 1
    var pageSizes = 4 + 4 * pageIndex
    wx.request({
      url: api + 'api/v1/wx/open/claimer/order/get',
      data: {
        'thirdSessionKey': userId,
        'limit': 4,
        'offset': e == 1 ? pageSizes : 0,
        'status': !!status == false ? '' : status,
        'isComplete': isComplete
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
                    _this.getOrderData(0)
                  }
                })
              }
            }
          })
        } else {
          if (e == 0) {//刷新的情况
            console.log('刷新时的结果：', res.data)
            var content = res.data.data.records
            var pageAll = res.data.data.total
            _this.setData({
              allData: content,
              pageAll: pageAll,
              pageIndex: 0
            })
          } else {//上拉的情况
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
  },
  goInfo: function (e) {
    var itemData = e.currentTarget.dataset.item
    var itemDataString = ''//字符串拼接
    var i = 0
    for (var name in itemData) {
      if (i == 0) {
        itemDataString += ('?' + name + '=' + itemData[name])
      } else {
        itemDataString += ('&' + name + '=' + itemData[name])
      }
      i++
    }
    console.log('itemDataString:', itemDataString)
    wx.navigateTo({
      url: '../sumitInfo/index' + itemDataString
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中...',
    })
    var currentTab = options.status
    this.setData({ currentTab: currentTab})
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
    var currentTab = this.data.currentTab
    var status = this.data.status
    console.log('status:', status, 'currentTab:', currentTab, status[currentTab])
    var _this = this
    if (!!currentTab) {
      if (currentTab == 1) {
        _this.getOrderData(0, 0, 0)
      } else if (currentTab == 6) {
        _this.getOrderData(0, 0, 1)
      } else {
        _this.getOrderData(0, status[currentTab], '')
      }
      _this.setData({ currentTab: currentTab })
    } else {
      _this.getOrderData(0, 0, '')
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
    var _this = this
    var index = _this.data.currentTab//当前所在的索引值
    var status = _this.data.status//当前的状态码
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中...',
    })
    if (index == 1) {
      _this.getOrderData(0, 0, 0)//第一个参数1代表上拉加载  0代表下拉刷新  第二个参数0代表为空  其余值代表任意查询码  第三个参数 0代表为空 1代表查询未完善订单
    } else if (index == 6){
      _this.getOrderData(0, 0, 1)
    }else{
      _this.getOrderData(0, status[index], '')
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this
    var ids = _this.data.ids
    var pageIndex = _this.data.pageIndex + 1
    var pageSizes = 4 + 4 * pageIndex
    var pageAll = _this.data.pageAll
    var index = _this.data.currentTab
    var status = _this.data.status
    if (pageSizes < pageAll) {
      wx.showNavigationBarLoading()
      wx.showLoading({
        title: '加载中...',
      })
      if (index == 1) {
        _this.getOrderData(1, 0, 0)//第一个参数1代表上拉加载  0代表下拉刷新  第二个参数0代表为空  其余值代表任意查询码  第三个参数 0代表为空 1代表查询未完善订单
      } else if (index == 6){
        _this.getOrderData(1, 0, 1)
      }else{
        _this.getOrderData(1, status[index], '')
      }
    } else {
      wx.showToast({
        title: '没有更多啦',
        icon: 'none'
      })
      setTimeout(function(){
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
        wx.hideLoading()
      },1000)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})