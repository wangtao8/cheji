var app = getApp()
var api = app.globalData.api
// pages/myCase/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVal: null,//进度
    pageIndex: 0,
    urls: null,//图片集合
    ids: null,//1为自己提交的订单  3为派发给师父的订单
    sgId: null,//事订单id
    array: ['已下单', '理赔中', '完成'],
    index: null,//进度状态码
    sGType: ['事故代办', '无损赔付', '人伤垫付', '交单理赔', '法律服务', '免费代步车', '其它业务', '我要理赔']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    var ids = options.ids // 1为自己上传的订单  3为派发给师父的订单
    console.log('事故列表的Id：', options.id)
    wx.showLoading({
      title: '请稍等...',
    })
    _this.mySgUpload(0, options.id)
    _this.setData({ ids: ids, sgId: options.id})
  },
  mySgUpload: function (e,index) { //我的上传记录
    var _this = this
    var userId = app.globalData.sessionId
    var pageIndex = _this.data.pageIndex + 1
    var pageSizes = 10 + 10 * pageIndex

    wx.showNavigationBarLoading()
    wx.request({
      url: api + 'api/v1/wx/claim/user/get',
      data: {
        'thirdSessionKey': userId,
        'limit': e == 1 ? 10 : 20,
        'offset': e == 1 ? pageSizes : 0,
        'id': index
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // console.log('我的事故上传记录:', res.data.data.records)
        if (res.data.errorCode == 5001) {
          wx.login({
            success: function (res) {
              if (res.code) {
                // console.log(res)
                // 发起网络请求
                // console.log('重新获得jsCode:', res.code)
                wx.request({
                  url: api + 'api/v1/wx/getSession?code=' + res.code,
                  success: function (ress) {
                    app.globalData.sessionId = ress.data.data.sessionId
                    _this.mySgUpload(0, index)
                  }
                })
              }
            }
          })
        } else {
          if (e == 0) {//刷新的情况
            var content = res.data.data.records
            var pageAll = res.data.data.total
            var urls = []
            var url = content[0].claimImg
            if (url) {
              urls = url.split('|')//得到图片集合
            }
            var jindu
            var status = content[0].status
            if (status == 0) {
              jindu = 0
            } else if (status == 1) {
              jindu = 50
            } else {
              jindu = 100
            }
            console.log('查询单个的理赔订单数据1', content)
            _this.setData({
              allData: content,
              pageAll: pageAll,
              pageIndex: 0,
              urls: urls,
              isVal: jindu,
              index: status
            })
          } else {//上拉的情况
            console.log('查询单个的理赔订单数据2:', res.data)
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
  goPhone: function (e) {//拨打理赔老师电话
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  lookImg: function(e){
    var id = e.currentTarget.dataset.id
    var urls = this.data.urls
    wx.previewImage({
      current: urls[id], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  chooseImg: function(){//选择图片
    var _this = this
    var readyUploadUrls = _this.data.readyUploadUrls || []
    var imgLth = readyUploadUrls.length
    wx.chooseImage({
      count: 9 - imgLth, 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        if (readyUploadUrls) {
          for (var i = 0; i < tempFilePaths.length; i++){
            readyUploadUrls.unshift(tempFilePaths[i])
          }
          _this.setData({ readyUploadUrls: readyUploadUrls })
        } else {
          readyUploadUrls = []
          _this.setData({ readyUploadUrls: tempFilePaths })
        }
        
        
      },
      fail: function(e){
        console.log('失败的原因：', e)
      }
    })
  },
  uploadImg: function(){//上传图片
    var _this = this
    var urls = _this.data.readyUploadUrls
    var userId = app.globalData.sessionId
    var index = urls.length
    var sgId = _this.data.sgId//订单id.
    var k = 0
    var imgUrls
    wx.showLoading({
      title: '上传中...',
    })
    for (var i = 0; i < urls.length; i++) {
      wx.uploadFile({//上传图片接口
        url: api + 'api/v1/wx/claim/uploadfile',
        filePath: urls[i],
        name: 'file',
        formData: {
          'thirdSessionKey': userId
        },
        success: function (res) {
          
          var data = JSON.parse(res.data)

          // debugger
          k++
          imgUrls = imgUrls === undefined ? data.data[0] : imgUrls+'|' + data.data[0]
          if (k == index) {
            wx.request({//绑定图片与理赔订单接口
              url: api + 'api/v1/wx/claim/add_img',
              data: {
                'thirdSessionKey': userId,
                'id': sgId,
                'claimImg' : imgUrls
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              success: function (res) {
                console.log(res.data)
                _this.setData({ urls: urls, readyUploadUrls: []})
                wx.hideLoading()
              }
            })
          }
          console.log('上传完了：', data, k, index, imgUrls)
        }
      })
    }
  },
  closeImg: function (e) {//删除图片
    var _this = this
    var id = e.currentTarget.dataset.id
    var readyUploadUrls = _this.data.readyUploadUrls
    readyUploadUrls.splice(id, 1)
    console.log(id, readyUploadUrls)
    _this.setData({ readyUploadUrls: readyUploadUrls})
  },
  bindPickerChange: function(e){//改变订单处理状态
    var _this = this
    var index = e.detail.value
    var isVal = null
    var userId = app.globalData.sessionId
    var sgId = _this.data.sgId
    if (index == 0){
      isVal = 0
    } else if (index == 1) {
      isVal = 50
    } else {
      isVal = 100
    }
    wx.request({//更改理赔订单状态接口
      url: api + 'api/v1/wx/claim/changeStatus',
      data: {
        'thirdSessionKey': userId,
        'id': sgId,
        'status': index
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log('改变状态的结果：', res.data)
        _this.setData({ index: index, isVal: isVal })
      }
    })
  }
})