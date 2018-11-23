// pages/paperwork/index.js
// 待做： 把所有有值的数据变为view  不为输入框
var app = getApp()
var api = app.globalData.api
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isClick: true,
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
    var dataAll = JSON.parse(decodeURIComponent(options.data))
    console.log('options:', dataAll)
    var claimImg = dataAll.claimImgList
    var detailImg = dataAll.detailImgList
    var personHurts = dataAll.personHurts || ''
    var goodsHurts = dataAll.goodsHurts || ''
    if (!!personHurts){
      this.changeAudio('items', personHurts)
      this.changeAudio('items2', goodsHurts)
    }
    console.log('claimImg:', claimImg, 'detailImg:', detailImg)
    this.setData({ dataAll: dataAll, url2: claimImg, url: detailImg })
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
  getBlur: function(e){
    var _this = this
    var phoneRole = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
    var nameRole = /^[\u4E00-\u9FA5A-Za-z]+$/
    var nameIsRealy = null
    var phoneIsRealy = null
    console.log(e)
    var id = e.currentTarget.dataset.id
    if (id == 1) {//1为验证姓名   0为验证手机号
      var names = this.data.names
      nameIsRealy = nameRole.test(names)
      _this.setData({ nameIsRealy: nameIsRealy})
    } else {
      var phones = this.data.phones
      console.log('客户电话:', phones)
      phoneIsRealy = phoneRole.test(phones)
      _this.setData({ phoneIsRealy: phoneIsRealy })
    }
    // if (id == 1 && !nameIsRealy) {
    //   wx.showToast({
    //     title: '姓名有误，请检查输入',
    //     icon: 'none'
    //   })
    // } else if (id == 0 && !phoneIsRealy){
    //   wx.showToast({
    //     title: '电话有误，请检查输入',
    //     icon: 'none'
    //   })
    // }
  },
  changeVal: function(e){
    var id = e.currentTarget.dataset.id
    var _this = this
    if (id == 1) {
      _this.setData({ names: e.detail.value })
    } else {
      _this.setData({ phones: e.detail.value })
    }
    
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
    if (uploadImg > 10) {
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
    var uploadImg = _this.data.uploadImg
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // urls[ids] = res.tempFilePaths[0]
        console.log('还没进行任何操作的urls:', urls.length)
        if (urls.length == 0) { //如果最开始没有图片
          urls = res.tempFilePaths
          if (urls.length > 7) {
            _this.setData({ uploadImg: urls.length })
          }
          console.log('没有图片时的urls:', urls)
        } else {//已有图片那么循环加入
          for (var i = 0; i < res.tempFilePaths.length; i++){
            urls.push(res.tempFilePaths[i])
          }
          if (urls.length <= 10) {//如果图片集合小于10张那么增加显示图片的框 并设置当前url集合
            _this.setData({ url: urls })
          } else {//否则删除多余的图片 并设置当前集合
            urls.splice(9, (urls.length-10))
            _this.setData({ uploadImg: 10, url: urls })
          }
          console.log('有图片时的urls:', urls)
        }
        _this.setData({ url: urls})
        // console.log('资料上传的url:', res.tempFilePaths[0] )
        
      }
    })
  },
  aa: function(){//上传现场图片
    var _this = this
    var url2 = _this.data.url2
    var p = new Promise(function (resovle, reject) {
      var names = []
      var k = 0
      var userId = app.globalData.sessionId
      if (_this.needUpload(url2)) {//如果有http链接 那么上传图片
        _this.uploading('claimImg', url2, resovle)
      } else {//如果没有http链接  直接拼接图片
        var claimImg = url2.join('|')
        _this.setData({ claimImg: claimImg })
        // wx.showToast({
        //   title: '现场上传成功！',
        //   icon: 'success'
        // })
        resovle(1)
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        console.log('我没进入下次循环就已经拼接好：', _this.data.claimImg)
      }
      // _this.uploading('claimImg', url2)
    })
      return p
  },
  needUpload: function (e) {//判断是否还有http
    for (var i = 0; i < e.length; i++) {
      if (e[i].indexOf('https') == -1) {
        return true
      } else {
        continue
      }
    }
    return false
  },
  bb: function () {//上传车主资料
    var _this = this
    var url = _this.data.url
    var p = new Promise(function (resovle, reject) {
      var names = []
      var k = 0
      var userId = app.globalData.sessionId
      _this.uploading('detailImg', url, resovle)
    })
    return p
  },
  formSubmit: function (e) {//提交信息
    var _this = this
    var array = this.data.array//事故类型
    var index = this.data.index
    var array2 = this.data.array2//理赔方式
    var index2 = this.data.index2//理赔方式选项
    var id = this.data.dataAll.id//订单id
    var userId = app.globalData.sessionId
    var allData = e.detail.value
    var nameIsRealy = this.data.nameIsRealy
    var phoneIsRealy = this.data.phoneIsRealy
    this.setData({ isClick: false })
    wx.showLoading({
      title: '上传中...',
    })
    allData.accType = array[index] || ''
    allData.settleType = array2[index2] || ''
    allData.id = id
    allData.thirdSessionKey = userId
    var url2 = this.data.url2//事故现场图片
    var url = this.data.url//车主资料图片
    console.log('form发生了submit事件，携带数据为：', url2, url)
    this.aa().then(function(data){
      console.log('data1111:', data)
      if (data == 1) {
        var claimImg = _this.data.claimImg//现场图片
        allData.claimImg = claimImg
        _this.bb().then(function(data2){
          console.log('data2222:', data2)
          if (data2 == 1) {
            var detailImg = _this.data.detailImg//车主资料图片
            allData.detailImg = detailImg
            console.log('所有信息：', allData)
            for (var a in allData) {
              // console.log('+++++++++++++++++++++:', a, allData[a])
              if (a == 'name') {
                // console.log('检查到姓名：', allData[a] == '')
                if (allData[a] == '') {
                  wx.showModal({
                    title: '提示',
                    content: '请填写客户姓名！',
                  })
                  _this.setData({ isClick: true })
                  return false
                }
              } else if (a == 'cph') {
                if (allData[a] == '') {
                  wx.showModal({
                    title: '提示',
                    content: '请填写车牌！',
                  })
                  _this.setData({ isClick: true })
                  return false
                }
              } else if (a == 'qcpp') {
                if (allData[a] == '') {
                  wx.showModal({
                    title: '提示',
                    content: '请填写品牌！',
                  })
                  _this.setData({ isClick: true })
                  return false
                }
              } else if (a == 'phone') {
                if (allData[a] == '') {
                  wx.showModal({
                    title: '提示',
                    content: '请填写手机号！',
                  })
                  _this.setData({ isClick: true })
                  return false
                }
              }
              
              // if (allData[a] == undefined || allData[a] == 'undefined' || allData[a] == '') {
              //   _this.setData({ isClick: true })
              //   wx.showModal({
              //     title: '提示',
              //     content: '请完善客户信息！',
              //   })
              //   wx.hideLoading()
              //   return false
              // }
            }
            // if (!phoneIsRealy) {
            //   _this.setData({ isClick: true })
            //   wx.showToast({
            //     title: '电话有误，请检查输入',
            //     icon: 'none'
            //   })
            //   wx.hideLoading()
            //   return false
            // }
            // if (!nameIsRealy) {
            //   _this.setData({ isClick: true })
            //   wx.showToast({
            //     title: '姓名有误，请检查输入',
            //     icon: 'none'
            //   })
            //   wx.hideLoading()
            //   return false
            // }
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
                  wx.hideLoading()
                  setTimeout(function () {
                    _this.setData({ isClick: true })
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1000)
                }
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '请上传理赔资料照片！！',
            })
            _this.setData({ isClick: true })
            wx.hideLoading()
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '请上传现场照片！！',
        })
        _this.setData({ isClick: true })
        wx.hideLoading()
      }
    })
    // console.log('form发生了submit事件，携带数据为：', allData)
    
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
  uploading: function (urlName, urlData, resovle){
    var names = []
    var k = 0
    var userId = app.globalData.sessionId
    var _this = this
    if (urlData.length > 0) {
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
              console.log('上面判断的names：', names, k, urlData.length)
              names.push(data.data[0])
              if (k + 1 == urlData.length) {
                console.log('上传完了：', names)
                var namess = names.join('|')
                // if (urlName == 'claimImg') {
                //   wx.showToast({
                //     title: '现场上传成功！',
                //     icon: 'success'
                //   })
                // } else {
                //   wx.showToast({
                //     title: '资料上传成功！',
                //     icon: 'success'
                //   })
                // }
                
                _this.setData({ [urlName]: namess })
                resovle(1)
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
    } else {
      resovle(0)
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