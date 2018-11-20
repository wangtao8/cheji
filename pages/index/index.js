// pages/index/index.js
var app = getApp()
var api = app.globalData.api
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData: {},
    star: 5,
    windowShow: false,
    isClick: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    app.getUserId = res => {
      _this.setData({ userId: res, api: api })
    }
    var scene = decodeURIComponent(options.scene) || null
    // var scene = '1231312312312123'
    app.globalData.scene = scene
    console.log('app.globalData.scene:', app.globalData.scene)
    wx.getSystemInfo({
      success(res) {
        var PmHeight = res.windowHeight
        var elTop = PmHeight - 240 + 'rpx'
        console.log('PmHeight:', PmHeight)
        _this.setData({ elTop: elTop })
      }
    })
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
    wx.getSystemInfo({
      success: function (res) {
        console.log('手机品牌：', res.brand)
        _this.setData({ brand: res.brand })
      }
    })
    _this.getTeacherInfo()
    
  },
  closeWindow: function () {//关闭咨询窗口
    this.setData({ windowShow: false })
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
    this.getAllUserInfo()
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log('是否有新版本：', res.hasUpdate)
    })

   /** 
    * 更新并重启应用
    */
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
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
  /** 
    * 获得理赔老师信息
    */
  getTeacherInfo: function () {
    var _this = this
    var userId = app.globalData.sessionId
    wx.request({
      url: api + 'api/v1/wx/claim/claimerShow/get',
      data: {
        'thirdSessionKey': userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('查看获得理赔老师的详细信息：', res.data.data)
        if (res.data.errorCode == 5001) {
          wx.login({
            success: function (res) {
              if (res.code) {
                // console.log(res)
                // 发起网络请求
                console.log('重新获得jsCode333:', res.code)
                wx.request({
                  url: api + 'api/v1/wx/getSession?code=' + res.code,
                  success: function (ress) {
                    app.globalData.sessionId = ress.data.data.sessionId
                    _this.getTeacherInfo()
                  }
                })
              }
            }
          })
        } else {
          _this.setData({ allTeacher: res.data.data })
        }
      }
    })
  },
  /** 
    * 跳转到视频定位页面
    */
  goPhoto: function () {
    var userId = app.globalData.sessionId
    var brand = this.data.brand.toLocaleLowerCase()
    var isHuaWei = brand == 'huawei' ? true : false
    console.log('最后判断是否为华为手机：', isHuaWei)
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitudes = parseFloat(res.latitude)
        var longitudes = parseFloat(res.longitude)
        console.log('定位获得的经纬度：', latitudes, longitudes)
        if (isHuaWei) {
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths
              wx.navigateTo({
                url: "../vedeoInfo/index?tempFilePath=" + tempFilePaths + '&latitudes=' + latitudes + '&longitudes=' + longitudes,
              })
            },
            fail: function (e) {
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
                url: "../vedeoInfo/index?tempFilePath=" + res.tempFilePath + '&latitudes=' + latitudes + '&longitudes=' + longitudes,
              })
            }
          })
        }
      }
    })
  },
  /** 
    * 获得后台存的用户信息
    */
  getAllUserInfo: function () {//获得用户所有保存过的信息
    var _this = this
    var userId = app.globalData.sessionId
    wx.request({
      url: api + 'api/v1/wx/user/get',
      data: {
        'thirdSessionKey': userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('重新获得所有信息：', res.data.data)
        if (res.data.errorCode == 5001) {
          wx.login({
            success: function (res) {
              if (res.code) {
                // console.log(res)
                // 发起网络请求
                console.log('重新获得jsCode333:', res.code)
                wx.request({
                  url: api + 'api/v1/wx/getSession?code=' + res.code,
                  success: function (ress) {
                    app.globalData.sessionId = ress.data.data.sessionId
                    _this.getAllUserInfo()
                  }
                })
              }
            }
          })
        } else {
          // var scene = app.globalData.scene
          var scene = app.globalData.scene == 'undefined' ? '' : app.globalData.scene
          console.log('index页面查看scene值:', app.globalData)
          if (res.data.data.extensionAccount == '') {//如果没有二维码
            wx.request({
              url: api + 'api/v1/wx/extension/add',
              data: {
                'thirdSessionKey': userId,
                'extensionAccount': scene
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              success: function (res) {
                console.log('绑定二维码：', res.data)
              }
            })
          } else {
            console.log('已经绑定了二维码！！！')
          }
          wx.hideLoading()
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
        }
      }
    })
  },
  /** 
    * 跳转到对应的入口页面
    */
  prompt: function (e) {
    var ids = e.currentTarget.dataset.id
    if (ids == 0) {
      wx.navigateTo({
        url: '../meirong/index',
      })
    } else if (ids == 2) {
      // wx.showToast({
      //   title: '敬请期待^ ^',
      //   icon: 'none',
      //   duration: 1000
      // })
      wx.navigateTo({
        url: '../lipei/pages/lipei/index',
      })
    } else {
      wx.showToast({
        title: '敬请期待^ ^',
        icon: 'none',
        duration: 1000
      })
    }
  },
  /** 
    * 跳转到理赔详情页
    */
  goInfo: function (e) {
    var _this = this
    var id = e.currentTarget.dataset.id
    if (id == 7) {
      _this.setData({ windowShow: true })
    } else if ( id == 8) {
      wx.navigateTo({
        url: '../erweima/index'
      })
    } else {
      wx.navigateTo({
        url: '../lipeiInfo/index?ids=' + id
      })
    }
  },
  /**
   * 用户提交表单
   */
  formSubmit: function (e) {
    var _this = this
    var formValue = e.detail.value
    var userId = app.globalData.sessionId
    _this.setData({ isClick: false })
    wx.showLoading({
      title: '提交中',
    })
    if (formValue.userPhone && formValue.userName) {
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          var latitudes = parseFloat(res.latitude)
          var longitudes = parseFloat(res.longitude)
          console.log(longitudes)
          var qqmapsdk = new QQMapWX({
            key: 'E6OBZ-I2YK6-QWESQ-MH3TB-OZUKO-THBPD' // 必填
          });
          qqmapsdk.reverseGeocoder({//逆地址解析
            location: {
              latitude: latitudes,
              longitude: longitudes
            },
            success: function (addressRes) {
              var address = addressRes.result.formatted_addresses.recommend//需要的地址
              console.log('查看逆解析的地址包括所有信息：', formValue.userPhone, formValue.userName, longitudes, latitudes, address)
              _this.uploadForm(formValue.userPhone, formValue.userName, longitudes, latitudes, address, userId)
              wx.hideLoading()
            }
          })
        }
      })
    } else {
      _this.setData({ isClick: true })
      wx.showToast({
        title: '请完善您的个人信息',
        icon: 'none'
      })
    }
  },
  /** 
    * 提交理赔订单
    */
  uploadForm: function (userPhone, userName, longitudes, latitudes, address, userId) {
  /**
    *type 值=0为事故代办 值=1为无损赔付 值=2为人伤垫付 值=3为交单理赔 值=4为法律服务 值=5为现场理赔
    */
    var _this = this
    var types = 7
    wx.request({
      url: api + 'api/v1/wx/claim/add',
      data: {
        'phone': userPhone,
        'name': userName,
        'lng': longitudes,
        'lat': latitudes,
        'address': address,
        'thirdSessionKey': userId,
        'type': types
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (e) {
        console.log('上传用户信息结果：', e)
        if (e.data.errorCode == 5001) {

        } else {
          _this.setData({ windowShow: false, isClick: true})
          wx.showModal({
            title: '提示',
            content: '提交成功，请等待回复',
          })
        }
      }
    })
  }
})