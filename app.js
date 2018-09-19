//app.js
App({
  onShow: function() {
    // var _this = this
    // var api = _this.globalData.api
    // var requestIs = _this.globalData.requestIs
    // console.log('onLaunch里面有没有执行：', !requestIs)
  },
  onLaunch: function() {
    var _this = this
    
    var api = _this.globalData.api
    var wss = _this.globalData.wss
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          console.log('已经授权')
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              getApp().globalData.userInfo = res.userInfo
              _this.globalData.status = 1
            }
          })
        } else {
          console.log('没有授权')
          _this.globalData.status = 0
        }
      }
    })
    wx.login({
      success: function(res) {
        if (res.code) {
          // console.log(res)
          // 发起网络请求
          // console.log('jsCode:', res.code)
          console.log('接收的scene值：', _this.globalData.scene)
          var scene = _this.globalData.scene
          console.log('api++++++++++++++++++++++++++++++:', api + 'api/v1/wx/getSession?code=' + res.code)
          wx.request({
            url: api + 'api/v1/wx/getSession?code=' + res.code,
            success: function(ress) {
              console.log('接收的值xxxxxxxxxxxxxx:', ress.data.data.sessionId)
              _this.globalData.sessionId = ress.data.data.sessionId
              var userId = ress.data.data.sessionId
              
              wx.request({
                url: api + 'api/v1/wx/user/get',
                data: {
                  'thirdSessionKey': userId
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function(res) {
                  console.log('获得所有信息：', res)
                  // console.log('连接websocket的测试:', res.data.data.userType)
                  console.log('二维码没有：', res.data.data.extensionAccount == '')
                  if (res.data.data.extensionAccount == '') {//如果有二维码
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
                  getApp().globalData.requestIs = true
                  var userType = res.data.data.userType //用户的身份信息
                  if (userType == 1) {
                    wx.connectSocket({
                      url: wss
                    })
                    wx.onSocketOpen(function(res) {
                      console.log('WebSocket连接已打开2222！')
                      wx.sendSocketMessage({
                        data: JSON.stringify({
                          'thirdSessionKey': userId
                        }),
                        success: function(res) {
                          console.log('消息发送成功11111！')
                        }
                      })
                    })
                    
                    wx.onSocketError(function(res) {
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
                    //每隔10s想后台推送用户定位
                    setInterval(function() {
                      wx.getLocation({
                        type: 'gcj02',
                        success: function(res) {
                          var latitude = res.latitude
                          var longitude = res.longitude
                          console.log('地址推送：', latitude, longitude)
                          wx.sendSocketMessage({
                            data: JSON.stringify({
                              'thirdSessionKey': userId,
                              'lat': latitude,
                              'lng': longitude
                            }),
                            success: function(res) {
                              console.log('消息发送成功22222！')
                            },
                            fail: function(e){
                              wx.closeSocket({
                                success: function(res){
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
                    wx.onSocketMessage(function(res) {
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
                  }
                  var val = res.data.data.alipayAccount//支付宝账号 未加密
                  console.log('app里面获得的val:', val)
                  if (val) {
                    var newVal = val.slice(0, 2) + '****' + val.slice(val.length - 2, val.length)// 加密后的支付宝
                  } else {
                    var newVal = ''
                  }
                  var placeholder = res.data.data.phone//手机号
                  if (placeholder) {
                    var newPhone = placeholder.slice(0, 3) + '****' + placeholder.slice(placeholder.length - 4, placeholder.length)//加密后的手机号
                  } else {
                    var newPhone = ''
                  }
                  var userType = res.data.data.userType//用户类型
                  console.log('placeholder:', placeholder)
                  var extensionAccount = res.data.data.extensionAccount

                  _this.globalData.val = val
                  _this.globalData.newVal = newVal
                  _this.globalData.placeholder = placeholder
                  _this.globalData.newPhone = newPhone
                  _this.globalData.userType = userType
                  _this.globalData.isOk = true
                  _this.globalData.extensionAccount = extensionAccount//是否已经使用二维码进入
                  
                  var status = _this.globalData.status
                  var userType = _this.globalData.userType
                  var userInfo = _this.globalData.userInfo
                  if (userInfo) {
                    var hasUserInfo = true
                    _this.globalData.hasUserInfo = true
                  } else {
                    var hasUserInfo = false
                    _this.globalData.hasUserInfo = false
                  }
                  var getInfo = {
                    'val': val,
                    'newVal': newVal,
                    'placeholder': placeholder,
                    'newPhone': newPhone,
                    'status': status,
                    'userType': userType,
                    'userInfo': userInfo,
                    'hasUserInfo': hasUserInfo,
                    'extensionAccount': extensionAccount
                  }
                  //这里监听是否当前有这个函数，如果有，那说明其余页面已经比此页面先执行，那么再次调用此函数，并传入值，其余页面接收该值
                  if (_this.getInfoCallback) {
                    _this.getInfoCallback(getInfo)
                  }
                },
                fail: function(e){
                  console.log('请求失败的原因：', e)
                }
              })
              console.log(_this.globalData.sessionId)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  globalData: {
    userInfo: null,
    sessionId: null,
    // api: 'https://chejiqiche.com/',
    // wss: 'wss://chejiqiche.com/wss',
    wss: 'ws://118.24.150.197:7397/',
    api: 'http://118.24.150.197:8080/',
    // api: 'http://kosan.tunnel.qydev.com/',
    // api: 'http://192.168.11.119:8080/',
    zt: false
  }
})