// pages/package/pages/orderInfo/index.js
var app = getApp();
var api = app.globalData.api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBtns: true,
    isOk: true,
    oldImages: [],
    newImages: [],
    windowShow2: false,
    array: [],
    index3: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    app.getUserId = res => {

    }
    var dataAll = JSON.parse(decodeURIComponent(options.data))
    console.log('dataAll:', dataAll)
    this.setData({ dataAll: dataAll})
    wx.getSystemInfo({
      success(res) {
        var PmHeight = res.windowHeight
        var elTop = PmHeight - 240 + 'rpx'
        console.log('PmHeight:', PmHeight)
        _this.setData({ elTop: elTop })
      }
    })
    var orderStatus = dataAll.orderStatus
    if (orderStatus == '已下单') {
      _this.setData({ array: ['已下单', '已接车', '取消订单']})
    } else if (orderStatus == '已接车') {
      _this.setData({ array: ['已接车', '已完成'] })
    } else if (orderStatus == '已完成') {
      _this.setData({ array: ['已完成'] })
    }
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
  changeStaus: function () {
    this.setData({ windowShow2: true })
  },
  changeValue: function(){
    wx.showLoading({
      title: '请稍等...',
    })
    var array = this.data.array
    var index = this.data.index3
    var nowData = array[index]
    var _this = this
    if (nowData == '已接车') {
      _this.changeStautsFn(0)
    } else if (nowData == '已完成') {
      _this.changeStautsFn(1)
    } else if (nowData == '已取消') {
      _this.changeStautsFn(2)
    }
  },
  changeStautsFn: function(types){
    var orderStatus
    var userId = app.globalData.sessionId
    var id = this.data.dataAll.id
    var _this = this
    if(types == 0) {//已接车
      orderStatus = 'RECEPT'
    } else if (types == 1) {//已完成
      orderStatus = 'FINISH'
    } else {//已取消
      orderStatus = 'CANCELED'
    }
    wx.request({
      url: api + 'api/v1/wx/bizMaintainPackageOrder/update',
      data: {
        'thirdSessionKey': userId,
        'orderStatus': orderStatus,
        'id': id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res){
        console.log('更该订单状态结果：', res.data)
        wx.showToast({
          title: '更改状态成功！',
          icon: 'success'
        })
        _this.closeWindow()
      }
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index3: e.detail.value
    })
  },
  Tophoto: function(e){
    var oldImages = this.data.oldImages
    var newImages = this.data.newImages
    var ImageList
    var _this = this
    var id = e.currentTarget.dataset.id
    if (id == 0) {
      ImageList = oldImages
    } else {
      ImageList = newImages
    }
    if (ImageList.length < 9) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths[0]
          if (id == 0) {
            oldImages.push(tempFilePaths)
            _this.setData({ oldImages: oldImages })
          } else {
            newImages.push(tempFilePaths)
            _this.setData({ newImages: newImages })
          }
         
        }
      })
    } else {
      wx.showToast({
        title: '已经是最大上传数量',
        icon: 'none'
      })
    }
  },
  allUpload: function(e){
    var _this = this
    var id = e.currentTarget.dataset.id
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        if (id == 0) {
          _this.setData({ oldImages: tempFilePaths })
        } else {
          _this.setData({ newImages: tempFilePaths })
        }
       
      }
    })
  },
  uploadImage: function(e){
    var id = e.currentTarget.dataset.id
    var _this = this
    wx.showLoading({
      title: '上传图片中..',
    })
    if (id == 0) {
      var preImgs = _this.data.oldImages
      _this.ulpoad(0, preImgs)
      // _this.uploadPre(0, preImgs)
      _this.setData({ showBtns: false })
    } else {
      var aftImgs = _this.data.newImages
      _this.ulpoad(1, aftImgs)
      // _this.uploadPre(0, aftImgs)
      _this.setData({ isOk: false})
    }
  },
  ulpoad: function(types,list){//上传图片到服务器
    var _this = this
    var userId = app.globalData.sessionId
    var claimImg
    var k = 0
    for (let i = 0; i < list.length; i++){
      console.log('list:', list[i])
      wx.uploadFile({
        url: api + 'api/v1/wx/claim/uploadfile',
        filePath: list[i],
        name: 'file',
        formData: {
          'thirdSessionKey': userId
        },
        success: function (res) {
          k++
          console.log('xxxxxxxxxxxx:', res.data)
          const data = JSON.parse(res.data)
          claimImg = claimImg === undefined ? data.data[0] : claimImg + '#' + data.data[0] //拼接图片url地址
          if (list.length == k) {
            console.log('拼接好的图片：', claimImg, 'i:', i)
            _this.uploadPre(types, claimImg)
          }
        }
      })
    }
  },
  uploadPre: function(types, list){//把已经上传的图片地址存到数据库
    var userId = app.globalData.sessionId
    var id = this.data.dataAll.id
    var data
    console.log('list:', list)
    if (types == 0) {
      data = {
        'thirdSessionKey': userId,
        'id': id,
        'preImgs': list
      }
    } else {
      data = {
        'thirdSessionKey': userId,
        'id': id,
        'aftImgs': list
      }
    }
    console.log('data:', data)
    wx.request({
      url: api + 'api/v1/wx/bizMaintainPackageOrder/update',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res){
        console.log('上传图片的返回值：', res.data)
        wx.showToast({
          title: '上传图片成功！',
          icon: 'success'
        })
      }
    })
  },
  lookImg: function(e){
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var perList = this.data.dataAll.preImgsList
    var aftList = this.data.dataAll.aftImgsList
    var _this = this
    var imgList
    if (id ==0) {
      if (perList.length > 0) {
        imgList = perList
      } else {
        imgList = _this.data.oldImages
      }
      // console.log('oldImages:', imgList)
    } else {
      if (aftList.length > 0) {
        imgList = aftList
      } else {
        imgList = _this.data.newImages
      }
      // console.log('newImages:', imgList)
    }
    wx.previewImage({
      current: imgList[index], // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
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
    var _this = this
    var dataAll = this.data.dataAll
    if (dataAll.preImgsList.length > 0) {
      _this.setData({ showBtns: false, })
    }
    if (dataAll.aftImgsList.length > 0) {
      _this.setData({ isOk: false, })
    }
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