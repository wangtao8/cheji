// pages/xieyi/index.js
var app = getApp();
var api = app.globalData.api;
var content = null;
var touchs = [];
var canvasw = 0;
var canvash = 0;
var util = require("../../utils/util.js")
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
//获取系统信息
wx.getSystemInfo({
    success: function(res) {
      canvasw = res.windowWidth;
      canvash = canvasw * 9 / 16;
    },
  }),
  Page({

    /**
     * 页面的初始数据
     */
    data: {
      signImage: '',
      userMotai: false, //使用模态框
      sure: false,
      nowDate: null, //现在的时间
      array: ['四川港宏汽车销售服务有限公司', '四川申蓉汽车销售服务有限公司', '其他'],
      arrays: {
        "0": ["四川港宏汽车销售服务有限公司", "四川港宏盛丰汽车销售服务有限公司", "四川港宏盛丰汽车销售服务有限公司", "四川港宏风神汽车销售服务有限公司", "四川港宏盛业汽车销售服务有限公司", "四川港宏西物时代汽车销售服务有限公司", "四川港宏凯威行汽车销售服务有限公司", "四川港宏新通汽车销售服务有限公司", "四川港宏鼎鑫汽车销售服务有限公司"],
        "1": ["四川申蓉顺通达商贸有限公司", "四川申蓉泓盛汽车贸易有限公司", "四川申蓉泓盛汽车贸易有限公司温江分公司", "四川申蓉泓宇汽车贸易有限公司", "四川申蓉泓捷汽车销售服务有限公司", "四川申蓉泓翰汽车销售服务有限公司", "四川申蓉泓锦汽车销售服务有限公司", "成都申科蓉汽车销售服务有限公司", "四川申蓉汽车销售服务有限公司", "四川申蓉瑞龙汽车销售服务有限公司", "四川申蓉泓正汽车销售服务有限公司", "四川申蓉九兴汽车销售服务有限公司", "四川申蓉圣飞汽车销售服务有限公司", "成都申蓉兴辰汽车销售服务有限公司", "四川申蓉广谷汽车销售服务有限公司", "四川申蓉汇通汽车销售服务有限公司", "四川申蓉雅泰汽车销售服务有限公司", "成都汇腾汽车销售服务有限公司", "四川申蓉和浩汽车销售服务有限公司", "四川申蓉汇亚汽车销售服务有限公司", "四川申蓉桂锋汽车销售服务有限公司", "四川申蓉裕丰汽车销售服务有限公司", "四川申蓉宇丰汽车销售服务有限公司", "四川申蓉泓嘉汽车销售服务有限公司"],
        "2": ['小扳手汽修', '平行进口车', '成都仁孚南星汽车服务有限公司', '成都百川金保汽车销售服务有限公司', '成都中宝汽车销售服务有限公司', '成都三和汽车销售服务有限公司', '成都三圣汽车销售服务有限公司', '成都通海汽车销售服务有限公司', '成都锦泰丰田汽车销售服务有限公司', '成都合力创汽车销售有限公司', '成都锦华汽车销售服务有限公司', '川物美林林肯中心', '四川辰宇雷克萨斯汽车销售服务有限公司', '成都启阳嘉航汽车销售服务有限公司', '四川宏宇汽车销售服务有限公司', '三和名车维修中心', '四川城市车辆维修服务有限公司', '四川嘉驰苏坡店、羊溪店、金花店', '四川乾通汽车销售服务有限公司', '成都中升雷克萨斯汽车销售服务有限公司', '成都中升广汽丰田汽车销售服务有限公司', '成都速亨汽车销售服务有限公司', '成都怡星仁孚汽车服务有限公司']
      },
      isNone: false //canvas最初状态为隐藏
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      var _this = this
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function (res) {
          var latitudes = parseFloat(res.latitude)
          var longitudes = parseFloat(res.longitude)
          var speed = res.speed
          var accuracy = res.accuracy
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
              console.log('地址展示：', address1)
              _this.setData({ address: address1})
              // var address = '四川省成都市龙泉驿区保利玫瑰花语& #40;金桉路南& #41;'//最开始未处理的地址
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
      var nowDate = util.formatTime(new Date())
      this.setData({
        nowDate: nowDate
      })
      console.log('nowDate:', nowDate)
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
    bindPickerChange: function(e) {
      var indexs = e.detail.value
      console.log('第一个选项:', indexs)
      this.setData({
        indexs: indexs
      })
    },
    bindPickerChange2: function(e) {
      var index2 = e.detail.value
      console.log('第二个选项:', index2)
      this.setData({
        index2: index2
      })
    },
    goqian: function() {
      this.setData({
        isNone: true,
        userMotai: true
      })
      //获得Canvas的上下文
      content = wx.createCanvasContext('firstCanvas')
      //设置线的颜色
      content.setStrokeStyle("#000")
      //设置线的宽度
      content.setLineWidth(3)
      //设置线两端端点样式更加圆润
      content.setLineCap('round')
      //设置两条线连接处更加圆润
      content.setLineJoin('round')
    },
    // 画布的触摸移动开始手势响应
    start: function(event) {
      // console.log("触摸开始" + event.changedTouches[0].x)
      // console.log("触摸开始" + event.changedTouches[0].y)
      //获取触摸开始的 x,y
      let point = {
        x: event.changedTouches[0].x,
        y: event.changedTouches[0].y
      }
      touchs.push(point)
    },

    // 画布的触摸移动手势响应
    move: function(e) {
      let point = {
        x: e.touches[0].x,
        y: e.touches[0].y
      }
      touchs.push(point)
      if (touchs.length >= 2) {
        this.draw(touchs)
      }
    },

    // 画布的触摸移动结束手势响应
    end: function(e) {
      console.log("触摸结束" + JSON.stringify(e))
      //清空轨迹数组
      for (let i = 0; i < touchs.length; i++) {
        touchs.pop()
      }
    },

    // 画布的触摸取消响应
    cancel: function(e) {
      console.log("触摸取消" + e)
    },

    // 画布的长按手势响应
    tap: function(e) {
      console.log("长按手势" + e)
    },

    error: function(e) {
      console.log("画布触摸错误" + e)
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    //绘制
    draw: function(touchs) {
      let point1 = touchs[0]
      let point2 = touchs[1]
      touchs.shift()
      content.moveTo(point1.x, point1.y)
      content.lineTo(point2.x, point2.y)
      content.stroke()
      content.draw(true)
    },
    //清除操作
    clearClick: function() {
      //清除画布
      content.clearRect(0, 0, canvasw, canvash)
      content.draw(true)
    },
    //保存图片
    saveClick: function() {
      var that = this
      wx.canvasToTempFilePath({
        canvasId: 'firstCanvas',
        success: function(res) {
          //打印图片路径
          console.log(res.tempFilePath)
          //设置保存的图片
          that.setData({
            signImage: res.tempFilePath,
            isNone: false,
            userMotai: false
          })
        }
      })
    },
    close: function() {
      this.setData({
        isNone: false,
        userMotai: false,
        sure: false
      })
    },
    saveAllClick: function() {
      var that = this
      wx.canvasToTempFilePath({
        canvasId: 'waiceng',
        success: function(res) {
          //打印图片路径
          console.log('打印图片路径：', res.tempFilePath)
          //设置保存的图片
          that.setData({
            signImages: res.tempFilePath
          })
        },
        fail: function(e) {
          console.log('e:', e)
        }
      })
    },
    longSend: function() {
      this.setData({
        userMotai: true,
        sure: true
      })
    },
    goBack: function() {
      // wx.navigateBack({
      //   delta: 5
      // })
      // var val = this.data.lukou// 道路出现前的输入框值（测试）
      // if (typeof val == 'undefined') {
      //   wx.showModal({
      //     title: '提示',
      //     content: '有值未输入！',
      //   })
      // }
      wx.navigateTo({//跳转到最后一步
        url: '/pages/paperwork/index',
      })
      this.setData({ sure: false, userMotai: false })
    },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  changeVal: function(e){
    var val = e.detail.value
    this.setData({ lukou: val })
  }
  })