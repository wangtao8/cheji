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
    newImages: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getUserId = res => {

    }
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
    if (id == 0) {
      _this.setData({ showBtns: false })
    } else {
      _this.setData({ isOk: false})
    }
  },
  lookImg: function(e){
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var _this = this
    var imgList
    if (id ==0) {
      imgList = _this.data.oldImages
      // console.log('oldImages:', imgList)
    } else {
      imgList = _this.data.newImages
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