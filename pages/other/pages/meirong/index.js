var app = getApp()
var api = app.globalData.api
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    star: 3,//星数
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    userMotai: true,
    sure: true
  },
  onShow: function(){
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
  close: function () {
    console.log(123)
    this.setData({
      isNone: false,
      userMotai: false,
      sure: false
    })
  }
})