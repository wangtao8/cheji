var WxParse = require('../../utils/wxParse.js');
var app = getApp();
var api = app.globalData.api;
Page({
  data: {
    signImage: null,
    region: ['四川省', '成都市', '锦江区']
  },
  bindRegionChange: function (e) {//改变picker的值
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  openSetting() { wx.openSetting() },
  onLoad: function(){
    var _this = this
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
      *  事故咨询(不要了),
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
    wx.request({//新闻案例接口
      url: api + 'api/v1/wx/notice/list',
      data: {
        "newsType": 8
      },
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      success: function (res) {
        console.log('富文本：', res.data)
        // var htlb = res.data[0].content
        var htlb = ''
        for(var i = 0; i < res.data.length; i++){
          htlb += res.data[i].content
        }
        WxParse.wxParse('article', 'html', htlb, _this, 5);
      }
    })
  },
  onReady: function(){
    // wx.startSoterAuthentication({
    //   requestAuthModes: ['fingerPrint'],
    //   challenge: '123456',
    //   authContent: '请用指纹解锁',
    //   success(res) {
    //     console.log('指纹解锁：', res)
    //   }
    // })
    // wx.checkIsSoterEnrolledInDevice({
    //   checkAuthMode: 'fingerPrint',
    //   success(res) {
    //     console.log('验证：', res.isEnrolled)
    //   }
    // })
  },
  onShow: function(){
    // const ctx = wx.createCanvasContext('myCanvas')

    // // Draw coordinates
    // ctx.arc(100, 75, 50, 0, 2 * Math.PI)
    // ctx.setFillStyle('#ccc')//设置填充色
    // ctx.fill()//对当前路径中的内容进行填充。默认的填充色为黑色

    // ctx.beginPath()//开始创建一个路径，需要调用fill或者stroke才会使用路径进行填充或描边
    // ctx.moveTo(40, 75)//把路径移动到画布中的指定点，不创建线条
    // ctx.lineTo(160, 75)//画线条
    // ctx.moveTo(100, 15)
    // ctx.lineTo(100, 135)
    // ctx.setStrokeStyle('#AAAAAA')//设置边框颜色
    // ctx.stroke()//画出当前路径的边框。默认颜色色为黑色。

    // ctx.setFontSize(12)//设置字体的字号
    // ctx.setFillStyle('black')
    // ctx.fillText('0', 165, 78)//在画布上绘制被填充的文本
    // ctx.fillText('0.5*PI', 83, 145)
    // ctx.fillText('1*PI', 15, 78)
    // ctx.fillText('1.5*PI', 83, 10)

    // // Draw points
    // ctx.beginPath()
    // ctx.arc(100, 125, 2, 0, 2 * Math.PI)//画一条弧线
    // ctx.setFillStyle('lightgreen')
    // ctx.fill()//对当前路径中的内容进行填充。默认的填充色为黑色

    // ctx.beginPath()
    // ctx.arc(100, 25, 2, 0, 2 * Math.PI)
    // ctx.setFillStyle('blue')
    // ctx.fill()

    // ctx.beginPath()
    // ctx.arc(150, 75, 2, 0, 2 * Math.PI)
    // ctx.setFillStyle('red')
    // ctx.fill()

    // ctx.beginPath()
    // ctx.arc(50, 75, 2, 0, 2 * Math.PI)
    // ctx.setFillStyle('yellow')
    // ctx.fill()

    // // Draw arc
    // ctx.beginPath()
    // ctx.arc(100, 75, 50, 0, 1 * Math.PI)
    // ctx.setStrokeStyle('#333333')
    // ctx.stroke()//画出当前路径的边框。默认颜色色为黑色。

    // //1.先绘制一个完整的空心圆
    // ctx.beginPath();
    // ctx.arc(250,75,50,0,Math.PI*2);
    // ctx.stroke();
 
    //  //2.绘制半黑半白  默认为黑色
    // ctx.beginPath();
    // ctx.arc(250,75,50,Math.PI*3/2,Math.PI/2,true);
    // ctx.setFillStyle('#000')
    // ctx.fill();
 
    //  //3.绘制一黑一白两个半圆
    // ctx.fillStyle="white";
    // ctx.beginPath();
    // ctx.arc(250,50,25,0,Math.PI*2);
    // ctx.fill();
 
    // ctx.fillStyle="black";
    // ctx.beginPath();
    // ctx.arc(250,100,25,0,Math.PI*2);
    // ctx.fill();
     
    //  //4.绘制两个小圆
    // ctx.fillStyle="black";
    // ctx.beginPath();
    // ctx.arc(250,45,15,0,Math.PI*2);
    // ctx.fill();
 
    // ctx.fillStyle="white";
    // ctx.beginPath();
    // ctx.arc(250,100,15,0,Math.PI*2);
    // ctx.fill();

    // ctx.draw()//将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中
  },
  //保存图片
  saveClick: function () {
    var that = this
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        //打印图片路径
        console.log(res.tempFilePath)
        //设置保存的图片
        that.setData({ signImage: res.tempFilePath })
      }
    })
  },
  lookImage: function () {
    var signImage = this.data.signImage
    var useUrls = []
    useUrls.push(signImage)
    wx.previewImage({
      current: signImage, // 当前显示图片的http链接
      urls: useUrls // 需要预览的图片http链接列表
    })
  }
})