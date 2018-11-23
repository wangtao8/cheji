// pages/peifuAllOrder/index.js
var app = getApp()
var api = app.globalData.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['全部', '推修单', '接车中', '录金额', '已交车', '已结算'],
    status: ['', '-1', '-1','1','2','3'],//navbar对应的状态值
    currentTab: 0,//tab页的下标
    pageIndex: 0,//当前页码
    delBtnWidth: 100
  },
  goInfo: function(e){
    var allData = JSON.stringify(e.currentTarget.dataset.alldata)
    // console.log('allData:', allData)
    wx.navigateTo({
      url: '/pages/processItr/pages/sumitInfo/index?data=' + encodeURIComponent(allData)
    })
  },
  navbarTap: function (e) {//列表切换
    var _this = this
    var allStuts = this.data.status
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
    if (index == 1) {
      _this.getOrderData(0, status, 0)
    } else if (index == 2) {
      _this.getOrderData(0, status, 1)
    } else {
      _this.getOrderData(0, status, '')
    }
    // _this.getOrderData(0, status, '')
  },
  getOrderData: function (e, status, isComplete) { //查询分类订单接口
    var _this = this
    var userId = app.globalData.sessionId
    var pageIndex = _this.data.pageIndex
    console.log('查询分类订单接口的当前页数：', pageIndex, '接收到的参数：', isComplete)
    var pageSizes = 4 * pageIndex
    wx.request({
      url: api + 'api/v1/wx/openClaim/list',
      data: {
        'thirdSessionKey': userId,
        'limit': 4,
        'offset': e == 1 ? pageSizes : 0,
        'status': !!status == false ? '' : status,
        'isComplete': isComplete == undefined ? '' : isComplete
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中...',
    })
    var currentTab = options.status
    this.setData({ currentTab: currentTab })
    app.getUserId = res => {

    } 
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
    if (currentTab == 1) {
      _this.getOrderData(0, status[currentTab], 0)
    } else if (currentTab == 2) {
      _this.getOrderData(0, status[currentTab], 1)
    } else {
      _this.getOrderData(0, status[currentTab], '')
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
      _this.getOrderData(0, status[index], 0)
    } else if (index == 2) {
      _this.getOrderData(0, status[index], 1)
    } else {
      _this.getOrderData(0, status[index], '')
    }
    // _this.getOrderData(0, status[index], '')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this
    var ids = _this.data.ids
    var pageIndex = _this.data.pageIndex + 1
    var pageSizes = 4 * pageIndex
    var pageAll = _this.data.pageAll
    var index = _this.data.currentTab
    var status = _this.data.status
    console.log('页数对比：', pageSizes, pageAll, pageIndex)
    _this.setData({ pageIndex: pageIndex })
    if (pageSizes < pageAll) {
      wx.showNavigationBarLoading()
      wx.showLoading({
        title: '加载中...',
      })
      _this.getOrderData(1, status[index], '')
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