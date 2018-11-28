// pages/my/index.js
var app = getApp()
var api = app.globalData.api
var wss = app.globalData.wss
console.log('myApp:', app.globalData)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zT: app.globalData.zt, //消息通知
    zhiVal: null, //加密的支付宝
    defineOrchange: null, //绑定支付宝的确定按钮是否显示
    zhiNum: null, //不加密的支付宝
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    shouji: null,
    placeholder: null, //手机号
    userType: null, //用户0或者是师傅1  2为外部人员
    unread: null,
    status: 0, //用户是否授权
    isFocus: false,
    userMotai: true,
    sure: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this
    wx.showLoading({
      title: '加载中...',
    })
    app.getUserId = res => {
      _this.setData({ userId: res, api: api })
    }
    // 如果已经授权那么直接显示
      if (app.globalData.sessionId && app.globalData.isOk) {
        console.log('拿到了sessionId', app.globalData.sessionId, app.globalData.val, app.globalData.status, 'placeholder:', app.globalData.placeholder)
        var val = app.globalData.val
        var newVal = app.globalData.newVal
        var placeholder = app.globalData.placeholder
        var userType = app.globalData.userType
        var newPhone = app.globalData.newPhone
        var userInfo = app.globalData.userInfo
        var hasUserInfo = app.globalData.hasUserInfo
        var status = app.globalData.status
        _this.setData({
          zhiVal: newVal, //支付宝账号（加密）
          zhiNum: val, //支付宝账号（未加密）
          shouji: newPhone, //手机号（加密）
          placeholder: placeholder, //手机账号（未加密）
          userType: userType, //用户类型
          userInfo: userInfo, //用户信息
          status: status, //是否鉴权
          hasUserInfo: hasUserInfo //是否鉴权
        })
        wx.hideLoading()
      } else {
        //定义一个函数到app，如果比app更先执行，那么app就会再次执行该函数，并传入值
        app.getInfoCallback = res => {
          console.log('没拿到sessionId1:', res)
          _this.setData({
            zhiVal: res.newVal, //支付宝账号（加密）
            zhiNum: res.val, //支付宝账号（未加密）
            shouji: res.newPhone, //手机号（加密）
            placeholder: res.placeholder, //手机账号（未加密）
            userType: res.userType, //用户类型
            userInfo: res.userInfo, //用户信息
            hasUserInfo: res.hasUserInfo, //是否鉴权
            status: res.status //用户是否授权
          })
          wx.hideLoading()
        }
      }
  },
  /**
   * 跳转到信息处理页面
   */
  processItr: function(){
    var userAllData = this.data.userAllData
    var bindAccount = userAllData.bindAccount
    console.log('跳转时获得的登陆状态：',  bindAccount)
    if (bindAccount != '' && bindAccount != undefined) {
      wx.navigateTo({
        url: '../processItr/pages/peifu/index',
      })
    } else {
      wx.navigateTo({
        url: '../login/index',
      })
    }
    
  },
  /**
   * 跳转到汽车保养列表
   */
  package: function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../package/pages/home/index?id=' + id,
    })
  },
  /**
   * 跳转到汽车保养页面
   */
  qqby:function(){
    wx.navigateTo({
      url: '../package/pages/index/index',
    })
  },
  /**
   * 获得用户信息
   */
  getUserInfo: function(e) {
    console.log('手动获取的参数:', e.detail.rawData)
    var _this = this
    if (e.detail.rawData) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      var avatarUrl = e.detail.userInfo.avatarUrl
      var nickName = e.detail.userInfo.nickName
      _this.pullUserInfo(avatarUrl, nickName)
      _this.getAllUserInfo()
    }
  },
  /**
   * 上传用户头像及昵称
   */
  pullUserInfo: function (avatarUrl, nickName){
    var userId = app.globalData.sessionId
    wx.request({
      url: api + 'api/v1/wx/userinfo/bind',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        'headImg': avatarUrl,
        'wxname': nickName,
        'thirdSessionKey': userId
      },
      success: function(res) {
        console.log('上传用户头像情况：', res.data)
      }
    })
  },
  /**
   * 跳转到粉丝页面
   */
  goMyFans: function(){
    wx.navigateTo({
      url: '../fans2/index'
    })
  },
  /**
   * 事故赔付
   */
  prompt: function(){
    var _this = this
    var userType = this.data.userType
    console.log('usertype333:', userType)
    if (userType == 2) {//跳到理赔页面
      wx.navigateTo({
        url: '../peifu/pages/peifu/index',
      })
    } else if (userType == 3) {//提示等候
      _this.getAllUserInfo()
      wx.showModal({
        title: '提示',
        content: '正在审核，请耐心等候！',
      })
    } else {
      wx.navigateTo({//跳到注册页面
        url: '../peifu/pages/registered/index',
      })
    }
  },
  /**
   * 跳转注册页面
   */
  register: function(){
    wx.navigateTo({
      url: '../peifu/pages/registered/index',
    })
  },
  /**
   * 获得用户所有信息
   */
  getAllUserInfo: function(){
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
        console.log('获得所有信息222：', res.data.errorCode)
        if (res.data.errorCode == 5001) {
          wx.login({
            success: function (res) {
              if (res.code) {
                // console.log(res)
                // 发起网络请求
                console.log('重新获得jsCode222:', res.code)
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
          var val = res.data.data.alipayAccount
          var newVal = val == '' ? val : val.slice(0, 2) + '****' + val.slice(val.length - 2, val.length)
          var placeholder = res.data.data.phone
          var newPhone = placeholder == '' ? placeholder : placeholder.slice(0, 3) + '****' + placeholder.slice(placeholder.length - 4, placeholder.length)
          var userType = res.data.data.userType
          _this.setData({
            zhiVal: newVal,
            placeholder: newPhone,
            zhiNum: val,
            status: 1,
            userType: userType
          })
        }
      }
    })
  },
  onReady: function() {
     
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var _this = this
    var userType = _this.data.userType
    wx.hideTabBarRedDot({ //隐藏导航栏的小红点
      index: 3,
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    if (userType == 0 || userType == 3 ){
      _this.getAllUserInfo()//如果用户为普通用户 或者待审核用户 每次页面重载时获取自己的用户信息 主要用于判断事故赔付的入口问题
    }
    _this.getUnreadyNums()
    _this.getAllUserInfo()
  },
  /**
   * 获取未读消息条数
   */
  getUnreadyNums: function(){
    var _this = this
    var userId = app.globalData.sessionId
    console.log('usertype:', _this.data.userType)
    if (_this.data.userType !== 0) {
      // 查看有多少条未读消息
      wx.request({
        url: api + 'api/v1/wx/accids/pushRecord/count/get',
        data: {
          'thirdSessionKey': userId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log('查看有多少条未读消息：', res.data)
          //var zT = app.globalData.zT//websocket返回的状态 true有消息 false没消息
          if (res.data.errorCode == 5001) {
            wx.login({
              success: function (res) {
                if (res.code) {
                  // console.log(res)
                  // 发起网络请求
                  console.log('重新获得jsCode111:', res.code)
                  wx.request({
                    url: api + 'api/v1/wx/getSession?code=' + res.code,
                    success: function (ress) {
                      app.globalData.sessionId = ress.data.data.sessionId
                      console.log('重新获取的sessionId:', ress.data.data.sessionId)
                      _this.getUnreadyNums()
                    }
                  })
                }
              }
            })
          } else {
            _this.setData({
              unread: res.data.data
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var _this = this
    console.log('下拉了')
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中...',
    })
    _this.getUnreadyNums()//获得多少条未读消息
    _this.getAllUserInfo()
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
        console.log('重新获得所有信息：', res.data.data)
        _this.setData({ userAllData: res.data.data})
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
          var val = res.data.data.alipayAccount//支付宝账号 未加密
          console.log('获得支付宝账号:', val)
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
          _this.setData({
            zhiVal: newVal, //支付宝账号（加密）
            zhiNum: val, //支付宝账号（未加密）
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 改变输入框的值
   */
  changeZhiVal: function(e) {
    var _this = this
    var val = e.detail.value
    console.log(val)
    _this.setData({
      zhiVal: val,
      zhiNum: val
    })
  },
  /**
   * 判断确定按钮是否显示
   */
  bindfocus: function(e) {
    var zhiNum = this.data.zhiNum
    this.setData({
      defineOrchange: 1,
      zhiVal: zhiNum
    })
  },
  /**
   * 输入框失去焦点
   */
  bindblur: function(e) {
    console.log('失去焦点:', e)
    var _this = this
    var val = this.data.zhiVal
    var userId = app.globalData.sessionId
    if (val) {
      var newVal = val.slice(0, 2) + '****' + val.slice(val.length - 2, val.length)
    } else {
      var newVal = ''
    }
  },
  /**
   * 会员验证
   */
  goMySubmit: function(e) {
    var _this = this
    var ids = e.currentTarget.dataset.id // 1为提交  0为红包
    // var status = _this.data.status //是否授权
    var status = 1
    var zhiVal = _this.data.zhiVal
    if (status) {
      wx.navigateTo({
        url: '/pages/mySubmit/index?id=' + ids,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '会员授权后才能查看哦 ^ ^',
        showCancel: false
      })
    }
  },
  /**
   * 跳转到订单页面
   */
  myMoney: function(e) {
    var _this = this
    var ids = e.currentTarget.dataset.id // 1为提交  0为红包
    // console.log(e.currentTarget.dataset.id)
    // var status = _this.data.status //是否授权
    var status = 1
    var zhiVal = _this.data.zhiVal
    console.log('status:', status)
    // if (status) {
    //   if (zhiVal) {
    //     wx.navigateTo({
    //       url: '/pages/mySubmit/index?id=' + ids,
    //     })
    //   } else {
    //     _this.setData({
    //       isFocus: true
    //     })
    //     wx.showToast({
    //       title: '绑定支付宝才能收到红包哦^ ^',
    //       icon: 'none',
    //       duration: 3000
    //     })
    //   }
    // } else {
    //   wx.showModal({
    //     title: '提示',
    //     content: '授权后才能查看哦 ^ ^',
    //     showCancel: false
    //   })
    // }
    wx.navigateTo({
      url: '/pages/mySubmit/index?id=' + ids,
    })
  },
  goMyOrder: function(e) {
    var _this = this
    var ids = e.currentTarget.dataset.id // 1为提交  0为红包 3为订单
    wx.navigateTo({
      url: '/pages/mySubmit/index?id=' + ids,
    })
    _this.setData({
      zT: false
    })
  },
  goLogin: function() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },
  define: function() { //确定绑定支付宝
    var _this = this
    wx.showModal({
      title: '提示',
      content: '该号码将作为红包发放唯一凭证，确定保存？',
      cancelText: '我再想想',
      confirmText: '确定',
      success: function(res) {
        if (res.confirm) {
          _this.uploadZFB()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  uploadZFB: function(){//上传支付宝
    var _this = this 
    var userId = app.globalData.sessionId
    var val = _this.data.zhiNum
    console.log('提交时的val:', val)
    var newVal = val.slice(0, 2) + '****' + val.slice(val.length - 2, val.length)
    wx.request({
      url: api + 'api/v1/wx/alipay/add',
      data: {
        'thirdSessionKey': userId,
        'alipayAccount': val
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log('更改支付宝：', res)
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
                    _this.uploadZFB()
                  }
                })
              }
            }
          })
        } else {
          if (res.statusCode == 200) {
            _this.setData({
              defineOrchange: 0,
              zhiVal: newVal,
              zhiNum: val
            })
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            })
          } else {
            wx.showToast({
              title: res.data,
              icon: 'none'
            })
          }
        }
      }
    })
  },
  getPhoneNumber: function(e) {
    var _this = this
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
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
      success: function(res) {
        console.log(JSON.parse(res.data.data).phoneNumber)
        if (res.data.errorCode == 5001) {
          wx.login({
            success: function (res) {
              if (res.code) {
                // console.log(res)
                // 发起网络请求
                console.log('重新获得jsCode444:', res.code)
                wx.request({
                  url: api + 'api/v1/wx/getSession?code=' + res.code,
                  success: function (ress) {
                    app.globalData.sessionId = ress.data.data.sessionId
                    // _this.getPhoneNumber()
                  }
                })
              }
            }
          })
        } else {
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
              app.globalData.userType = res.data.data.userType
              var userType = res.data.data.userType //用户的身份信息
              // var userType = 1
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
          _this.getAllUserInfo()
        }
        
      }
    })
    // this.setData({
    //   status: 1
    // }) //设置为已登录状态
  },
  lookeRule: function () {
    wx.showToast({
      title: '敬请期待',
      icon: 'none'
    })
    // wx.navigateTo({
    //   url: '/pages/role/index'
    // })
  }
})