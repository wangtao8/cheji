var app = getApp()
var api = app.globalData.api
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    star: 5,//星数
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    userMotai: true,
    sure: true,
    windowShow: false,
    isClick: true
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
          _this.setData({ windowShow: false, isClick: true })
          wx.showModal({
            title: '提示',
            content: '提交成功，请等待回复',
          })
        }
      }
    })
  },
  onLoad: function(){
    var _this = this
    wx.getSystemInfo({
      success(res) {
        var PmHeight = res.windowHeight
        var elTop = PmHeight - 240 + 'rpx'
        console.log('PmHeight:', PmHeight)
        _this.setData({ elTop: elTop })
      }
    })
    /**
      * WxParse.wxParse(bindName , type, data, target,imagePadding)
      * 1.bindName绑定的数据名(必填)
      * 2.type可以为html或者md(必填)
      * 3.data为传入的具体数据(必填)
      * 4.target为Page对象,一般为this(必填)
      * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
      */
    /**
      *  INIT(-1, "未知类型"),
      *  SGDB(0, "事故代办"),
      *  WSPF(1, "物损赔付"),
      *  RSDF(2, "人伤垫付"),
      *  JDLP(3, "交单理赔"),
      *  FLFW(4, "法律服务"),
      *  SGXCLP(5, "现场理赔"),
      *  DBC(6, "代步车"),
      *  QTYW(7, "其他业务"),
      *  GDXW(8, "滚动新闻");
      */
    // WxParse.wxParse('article', 'html', htlb, _this, 5);
    _this.getAllPtt(8)
    _this.getTeacherInfo()
  },
  getAllPtt: function(e){//得到对应类型下面的图片信息(富文本)
    var _this = this
    wx.request({//新闻案例接口
      url: api + 'api/v1/wx/notice/list',
      data: {
        "newsType": e
      },
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      success: function (res) {
        console.log('富文本：', res.data)
        var allPpt = res.data
        if (e == 8){
          _this.setData({ allPpt: allPpt })
        }
      }
    })
  },
  onShow: function () {
    var _this = this
    wx.getSystemInfo({
      success: function (res) {
        console.log('屏幕宽度：', res.windowWidth)
        var elWidth = parseInt(res.windowWidth)
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
        setInterval(function(){
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
        },1500)
      }
    })

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
  },
  goInfo: function (e) {
    var _this = this
    var id = e.currentTarget.dataset.id
    if (id == 7) {
      _this.setData({ windowShow: true })
    } else if (id == 8) {
      wx.navigateTo({
        url: '../../../erweima/index'
      })
    } else {
      wx.navigateTo({
        url: '../../../lipeiInfo/index?ids=' + id
      })
    }
  },
  closeWindow: function () {//关闭咨询窗口
    this.setData({ windowShow: false })
  },
  goPptInfo: function(e){//获得轮播图详情
    var val = e.currentTarget.dataset.value
    var newVal = {}
    for(var nam in val) {
      // console.log(nam)
      if (nam == 'content') {
        console.log(1)
        val[nam] = encodeURIComponent(val[nam])
        newVal.content = val[nam]
      } else {
        console.log(2)
        newVal[nam] = val[nam]
      }
    }
    console.log('newVal:', newVal)
    wx.navigateTo({
      url: '../liPeiNews/index?val=' + JSON.stringify(newVal)
    })
  },
  getTeacherInfo: function(){
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
  }
})