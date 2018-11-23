// pages/paperwork/index.js
// 待做： 把所有有值的数据变为view  不为输入框
var app = getApp()
var api = app.globalData.api
Page({
  /**
   * 页面的初始数据
   */
  data: {
    array: ['未接车', '未到店','已接车', '已交车', '已结算'],
    index3: 0,
    windowShow: false,
    windowShow2: false,
    isClick: true,
    aaa: true,
    url: null,//证件拍照的集合
    url2: null,//车损拍照集合
    currentTab: 0,//最上面图片的正在显示的tab下标
    array: ['单车', '双车', '三车', '多车'],
    dataAll: null,//从上一个列表传过来的所有数据
    uploadImg: 7,//资料上传框的个数
    duration: 1000,
    array2: ['保险直赔', '主车垫付', '三者垫付', '4S公证'],//理赔方式
    index2: null,//理赔方式选择项
    items: [
      { name: 'true', value: '是'},
      { name: 'false', value: '否', checked: true}
    ],
    items2: [
      { name: 'true', value: '是' },
      { name: 'false', value: '否', checked: true}
    ],
    nameIsRealy: null,//判断输入的姓名有效性
    phoneIsRealy: null,//判断输入的电话号码有效性
    phones: null,//用户输入的电话号码
    index: null//事故类型选择项
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    app.getUserId = res => {
      _this.setData({ userId: res, api: api })
      console.log('xxxxxxxxxxxxxxx:', res)
    }
    wx.getSystemInfo({
      success(res) {
        var PmHeight = res.windowHeight
        var elTop = PmHeight - 240 + 'rpx'
        console.log('PmHeight:', PmHeight)
        _this.setData({ elTop: elTop })
      }
    })
    var dataAll = JSON.parse(decodeURIComponent(options.data))
    if (dataAll.statusName == '服务中') {

      _this.setData({ array: ['已接车', '已交车'] })

    } else if (dataAll.statusName == '推修订单' || dataAll.statusName == '未接车') {

        _this.setData({array: ['未到店', '已接车']})

    } else if ( dataAll.statusName == '未接车') {

      _this.setData({ array: ['未到店', '已接车'] })

    }else if(dataAll.statusName == '已交车') {

      _this.setData({ array: ['已交车', '已结算'] })

    } else if (dataAll.statusName == '已结算') {

      _this.setData({ array: ['已结算'] })

    } else {

      _this.setData({ array: ['未接车', '已接车'] })

    }
    console.log('options:', dataAll)
    var claimImg = dataAll.claimImgList
    var detailImg = dataAll.detailImgList
    var personHurts = dataAll.personHurts || ''
    var goodsHurts = dataAll.goodsHurts || ''
    console.log('claimImg:', claimImg, 'detailImg:', detailImg)
    this.setData({ dataAll: dataAll, url2: claimImg, url: detailImg })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index3: e.detail.value
    })
  },
  callPhnoe: function(e){
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  noCommingShop: function (nowData) {//未到店
    var _this = this
    var userId = app.globalData.sessionId
    var id = this.data.dataAll.id
    wx.request({
      url: api + 'api/v1/wx/openClaim/partner/unreach',
      data: {
        'thirdSessionKey': userId,
        'id': id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('更改状态--未到店：', res.data)
        var dataAll = _this.data.dataAll
        dataAll.statusNameForWx = nowData
        _this.setData({ dataAll: dataAll })
        _this.closeWindow()
        wx.showToast({
          title: '更改状态成功',
        })
      }
    })
  },
  sureSaveCar: function (nowData) {//确认接车
    var _this = this
    var userId = app.globalData.sessionId
    var id = this.data.dataAll.id
    wx.request({
      url: api + 'api/v1/wx/openClaim/partner/accept',
      data: {
        'thirdSessionKey': userId,
        'id': id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('更改状态--确认接车：', res.data)
        var dataAll = _this.data.dataAll
        dataAll.statusName = nowData
        _this.setData({ dataAll: dataAll})
        _this.closeWindow()
        wx.showToast({
          title: '更改状态成功',
        })
      }
    })
  },
  outThisCar: function (nowData) {//确认交车
    var _this = this
    var userId = app.globalData.sessionId
    var id = this.data.dataAll.id
    wx.request({
      url: api + 'api/v1/wx/openClaim/partner/placed',
      data: {
        'thirdSessionKey': userId,
        'id': id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('更改状态--确认交车：', res.data)
        var dataAll = _this.data.dataAll
        dataAll.statusName = nowData
        _this.setData({ dataAll: dataAll })
        _this.closeWindow()
        wx.showToast({
          title: '更改状态成功',
        })
      }
    })
  },
  carMoneyPay: function (nowData) {//已结算
    var _this = this
    var userId = app.globalData.sessionId
    var id = this.data.dataAll.id
    wx.request({
      url: api + 'api/v1/wx/openClaim/partner/settle',
      data: {
        'thirdSessionKey': userId,
        'id': id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('更改状态--已结算：', res.data)
        var dataAll = _this.data.dataAll
        dataAll.statusName = nowData
        _this.setData({ dataAll: dataAll })
        _this.closeWindow()
        wx.showToast({
          title: '更改状态成功',
        })
      }
    })
  },
  noCar: function (nowData) {//未接车
    var _this = this
    var userId = app.globalData.sessionId
    var id = this.data.dataAll.id
    wx.request({
      url: api + 'api/v1/wx/openClaim/partner/unaccept',
      data: {
        'thirdSessionKey': userId,
        'id': id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('更改状态--未接车：', res.data)
        var dataAll = _this.data.dataAll
        dataAll.statusName = nowData
        _this.setData({ dataAll: dataAll })
        _this.closeWindow()
        wx.showToast({
          title: '更改状态成功',
        })
      }
    })
  },
  closeWindow: function () {//关闭咨询窗口
    var _this = this
    var dataAll = this.data.dataAll
    if (dataAll.statusName == '服务中') {
      _this.setData({ windowShow: false })
    } else {
      _this.setData({ windowShow2: false })
    }
  },
  moneyChange: function (fixloss) {//改变定损金额
    var _this = this
    var dataAll = this.data.dataAll
    var userId = app.globalData.sessionId
    var id = dataAll.id
    wx.request({
      url: api + 'api/v1/wx/openClaim/partner/addFixloss',
      data: {
        'thirdSessionKey': userId,
        'id': id,
        'fixloss': fixloss
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('更改定损金额：', res.data)
        dataAll.fixloss = fixloss
        _this.setData({ dataAll: dataAll })
        _this.closeWindow()
        wx.showToast({
          title: '金额设定成功',
        })
      }
    })
  },
  lookeZLupload: function(e){
    var url = this.data.url
    // console.log(url)
    var index = e.currentTarget.dataset.id
    wx.previewImage({
      urls: url,
      current: url[index]
    })
  },
  insertMoney: function(){
    this.setData({ windowShow: true })
  },
  changeStaus: function(){
    this.setData({ windowShow2: true })
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  lookImage: function (e) {//查看图片
    var ids = e.currentTarget.dataset.id
    var urls = this.data.url2
    wx.previewImage({
      current: urls[ids], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  lookImage2: function (e) {//查看图片
    var ids = e.currentTarget.dataset.id
    var urls = this.data.url
    wx.previewImage({
      current: urls[ids], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  formSubmit: function (e) {//提交信息
    var _this = this
    var allData = this.data.dataAll
    var status = allData.statusName
    if (status == '服务中') {
      var fixloss = e.detail.value.fixloss
      wx.showModal({
        title: '提示',
        content: '此价格只能更改一次',
        cancelText: '我再想想',
        confirmText: '没问题',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '请稍等...',
            })
            _this.moneyChange(fixloss)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.showLoading({
        title: '请稍等...',
      })
      var array = this.data.array
      var index = this.data.index3
      var nowData = array[index]
      var _this = this
      if (nowData == '已接车') {
        _this.sureSaveCar(nowData)
      } else if (nowData == '未到店'){
        _this.noCommingShop(nowData)
      }else if(nowData == '已交车') {
        _this.outThisCar(nowData)
      } else if (nowData == '已结算') {
        _this.carMoneyPay(nowData)
      } else {
        _this.noCar(nowData)
      }
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
    var _this = this
    //创建动画
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: "ease-out",
      delay: 0,
      transformOrigin: "50% 50%",
    })

    //设置动画
    animation.scale(1, 1).step().scale(.8, .8).step()

    //导出动画数据传递给组件的animation属性。
    _this.setData({
      animationData: animation.export(),
    })
    setInterval(function () {
      //创建动画
      var animation = wx.createAnimation({
        duration: 800,
        timingFunction: "ease-out",
        delay: 0,
        transformOrigin: "50% 50%",
      })

      //设置动画
      animation.scale(1, 1).step().scale(.8, .8).step()

      //导出动画数据传递给组件的animation属性。
      _this.setData({
        animationData: animation.export(),
      })
    }, 1500)
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