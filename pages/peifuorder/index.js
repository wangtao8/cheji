// pages/peifuorder/index.js
var app = getApp()
var api = app.globalData.api
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    region: ['四川省', '成都市', '锦江区'],//默认地区
    array: ['宝马', '奔驰', '奥迪'],//汽车种类
    currentTab: 0,//最上面图片的正在显示的tab下标
    items: [
      {name: '4s1', value: '宝马'},
      {name: '4s2', value: '奔驰'},
      {name: '4s3', value: '奥迪'},
      {name: '4s4', value: '兰博基尼'},
      {name: '4s5', value: '英菲尼迪'},
      {name: '4s6', value: '大众'},
    ],//模拟请求到的数据
    dataList: [],//选中的4s店
    isShow: false,//多选框显隐
    inputVal: null,//输入框值
    pageIndex: 0, //当前页码
    pageAll: null, //总条数
  },
  inputChange: function(e){
    // var region = this.data.region
    var _this = this
    var inputVal = e.detail.value
    var region = this.data.region
    var regionString = region.join('-')
    // this.setData({ inputVal: arry[index], isShow: true })
    console.log('地址拼接：', regionString, '当前选择品牌：', inputVal)
    this.getFourSMap(regionString, inputVal, 0, 0)
    this.setData({
      dict: regionString,
      qcpp: inputVal,
      pageIndex: 0,
      isShow: true,
      inputVal: inputVal
    })
    // this.setData({ inputVal: val, isShow: true})
    // console.log('region:', region, val)
  },
  bindfocus: function(){
    this.setData({ isShow: true })
  },
  lookInfo: function(){
    this.setData({ isShow: true })
  },
  close: function(){
    var isShow = this.data.isShow
    if (isShow) {
      this.setData({ isShow: false })
    } else {
      this.setData({ isShow: true })
    }
    
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
  Order: function(){//下单
    var _this = this
    var data = _this.data.items
    var url = this.data.url || []
    var dataList = this.data.dataList.join(',') || '' //拼接好的id字符串
    var userId = app.globalData.sessionId
    var claimImg//需要拼接的图片url的字符串
    var index = url.length
    var k = 0
    for (var i = 0; i < url.length; i++) {//上传图片
      wx.uploadFile({
        url: api + 'api/v1/wx/claim/uploadfile',
        filePath: url[i],
        name: 'file',
        formData: {
          'thirdSessionKey': userId
        },
        success: function (res) {
          k++
          var data = JSON.parse(res.data)
          claimImg = claimImg === undefined ? data.data[0] : claimImg + '|' + data.data[0]//拼接图片url地址
          if (k == index) {
            wx.showLoading({
              title: '下单中...'
            })
            if (claimImg.length !== 0 && dataList.length !== 0) {
              wx.getLocation({
                type: 'gcj02',
                success: function (res) {
                  var latitude = res.latitude
                  var longitude = res.longitude
                  var qqmapsdk = new QQMapWX({
                    key: 'E6OBZ-I2YK6-QWESQ-MH3TB-OZUKO-THBPD' // 必填
                  });
                  qqmapsdk.reverseGeocoder({//逆地址解析
                    location: {
                      latitude: latitude,
                      longitude: longitude
                    },
                    success: function (addressRes) {
                      var address1 = addressRes.result.formatted_addresses.recommend//需要的地址
                      var component = addressRes.result.address_component
                      var province = component.province
                      var city = component.city
                      var address = province + city + address1//未处理的地址
                      console.log('最后的地址及需要用到的信息：', address, latitude, longitude, claimImg, dataList, userId)
                      _this.orderDom(address, latitude, longitude, claimImg, dataList, userId)
                    },
                    fail: function (e) {
                      console.log('错误：', e)
                    }
                  })
                }
              })
            } else if (claimImg.length == 0) {
              wx.showToast({
                title: '请拍至少一张照片',
                icon: 'none'
              })
            } else if (dataList.length == 0) {
              wx.showToast({
                title: '请至少选择一个4s店',
                icon: 'none'
              })
            }
          }
          console.log('拼接图片url地址claimImg:', claimImg)
        }
      })
    }

// setTimeout(function(){
    //   wx.showToast({
    //     title: '完成',
    //     icon: 'success'
    //   })
    //   for(var i = 0; i < data.length; i++) {
    //     data[i].checked = false
    //     data[i].disable = false
    //   }
    //   //items 模拟数据  dataList 已被选中的多选框  url 拍的照片集合
    //   _this.setData({ index: null, items: data, dataList: [], url: null, isShow: false})//重置所有状态
    // },3000)
  },
  orderDom: function (address, latitude, longitude, claimImg, dataList, userId) {//下单方法
    var _this = this
    wx.request({
      url: api + 'api/v1/wx/open/claimer/order/add',
      data: {
        'claimImg': claimImg,
        'lat': latitude,
        'lng': longitude,
        'address': address,
        'deptids': dataList,
        'thirdSessionKey': userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.errorCode == 0){
          console.log('下单结果：', res.data)
          _this.setData({ index: null,inputVal: '', dataList: [], url: null, isShow: false })//重置所有状态
          wx.showToast({
            title: '下单完成！',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none'
          })
        }
      },
      fail: function(e){
        console.log('下单失败的结果：', e)
      }
    })
  },
  checkboxChange: function (e) {//多选框
    var _this = this
    var id = e.currentTarget.dataset.id//当前点击的索引
    var dataList = this.data.dataList//选中的4s店
    var name = e.currentTarget.dataset.cont//当前点击的名字
    var index = dataList.indexOf(name)//当前点击名字是否在选中的4s店里面
    if(index == -1){
      dataList.push(name)//如果没有 就加入选中数组
    } else {
      dataList.splice(index, 1)//如果有 就移除该数组
    }
    this.setData({ dataList: dataList})//渲染到视图

    //接下来的操作是把得到的数据都加一个disable对象名，值为false，当改变值时当前disable受到影响
    var data = this.data.fourSMapData//当前得到的数据 
    console.log('dataList++++++++++++++++++++:', dataList, data) 
    for(var i = 0; i<data.length; i++){//循环整个数据
      if (dataList.length > 2){//当选中项数组大于2时 
        if (dataList.indexOf(data[i].id) == -1) {//那么禁止其余未被选中的选择框
          data[i].disable = true
        } else {//其余被选中的依然保持可更改状态
          data[i].checked = true
        }
        _this.setData({ fourSMapData: data })//渲染到视图
      } else {//当选中项小于2时
        data[i].disable = false
        if (dataList.indexOf(data[i].id) == -1) {// 未被选中的
          data[i].disable = false//一直被禁用项释放禁用状态的变为可选状态
          data[i].checked = false//而之前被选中的，现在改为未选中状态
        } else {//其余的选中状态不变
          data[i].checked = true
        }
        _this.setData({ fourSMapData: data })//渲染到视图
      }
    }
  },
  getBrand: function(){//获得品牌信息
    var userId = app.globalData.sessionId || 'x'
    var _this = this
    wx.request({
      url: api + 'api/v1/wx/carType/get',
      data: {
        'thirdSessionKey': userId,
        'dict': 'CAR_TYPE'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('获取品牌信息：', res.data )
        if (res.data.errorCode == 5001) {
          wx.login({
            success: function (res) {
              if (res.code) {
                // 发起网络请求
                wx.request({
                  url: api + 'api/v1/wx/getSession?code=' + res.code,
                  success: function (ress) {
                    app.globalData.sessionId = ress.data.data.sessionId
                    console.log('重新获得的sessionId:', app.globalData.sessionId)
                    _this.getBrand()
                  }
                })
              }
            }
          })
        } else {
          console.log('获取的品牌：', res.data.data)
          var brands = []//品牌集合
          var datas = res.data.data
          for (var i = 0; i < datas.length; i++) {
            brands.push(datas[i].name)
          }
          _this.setData({array : brands})
          wx.hideLoading()
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this
    // wx.showLoading({
    //   title: '加载中...',
    // })
    // _this.getBrand()
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
            var address = province + city + address1//合并后的地址
            console.log('处理后的地址:', address)
            _this.setData({ latitude: latitudes, longitude: longitudes, address: address })
          },
          fail: function (e) {
            console.log('错误：', e)
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  goFoursInfo: function(e){
    var dataList = JSON.stringify(e.currentTarget.dataset.all)
    console.log('123122131231:', dataList)
    wx.navigateTo({
      url: '../fourSInfo/index?dataList=' + dataList,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  bindRegionChange: function(e) { //改变地区
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  // bindPickerChange: function(e) {//改变品牌
  //   var _this = this
  //   var index = e.detail.value
  //   var region = this.data.region
  //   var arry = this.data.array
  //   var regionString = region.join('-')
  //   this.setData({ inputVal: arry[index], isShow: true })
  //   console.log('地址拼接：', regionString,'当前选择品牌：', arry[index])
  //   wx.showLoading({
  //     title: '查询中...',
  //   })
  //   this.getFourSMap(regionString, arry[index], 0, 0)
  //   this.setData({
  //     index: index,
  //     dict: regionString,
  //     qcpp: arry[index],
  //     pageIndex: 0 
  //   })
  // },
  goBottom: function(e){//触底事件
    var _this = this
    var pageIndex = _this.data.pageIndex + 1
    var dict = _this.data.dict
    var qcpp = _this.data.qcpp
    var pageAll = _this.data.pageAll
    console.log('我监听到了滚动条到底事件:', pageIndex , pageAll)
    if (pageIndex >= pageAll) {
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
    } else {
      _this.getFourSMap(dict, qcpp, pageIndex, 1)
      _this.setData({ pageIndex: pageIndex })
    }
  },
  getFourSMap: function (dict, qcpp, pageIndex, types) {//查询4s店信息
    var _this = this
    var userId = app.globalData.sessionId || 'x'
    var k = 0
    wx.request({
      url: api + 'api/v1/wx/store/get',
      data: {
        'dict': dict,
        'qcpp': qcpp,
        'thirdSessionKey': userId,
        'limit': 4,
        'offset': 4 * pageIndex
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('获取的4S店信息：', res.data)
        var fourSData = res.data.data.records
        var total = res.data.data.pages
        // var pageAll = _this.data.pageAll
        // wx.getLocation({
        //   type: 'gcj02',
          // success: function (res2) {
            // var latitude = res2.latitude
            // var longitude = res2.longitude
            // 实例化API核心类
            // var demo = new QQMapWX({
            //   key: 'E6OBZ-I2YK6-QWESQ-MH3TB-OZUKO-THBPD'
            // });
            // console.log('查看数据：', fourSData)
            // for (var i = 0; i < fourSData.length; i++) {
            //   // 调用接口
            //   demo.calculateDistance({
            //     to: [{
            //       latitude: latitude,
            //       longitude: longitude
            //     }, {
            //       latitude: fourSData[i].lat,
            //       longitude: fourSData[i].lng
            //     }],
            //     success: function (res3) {
            //       var distance = res3.result.elements[1].distance / 1000 + 'km'
            //       fourSData[k].distance = distance
            //       fourSData[k].checked = false
            //       fourSData[k].disable = false
            //       k++
            //       if (types) {//上拉加载更多
            //         console.log('上拉加载更多时的值：', k-1, fourSData)
            //         var fourSMapData = _this.data.fourSMapData//已经获得的值
            //         fourSMapData.push(fourSData[k-1])
            //         console.log('上拉时的值：', fourSMapData, '现在获得的值：', fourSData)
            //         _this.setData({ fourSMapData: fourSMapData, pageAll: total})
            //         wx.hideLoading()
            //       } else {//普通加载
            //         _this.setData({ fourSMapData: fourSData, pageAll: total, dataList: [] })
            //         wx.hideLoading()
            //       }
            //     },
            //     fail: function (res4) {
            //       console.log('失败的提示消息：', res4);
            //     }
            //   });
            // }
          // }
        // })
        if (types) {//上拉加载更多
          var fourSMapData = _this.data.fourSMapData//已经获得的值
          for (var i = 0; i < fourSData.length; i++) {
            fourSMapData.push(fourSData[i])
          }
          // var url = []
          // for(var j = 0; j < fourSMapData.length; j++){
          //   url.push(fourSMapData[j].imgUrls.split("|")[0])
          // }
          // console.log('首页的图片：', url)

          console.log('上拉时的值：', fourSMapData, '现在获得的值：', fourSData)
          _this.setData({ fourSMapData: fourSMapData, pageAll: total})
          wx.hideLoading()
        } else {//普通加载

          // var url = []
          // for (var j = 0; j < fourSMapData.length; j++) {
          //   url.push(fourSMapData[j].imgUrls.split("|")[0])
          // }
          // console.log('首页的图片：', url)

          _this.setData({ fourSMapData: fourSData, pageAll: total, dataList: []})
          wx.hideLoading()
        }
        wx.hideLoading()
      }
    })
  },
  searchVal: function() {
    this.setData({
      newVal: true
    })
  },
  Tophoto: function() {
    var _this = this
    console.log('查看现在的图片集合:', _this.data.url)
    var urls = _this.data.url || []
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
        success: function(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths[0]
          // console.log(urls.length + 1 <= 5)
          if (urls.length < 5) {
            urls.push(tempFilePaths)
          }
          if (urls.length < 5) {
            _this.setData({
              url: urls,
              currentTab: urls.length
            })
          } else {
            _this.setData({
              url: urls,
              currentTab: (urls.length - 1)
            })
          }
          console.log('集合：', urls)
        }
      })
    }
  },
  lookImage: function(e) {
    var ids = e.currentTarget.dataset.id
    var urls = this.data.url
    wx.previewImage({
      current: urls[ids], // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  allUpload: function () {
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
        _this.setData({ url: tempFilePaths })
      }
    })
  }
})