// pages/index/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    // var scene = decodeURIComponent(options.scene)
    var scene = '1231312312312123'
    app.globalData.scene = scene
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })

    this.animation = animation

    animation.rotate(720).scale(2, 2).step()

    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.rotate(0).scale(1, 1).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1000)
    wx.getSystemInfo({
      success: function (res) {
        console.log('手机品牌：', res.brand)
        _this.setData({ brand: res.brand })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goPhoto: function () {
    var userId = app.globalData.sessionId
    var brand = this.data.brand
    var isHuaWei = brand == 'HUAWEI' ? true : false
    console.log('最后判断是否为华为手机：', isHuaWei)
    if (isHuaWei) {
      wx.chooseImage({
        count: 3, 
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths
          wx.navigateTo({
            url: "../vedeoInfo/index?tempFilePath=" + tempFilePaths,
          })
        },
        fail: function(e){
          console.log(e)
        }
      })
    } else {
      wx.chooseVideo({
        sourceType: ['camera'],
        maxDuration: 10,
        camera: 'back',
        compressed: true,
        success: function (res) {
          console.log('录制视频的大小：', res.size)
          wx.navigateTo({
            url: "../vedeoInfo/index?tempFilePath=" + res.tempFilePath,
          })
        }
      })
    }
  },
  prompt: function (e) {
    var ids = e.currentTarget.dataset.id
    if (ids == 0) {
      wx.navigateTo({
        url: '../meirong/index',
      })
    } else if (ids == 2) {
      wx.navigateTo({
        url: '../lipei/index',
      })
    } else {
      wx.showToast({
        title: '敬请期待^ ^',
        icon: 'none',
        duration: 1000
      })
    }
  }
})