// pages/paperwork/index.js
// 待做： 把所有有值的数据变为view  不为输入框
var app = getApp()
var api = app.globalData.api
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
    radio1: null,//人伤情况结果
    radio2: null,//物损情况结果
    index: null//事故类型选择项
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:', options)
    var dataAll = options
    var claimImg = options.claimImg.split('|')
    var detailImg = options.detailImgList.split(',')
    var personHurts = options.personHurts || ''
    var goodsHurts = options.goodsHurts || ''
    if (!!personHurts){
      this.changeAudio('items', personHurts)
      this.changeAudio('items2', goodsHurts)
    }
    console.log('claimImg:', claimImg, 'detailImg:', detailImg)
    this.setData({ dataAll: dataAll, url2: claimImg, url: detailImg })
  },
  changeAudio: function(names, val){
    var items = [{ name: 'true', value: '是' }, { name: 'false', value: '否' }]
    var _this = this
    for (var i = 0; i < items.length; i++) {
      if (items[i].name == val.toString()) {
        items[i].checked = true
      } else {
        items[i].checked = false
      }
    }
    this.setData({ [names]: items })
    console.log('获得改变后的数组：', [names], items, _this.data[names])
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({ radio1: e.detail.value})
  },
  radioChange2: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({ radio2: e.detail.value })
  },
  bindPickerChange: function(e){
    var index = e.detail.value
    this.setData({ index: index})
  },
  bindPickerChange2: function (e) {
    var index = e.detail.value
    this.setData({ index2: index })
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    var _this = this
    _this.setData({
      currentTab: e.detail.current
    });
    _this.checkCor();
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
  allUpload: function () {//一次性上传
    var _this = this
    var urls = []
    wx.chooseImage({
      count: 5,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        // tempFilePaths.reverse()
        _this.setData({ url2: tempFilePaths })
      }
    })
  },
  Tophoto: function () {//单次拍照上传
    var _this = this
    console.log('查看现在的图片集合:', _this.data.url2)
    var urls = _this.data.url2 || []
    var nums = 1
    if (urls.length == 5) {
      wx.showToast({
        title: '不能上传更多啦！',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.chooseImage({
        count: nums,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths[0]
          // console.log(urls.length + 1 <= 5)
          if (urls.length < 5) {
            urls.push(tempFilePaths)
          }
          if (urls.length < 5) {
            _this.setData({
              url2: urls,
              currentTab: urls.length
            })
          } else {
            _this.setData({
              url2: urls,
              currentTab: (urls.length - 1)
            })
          }
          console.log('集合：', urls)
        }
      })
    }
  },
  addUploadImg: function(){//添加资料上传框
    var _this = this
    var uploadImg = _this.data.uploadImg + 1
    console.log('uploadImg:', uploadImg)
    if (uploadImg > 15) {
      wx.showToast({
        title: '超过上传数量了！',
        icon: 'none'
      })
    } else {
      _this.setData({ uploadImg: uploadImg })
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
  uploadImg: function (e) {//上传证件照
    var _this = this
    var ids = e.currentTarget.dataset.id
    var urls = _this.data.url || []
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        urls[ids] = res.tempFilePaths[0]
        // console.log('资料上传的url:', res.tempFilePaths[0] )
        _this.setData({ url: urls })
      }
    })
  },
  formSubmit: function (e) {
    var _this = this
    var array = this.data.array//事故类型
    var index = this.data.index
    var array2 = this.data.array2//理赔方式
    var index2 = this.data.index2//理赔方式选项
    var claimImg = this.data.claimImg//现场图片
    var detailImg = this.data.detailImg//车主资料图片
    var radio1 = this.data.radio1 || 'false'//人伤
    var radio2 = this.data.radio2 || 'false'//物损
    var id = this.data.dataAll.id//订单id
    var userId = app.globalData.sessionId
    var allData = e.detail.value
    allData.accType = array[index]
    allData.settleType = array2[index2]
    allData.claimImg = claimImg
    allData.detailImg = detailImg
    allData.personHurts = radio1
    allData.goodsHurts = radio2
    allData.id = id
    allData.thirdSessionKey = userId
    console.log('form发生了submit事件，携带数据为：', allData)
    for(var a in allData) {
      console.log('+++++++++++++++++++++:', a, allData[a])
      if (allData[a] == undefined || allData[a] == 'undefined' || allData[a] == '') {
        {
          wx.showModal({
            title: '提示',
            content: '请完善信息！',
          })
          return false
        }
      }
    }
    wx.showLoading({
      title: '上传中...',
    })
    wx.request({
      url: api + 'api/v1/wx/open/claimer/order/supply',
      data: allData,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log('数据上传结果', res.data)
        if (res.data.errorCode == 0) {
            wx.showToast({
              title: '上传成功！',
              icon: 'success'
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },1000)
        }
      }
    })
  },
  needUpload: function(e){//判断是否还有http
    for(var i = 0; i < e.length; i++) {
      if (e[i].indexOf('https') == -1) {
        return true
      } else {
        continue
      }
    }
    return false
  },
  Tophoto2: function(e){
    var _this = this
    var url = _this.data.url//资料图片
    var url2 = _this.data.url2//现场图片
    var claimImg = _this.data.claimImg//资料图片拼接
    var detailImg = _this.data.detailImg//现场图片拼接
    var id = e.currentTarget.dataset.id//2为现场图片上传  3为资料图片上传
    var names = ''
    wx.showLoading({
      title: '上传中...',
    })
    // console.log(e.currentTarget.dataset.id)
    if (id == 2) {
      if (_this.needUpload(url2)){
        _this.uploading('claimImg', url2)
      } else {
        claimImg = url2.join('|')
        _this.setData({ claimImg: claimImg})
        setTimeout(function(){
          wx.hideLoading()
        },1000)
        console.log('我没进入下次循环就已经拼接好：', _this.data.claimImg)
      }
      
    } else {
      _this.uploading('detailImg', url)
    }
  },
  uploading: function (urlName, urlData){
    var names = []
    var k = 0
    var userId = app.globalData.sessionId
    var _this = this
    for (var i = 0; i < urlData.length; i++) {
      if (urlData[i].indexOf('https') == -1) {//全部都是微信服务器的图片
        wx.uploadFile({//上传图片接口
          url: api + 'api/v1/wx/claim/uploadfile',
          filePath: urlData[i],
          name: 'file',
          formData: {
            'thirdSessionKey': userId
          },
          success: function (res) {
            var data = JSON.parse(res.data)
            // debugger
            console.log('上面判断的names：', names, k)
            names.push(data.data[0])
            if (k+1 == urlData.length) {
              console.log('上传完了：', names)
              var namess = names.join('|')
              wx.showToast({
                title: '上传成功！',
                icon: 'success'
              })
              _this.setData({ [urlName]: namess })
              console.log('查看是否赋值成功：', _this.data[urlName])
            }
            k++
          }
        })
      } else {//全部都是自己服务器上面的图片
        names.push(urlData[k])
        k++
        console.log('这里意味着有几张https就进来加入几次names数组，上面继续加入数组：', k)
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