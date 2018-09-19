// pages/peifuorderList/index.js
var app = getApp()
var api = app.globalData.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 0, //当前页码
    pageSize: 10,
    pageAll: 0,//总条数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {// ids = 1 为 完善订单  ids = 3 为事故推送
    var ids = options.ids
    this.setData({ ids: ids })
    console.log('当前的ids:', ids)
    wx.showNavigationBarLoading()
  },
  getOrder: function(e){
    var _this = this
    var userId = app.globalData.sessionId
    var pageIndex = _this.data.pageIndex + 1
    var pageSizes = 10 + 10 * pageIndex
    wx.request({
      url: api + 'api/v1/wx/open/claimer/order/get',
      data: {
        'thirdSessionKey': userId,
        'limit': e == 1 ? 10 : 20,
        'offset': e == 1 ? pageSizes : 0
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('我提交过的订单查询结果：', res.data)
        // _this.setData({ dataAll: res.data.data.records })
        if (e == 0) {//刷新的情况
          var content = res.data.data.records
          var pageAll = res.data.data.total
          console.log('下拉刷新时的数据：', content)
          _this.setData({
            dataAll: content,
            pageAll: pageAll,
            pageIndex: 0,
            pageSize: 0
          })
        } else {//上拉的情况
          console.log('上拉加载时的数据：', res.data)
          var pageAll = res.data.data.total
          var nowData = res.data.data.records
          var dataList = _this.data.dataAll
          for (var i = 0; i < nowData.length; i++) {
            dataList.push(nowData[i])
          }
          _this.setData({
            dataAll: dataList,
            pageAll: pageAll,
            pageIndex: pageIndex,
            pageSize: pageSizes
          })
        }

        wx.hideLoading()
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  carSgAccident: function (e) { //事故推送列表
    var _this = this
    var userId = app.globalData.sessionId
    var pageIndex = _this.data.pageIndex + 1
    var pageSizes = 10 + 10 * pageIndex
    wx.request({
      url: api + 'api/v1/wx/accids/pushRecord/get',
      data: {
        'thirdSessionKey': userId,
        'limit': e == 1 ? 10 : 20,
        'offset': e == 1 ? pageSizes : 0
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('理赔订单推送列表:', res.data)
        if (res.data.errorCode == 5001) {
          wx.login({
            success: function (res) {
              if (res.code) {
                // console.log(res)
                // 发起网络请求
                console.log('重新获得jsCode:', res.code)
                wx.request({
                  url: api + 'api/v1/wx/getSession?code=' + res.code,
                  success: function (ress) {
                    app.globalData.sessionId = ress.data.data.sessionId
                    _this.carAccident()
                  }
                })
              }
            }
          })
        } else { //sessionId有效
          if (e == 0) {
            console.log('我是理赔订单下拉刷新或者页面初次加载')
            var content = res.data.data.records
            var pageAll = res.data.data.total
            _this.setData({
              dataAll: content,
              pageAll: pageAll,
              pageIndex: 0
            })
          } else {
            var pageAll = res.data.data.total
            var nowData = res.data.data.records
            var dataList = _this.data.dataAll
            console.log('理赔订单下拉加载列表:', pageAll, pageSizes)
            for (var i = 0; i < nowData.length; i++) {
              dataList.push(nowData[i])
            }
            _this.setData({
              dataAll: dataList,
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var ids = this.data.ids
    wx.showLoading({
      title: '加载中...',
    })
    if (ids == 1) {
      this.getOrder(0)
    } else {
      this.carSgAccident(0)
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
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中...',
    })
    var ids = this.data.ids
    if (ids == 1) {
      this.getOrder(0)
    } else {
      this.carSgAccident(0)
    }
    
    this.setData({ pageSize: 0 })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var pageSize = this.data.pageSize
    var pageAll = this.data.pageAll
    var ids = this.data.ids
    var _this = this
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中...',
    })
    if (pageSize >= pageAll) {
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
      setTimeout(function(){
        wx.hideLoading()
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      },1000)
    } else {
      if (ids == 1) {
        _this.getOrder(1)
      } else {
        _this.carSgAccident(1)
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  goInfo: function(e){
    var itemData = e.currentTarget.dataset.item
    var itemDataString = ''//字符串拼接
    var ids = this.data.ids
    var i = 0

    var _this = this
    var curId = e.currentTarget.dataset.curid//推送记录id
    var sgid = e.currentTarget.dataset.sgid//事故id
    var videoSrc = e.currentTarget.dataset.video//视频url
    var lng = e.currentTarget.dataset.lng
    var lat = e.currentTarget.dataset.lat
    var unread = e.currentTarget.dataset.unread
    var phone = e.currentTarget.dataset.phone
    var realness = e.currentTarget.dataset.realness//真实性
    for(var name in itemData) {
      if (i==0) {
        itemDataString += ('?' + name + '=' + itemData[name])
      } else {
        itemDataString += ('&'+ name +'=' + itemData[name])
      }
      i++
    }
    console.log('itemDataString:', itemDataString)
    if (ids == 1) {
      wx.navigateTo({
        url: '../sumitInfo/index' + itemDataString
      })
    } else {//跳转到
      wx.navigateTo({
        url: '/pages/myorder/index?curId=' + curId + '&videoSrc=' + videoSrc + '&lat=' + lat + '&lng=' + lng + '&id=' + ids + '&unread=' + unread + '&phone=' + phone + '&realness=' + realness + '&sgId=' + sgid + '&id=3'
      })
    }
    
  }
})