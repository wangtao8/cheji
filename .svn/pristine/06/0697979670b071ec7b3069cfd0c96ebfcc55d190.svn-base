// pages/vedioInfo/index.js
var wxError = require("../../utils/error.js")
var app = getApp()
var api = app.globalData.api
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var wss = app.globalData.wss
Page({

  /**
   * 页面的初始数据
   */
  data: {
    srcs: null,
    isShow: true,
    latitude: null,
    longitude: null,
    markers: [],
    userMotai: false,
    sure: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    var tempFilePaths = options.tempFilePath
    var isImage = tempFilePaths.indexOf('jpg') > -1 ? 1 : 0
    console.log('页面加载时的图片地址：', tempFilePaths, tempFilePaths.indexOf('jpg'))
    _this.setData({ srcs: tempFilePaths, isImage: isImage})
    _this.getAllUserInfo()//先获得用户信息，然后再判断是否出现让客户鉴权手机号的窗口
    // console.log('是否是否api定位功能：', wx.canIUse('getLocation'))
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitudes = parseFloat(res.latitude)
        var longitudes = parseFloat(res.longitude)
        var speed = res.speed
        var accuracy = res.accuracy
        var tempFilePaths = _this.data.srcs
        var userId = app.globalData.sessionId
        console.log('上传时的经纬度：', latitudes, longitudes)
        var qqmapsdk = new QQMapWX({
          key: 'E6OBZ-I2YK6-QWESQ-MH3TB-OZUKO-THBPD' // 必填
        });
        qqmapsdk.reverseGeocoder({//逆地址解析
          location: {
            latitude: latitudes,
            longitude: longitudes
          },
          success: function (addressRes) {
            var address1 = addressRes.result.formatted_addresses.recommend//需要的地址
            var component = addressRes.result.address_component
            var province = component.province
            var city = component.city
            var district = component.district
            var street_number = component.street_number
            // console.log('省：', component.province)
            // console.log('市：', component.city)
            // console.log('区：', component.district)
            // console.log('街道：', component.street_number)
            // console.log('所有信息：', addressRes)
            var address = province + city + address1//未处理的地址
            // var address = '四川省成都市龙泉驿区保利玫瑰花语& #40;金桉路南& #41;'//最开始未处理的地址
            _this.getNewAddres(address)
            console.log('处理后的地址:', _this.data.address, tempFilePaths)
            //上传视频 地理坐标 实际地址
            _this.upLoadInfo(longitudes, latitudes, userId, _this.data.address, tempFilePaths, isImage)
          },
          fail: function (e) {
            console.log('错误：', e)
          }
        })
        console.log(latitudes, longitudes)
        //地图定位的图标显示
        var markers = [{
          id: 1,
          iconPath: "/images/location.png",
          longitude: longitudes,
          latitude: latitudes,
          width: 15,
          height: 15
        }]
        _this.setData({ latitude: latitudes, longitude: longitudes, markers: markers, isShow: false })
      }
    })
  },
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
          // var val = res.data.data.alipayAccount//支付宝账号 未加密
          console.log('重新获得所有信息：', res.data.data)
          // if (val) {
          //   var newVal = val.slice(0, 2) + '****' + val.slice(val.length - 2, val.length)// 加密后的支付宝
          // } else {
          //   var newVal = ''
          // }
          var placeholder = res.data.data.phone//手机号
          if (placeholder) {
            var newPhone = placeholder.slice(0, 3) + '****' + placeholder.slice(placeholder.length - 4, placeholder.length)//加密后的手机号
          } else {
            var newPhone = ''
          }
          var userType = res.data.data.userType//用户类型
          
          _this.setData({
            shouji: newPhone, //手机号（加密）
            placeholder: placeholder, //手机账号（未加密）
            userType: userType, //用户类型
          })
          wx.hideLoading()
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
        }
      }
    })
  },
  upLoadInfo: function (longitudes, latitudes, userId, address, tempFilePaths, isImage) {//上传视频 地理坐标 实际地址
    var _this = this
    var placeholder = _this.data.placeholder
    console.log('上传视频 地理坐标 实际地址:', longitudes, latitudes, userId, address)
    wx.uploadFile({
      url: api + 'api/v1/wx/accid/add',
      filePath: tempFilePaths,
      name: 'file',
      formData: {
        'lng': longitudes,
        'lat': latitudes,
        'thirdSessionKey': userId,
        'address': address,
        'isImage': isImage
      },
      success: function (res) {
        console.log('上传信息成功!')
        var data = res.data
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
                    // _this.upLoadInfo()
                  }
                })
              }
            }
          })
        } else {
          var content = '上传成功！请在主页面点击“我的--会员认证”，我们会对您的个人信息严格保密！'
          _this.setData({
            userMotai: true,
            sure: true
          })
          console.log('上传结果：', res.data)
        }
      },
      fail: function(e){
        console.log('上传失败：', e)
      }
    })
  },
  lookImg: function(){//预览图片
    var temps = this.data.srcs 
    var urls = []
    urls.push(temps)
    wx.previewImage({
      current: temps, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  goBack: function(){
    wx.navigateBack({
      delta: 1
    })
  },
  getNewAddres: function(e){//处理地址中的特殊字符串
    var _this = this
    var Arr = e.split('')//处理成为数组
    var index = e.indexOf('&')//特殊符号的位置
    if (index == -1) {//如果不存在特殊符号
      _this.data.address = Arr.join('')
      return
    } else {
      Arr.splice(index, 6)//去除该特殊符号
      var NewArr = Arr.join('')//还原成为字符串继续查找
      _this.getNewAddres(NewArr)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    var _this = this
    _this.mapCtx = wx.createMapContext('myMap')
    wx.getLocation({
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitudes = parseFloat(res.latitude)
        var longitudes = parseFloat(res.longitude)
        var speed = res.speed
        var accuracy = res.accuracy
        var tempFilePaths = _this.data.srcs
        var userId = app.globalData.sessionId
        console.log('上传时的经纬度：', latitudes, longitudes)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideShareMenu()
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
  getPhoneNumber: function (e) {
    var _this = this
    console.log('用户点击确定或者取消：', e.detail.errMsg)
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      console.log('用户点击了确定')
      var userId = app.globalData.sessionId
      wx.request({
        url: api + 'api/v1/wx/decodeUserInfo',
        data: {
          'sessionId': userId,
          'iv': e.detail.iv,
          'encryptedData': e.detail.encryptedData
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          console.log(JSON.parse(res.data.data).phoneNumber)
          var placeholders = JSON.parse(res.data.data).phoneNumber
          console.log('placeholders:', placeholders)
          var newVal = placeholders.slice(0, 3) + '****' + placeholders.slice(placeholders.length - 4, placeholders.length)
          app.globalData.placeholder = newVal
          app.globalData.isOk = true
          wx.request({//获取userType
            url: api + 'api/v1/wx/user/get',
            data: {
              'thirdSessionKey': userId
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log('授权号码时，重新获取userType值：', res.data.data.userType)
              _this.setData({
                userMotai: false,
                sure: false
              })
              app.globalData.userType = res.data.data.userType
              var userType = res.data.data.userType //用户的身份信息
              console.log('WebSocket的人员验证：', userType)
              if (userType == 1) {
                console.log('WebSocket是工作人员：', userType)
                wx.connectSocket({
                  url: wss
                })
                wx.onSocketOpen(function (res) {
                  console.log('WebSocket连接已打开2222！')
                  wx.sendSocketMessage({
                    data: JSON.stringify({
                      'thirdSessionKey': userId
                    }),
                    success: function (res) {
                      console.log('消息发送成功11111！')
                    }
                  })
                })

                wx.onSocketError(function (res) {
                  console.log('WebSocket连接打开失败，请检查！', res)
                })
                wx.getLocation({
                  type: 'gcj02',
                  success: function (res) {
                    var latitude = res.latitude
                    var longitude = res.longitude
                    console.log('地址推送：', latitude, longitude)
                    wx.sendSocketMessage({
                      data: JSON.stringify({
                        'thirdSessionKey': userId,
                        'lat': latitude,
                        'lng': longitude
                      }),
                      success: function (res) {
                        console.log('消息发送成功22222！')
                      },
                      fail: function (e) {
                        wx.closeSocket({
                          success: function (res) {
                            console.log('发送消息失败后：', res)
                          }
                        })
                        wx.connectSocket({
                          url: wss
                        })
                        wx.onSocketOpen(function (res) {
                          console.log('WebSocket连接已打开2222！')
                          wx.sendSocketMessage({
                            data: JSON.stringify({
                              'thirdSessionKey': userId
                            }),
                            success: function (res) {
                              console.log('消息发送成功333333！')
                            }
                          })
                        })
                        wx.onSocketMessage(function (res) {
                          console.log('收到服务器内容22222：' + res.data)
                          wx.vibrateLong()//使手机发生震动
                          wx.showTabBarRedDot({ //显示提示的小红点 放在webscoket 接收消息里面
                            index: 3
                          })
                          getApp().globalData.zt = true
                          const innerAudioContext = wx.createInnerAudioContext()
                          innerAudioContext.autoplay = true //播放提醒音乐
                          innerAudioContext.loop = false
                          innerAudioContext.volume = 1
                          innerAudioContext.src = api + 'video/notice/noticelp.mp3'
                          console.log('链接：', api + 'video/notice/noticelp.mp3')
                        })
                      }
                    })
                  }
                })
                //每隔10s向后台推送用户定位
                setInterval(function () {
                  wx.getLocation({
                    type: 'gcj02',
                    success: function (res) {
                      var latitude = res.latitude
                      var longitude = res.longitude
                      console.log('地址推送：', latitude, longitude)
                      wx.sendSocketMessage({
                        data: JSON.stringify({
                          'thirdSessionKey': userId,
                          'lat': latitude,
                          'lng': longitude
                        }),
                        success: function (res) {
                          console.log('消息发送成功22222！')
                        },
                        fail: function (e) {
                          wx.closeSocket({
                            success: function (res) {
                              console.log('发送消息失败后：', res)
                            }
                          })
                          wx.connectSocket({
                            url: wss
                          })
                          wx.onSocketOpen(function (res) {
                            console.log('WebSocket连接已打开2222！')
                            wx.sendSocketMessage({
                              data: JSON.stringify({
                                'thirdSessionKey': userId
                              }),
                              success: function (res) {
                                console.log('消息发送成功333333！')
                              }
                            })
                          })
                          wx.onSocketMessage(function (res) {
                            console.log('收到服务器内容22222：' + res.data)
                            wx.vibrateLong()//使手机发生震动
                            wx.showTabBarRedDot({ //显示提示的小红点 放在webscoket 接收消息里面
                              index: 3
                            })
                            getApp().globalData.zt = true
                            const innerAudioContext = wx.createInnerAudioContext()
                            innerAudioContext.autoplay = true //播放提醒音乐
                            innerAudioContext.loop = false
                            innerAudioContext.volume = 1
                            innerAudioContext.src = api + 'video/notice/noticelp.mp3'
                            console.log('链接：', api + 'video/notice/noticelp.mp3')
                          })
                        }
                      })
                    }
                  })
                }, 10000)

                //接收消息
                wx.onSocketMessage(function (res) {
                  console.log('收到服务器内容22222：' + res.data)
                  wx.vibrateLong()//使手机发生震动
                  wx.showTabBarRedDot({ //显示提示的小红点 放在webscoket 接收消息里面
                    index: 3
                  })
                  getApp().globalData.zt = true
                  const innerAudioContext = wx.createInnerAudioContext()
                  innerAudioContext.autoplay = true //播放提醒音乐
                  innerAudioContext.loop = false
                  innerAudioContext.volume = 1
                  innerAudioContext.src = api + 'video/notice/noticelp.mp3'
                })

                wx.onSocketClose(function (res) {
                  console.log('WebSocket 已关闭！')
                })
              } else {
                console.log('WebSocket不是工作人员：', userType)
              }
            }
          })
          _this.setData({
            placeholder: newVal
          })
          // _this.getAllUserInfo()
        }
      })
    } else {
      _this.setData({
        userMotai: false,
        sure: false
      })
    }
    // this.setData({
    //   status: 1
    // }) //设置为已登录状态
  },
  moveToLocation: function () {
    var _this = this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitudes = res.latitude
        var longitudes = res.longitude
        var marker = [{
          id: 1,
          iconPath: "/images/location.png",
          longitude: longitudes,
          latitude: latitudes,
          width: 15,
          height: 15
        }]
        _this.setData({ latitude: latitudes, longitude: longitudes, markers: marker })
        _this.mapCtx.moveToLocation()
      }
    })
  },
  close: function () {
    this.setData({
      userMotai: false,
      sure: false
    })
  },
  sendInfo: function () {
    var _this = this
    var tempFilePaths = _this.data.srcs
    var latitudes = _this.data.latitude
    var longitudes = _this.data.longitude
    var userId = app.globalData.sessionId
    wx.uploadFile({
      url: api + 'api/v1/wx/accid/add',
      filePath: tempFilePaths,
      name: 'file',
      formData: {
        'lng': longitudes,
        'lat': latitudes,
        'thirdSessionKey': userId
      },
      success: function (res) {
        var data = res.data
        _this.setData({ isShow: false })
        console.log('上传结果：', res.data)
        //do something
      }
    })
    console.log(latitude, longitude)
  }
})