// pages/peifuAllOrder/index.js
var app = getApp()
var api = app.globalData.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['全部', '未完善', '未接车', '服务中', '已交车', '已结算'],
    status: ['','','-1','1','2','3', '1'],//navbar对应的状态值
    currentTab: 0,//tab页的下标
    pageIndex: 0,//当前页码
    delBtnWidth: 100
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      console.log('自适应宽度：', res)
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      console.log('初始化数据：', real)
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  touchS: function (e) {
    // console.log('touchStar:', e.touches[0].clientX)
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      // console.log('touchMove:', e.touches[0].clientX, delBtnWidth)
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var list = this.data.allData;
      // console.log()
      if (index >= 0) {
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          allData: list
        });
      }
    }
  },
  touchE: function (e) {
    // console.log('touchEnd:', e.changedTouches[0].clientX)
    var startX = this.data.startX
    var deptid = e.target.dataset.deptid
    // console.log('开始的触摸点:', startX, '结束的触摸点：', e.changedTouches[0].clientX, e)
    if (startX == e.changedTouches[0].clientX){
      this.gofoursMap2(deptid)
    }
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var list = this.data.allData;
      // console.log(e);
      if (index >= 0) {
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          allData: list
        });
      }
    }
  },
  deleteThis: function(e){
    var curIndex = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id//订单id
    var allData = this.data.allData
    var userId = app.globalData.sessionId
    var _this = this
    wx.request({
      url: api + 'api/v1/wx/open/claimer/order/cancel',
      data: {
        'thirdSessionKey': userId,
        'id': id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success(res) {
        console.log('删除的情况：', res.data)
        if (res.data.errorCode == 0) {
          allData.splice(curIndex, 1)
          _this.setData({ allData: allData })
        }
      }
    })
  },
  navbarTap: function (e) {//列表切换
    var _this = this
    var index = e.currentTarget.dataset.idx
    var status = e.currentTarget.dataset.status//当前上传的状态码
    console.log('status:', status)
    this.setData({ statuss: status })
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
    var pageIndex = _this.data.pageIndex
    console.log('查询分类订单接口的当前页数：', pageIndex)
    var pageSizes = 4 * pageIndex
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
    // console.log('测试：', encodeURIComponent(JSON.stringify(itemData)))
    var itemDataString = encodeURIComponent(JSON.stringify(itemData))//字符串拼接
    // var i = 0
    // for (var name in itemData) {
    //   if (i == 0) {
    //     console.log('i==0:', name, itemData[name])
    //     itemDataString += ('?' + name + '=' + itemData[name])
    //   } else {
    //     console.log('i!=0:', name, itemData[name])
    //     itemDataString += ('&' + name + '=' + itemData[name])
    //   }
    //   i++
    // }
    // console.log('itemDataString:', itemDataString)
    wx.navigateTo({
      url: '../sumitInfo/index?data=' + itemDataString
    })

  },
  gofoursMap: function (e) {//查询4s店信息
    var _this = this
    console.log('我触发了事件')
    var deptId = parseInt(e.currentTarget.dataset.deptid)
    var userId = app.globalData.sessionId || 'x'
    wx.request({
      url: api + 'api/v1/wx/store/getOne',
      data: {
        'deptid': deptId,
        'thirdSessionKey': userId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('获取的4S店信息：', res.data.data)
        var dataList = JSON.stringify(res.data.data)
        wx.navigateTo({
          url: '../fourSInfo/index?dataList=' + dataList,
        })
        wx.hideLoading()
      }
    })
  },
  gofoursMap2: function (e) {//查询4s店信息
    var _this = this
    console.log('我触发了事件')
    var deptId = parseInt(e)
    var userId = app.globalData.sessionId || 'x'
    wx.request({
      url: api + 'api/v1/wx/store/getOne',
      data: {
        'deptid': deptId,
        'thirdSessionKey': userId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('获取的4S店信息：', res.data.data)
        var dataList = JSON.stringify(res.data.data)
        wx.navigateTo({
          url: '../fourSInfo/index?dataList=' + dataList,
        })
        wx.hideLoading()
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
    this.setData({ currentTab: currentTab})
    this.initEleWidth()
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
    this.setData({ statuss: status[currentTab] })
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