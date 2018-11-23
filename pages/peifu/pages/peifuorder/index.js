// pages/peifuorder/index.js
var app = getApp()
var api = app.globalData.api
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');  
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showNow: true,
    isClick: true,
    region: ['四川省', '成都市', '锦江区'], //默认地区
    array: ['宝马', '奔驰', '奥迪'], //汽车种类
    currentTab: 0, //最上面图片的正在显示的tab下标
    items: [{
        name: '4s1',
        value: '宝马'
      },
      {
        name: '4s2',
        value: '奔驰'
      },
      {
        name: '4s3',
        value: '奥迪'
      },
      {
        name: '4s4',
        value: '兰博基尼'
      },
      {
        name: '4s5',
        value: '英菲尼迪'
      },
      {
        name: '4s6',
        value: '大众'
      },
    ], //模拟请求到的数据
    dataList: [], //选中的4s店
    isShow: false, //多选框显隐
    inputVal: null, //输入框值
    pageIndex: 0, //当前页码
    pageAll: null, //总条数
    multiIndex: [24, 0],
    multiArray: [
      ['北京市', '安徽省', "福建省", "甘肃省", "广东省", "广西壮族自治区", "贵州省", "海南省", "河北省", "河南省", "黑龙江省", "湖北省", "湖南省", "吉林省", "江苏省", "江西省", "辽宁省", "内蒙古自治区", "宁夏回族自治区", "青海省", "山东省", "山西省", "陕西省", "上海市", "四川省", "天津市", "西藏自治区", "新疆维吾尔自治区", "云南省", "浙江省", "重庆市", "香港", "澳门", "台湾"],
      ["成都市", "绵阳市", "阿坝市", "巴中市", "达州市", "德阳市", "阿坝藏族羌族自治州", "广安市", "广元市", "乐山市", "凉山市", "眉山市", "南充市", "内江市", "攀枝花市", "遂宁市", "雅安市", "宜宾市", "资阳市", "自贡市", "泸州市"]
    ],
    objectMultiArray: [{
      "regid": "2",
      "parid": "1",
      "regname": "北京市",
      "regtype": "1",
      "ageid": "0"
    }, {
        "regid": "3",
        "parid": "1",
        "regname": "安徽省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "4",
        "parid": "1",
        "regname": "福建省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "5",
        "parid": "1",
        "regname": "甘肃省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "6",
        "parid": "1",
        "regname": "广东省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "7",
        "parid": "1",
        "regname": "广西壮族自治区",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "8",
        "parid": "1",
        "regname": "贵州省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "9",
        "parid": "1",
        "regname": "海南省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "10",
        "parid": "1",
        "regname": "河北省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "11",
        "parid": "1",
        "regname": "河南省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "12",
        "parid": "1",
        "regname": "黑龙江省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "13",
        "parid": "1",
        "regname": "湖北省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "14",
        "parid": "1",
        "regname": "湖南省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "15",
        "parid": "1",
        "regname": "吉林省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "16",
        "parid": "1",
        "regname": "江苏省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "17",
        "parid": "1",
        "regname": "江西省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "18",
        "parid": "1",
        "regname": "辽宁省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "19",
        "parid": "1",
        "regname": "内蒙古自治区",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "20",
        "parid": "1",
        "regname": "宁夏回族自治区",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "21",
        "parid": "1",
        "regname": "青海省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "22",
        "parid": "1",
        "regname": "山东省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "23",
        "parid": "1",
        "regname": "山西省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "24",
        "parid": "1",
        "regname": "陕西省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "25",
        "parid": "1",
        "regname": "上海市",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "26",
        "parid": "1",
        "regname": "四川省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "27",
        "parid": "1",
        "regname": "天津省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "28",
        "parid": "1",
        "regname": "西藏自治区",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "29",
        "parid": "1",
        "regname": "新疆维吾尔自治区",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "30",
        "parid": "1",
        "regname": "云南省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "31",
        "parid": "1",
        "regname": "浙江省",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "32",
        "parid": "1",
        "regname": "重庆市",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "33",
        "parid": "1",
        "regname": "香港",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "34",
        "parid": "1",
        "regname": "澳门",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "35",
        "parid": "1",
        "regname": "台湾",
        "regtype": "1",
        "ageid": "0"
      }, {
        "regid": "36",
        "parid": "3",
        "regname": "安庆市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "37",
        "parid": "3",
        "regname": "蚌埠市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "38",
        "parid": "3",
        "regname": "巢湖市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "39",
        "parid": "3",
        "regname": "池州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "40",
        "parid": "3",
        "regname": "滁州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "41",
        "parid": "3",
        "regname": "阜阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "42",
        "parid": "3",
        "regname": "淮北市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "43",
        "parid": "3",
        "regname": "淮南市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "44",
        "parid": "3",
        "regname": "黄山市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "45",
        "parid": "3",
        "regname": "六安市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "46",
        "parid": "3",
        "regname": "马鞍山市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "47",
        "parid": "3",
        "regname": "宿州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "48",
        "parid": "3",
        "regname": "铜陵市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "49",
        "parid": "3",
        "regname": "芜湖市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "50",
        "parid": "3",
        "regname": "宣城市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "51",
        "parid": "3",
        "regname": "亳州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "52",
        "parid": "2",
        "regname": "北京市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "53",
        "parid": "4",
        "regname": "福州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "54",
        "parid": "4",
        "regname": "龙岩市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "55",
        "parid": "4",
        "regname": "南平市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "56",
        "parid": "4",
        "regname": "宁德市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "57",
        "parid": "4",
        "regname": "莆田市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "58",
        "parid": "4",
        "regname": "泉州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "59",
        "parid": "4",
        "regname": "三明市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "60",
        "parid": "4",
        "regname": "厦门市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "61",
        "parid": "4",
        "regname": "漳州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "62",
        "parid": "5",
        "regname": "兰州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "63",
        "parid": "5",
        "regname": "白银市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "64",
        "parid": "5",
        "regname": "定西市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "65",
        "parid": "5",
        "regname": "甘南藏族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "66",
        "parid": "5",
        "regname": "嘉峪关市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "67",
        "parid": "5",
        "regname": "金昌市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "68",
        "parid": "5",
        "regname": "酒泉市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "69",
        "parid": "5",
        "regname": "临夏市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "70",
        "parid": "5",
        "regname": "陇南市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "71",
        "parid": "5",
        "regname": "平凉市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "72",
        "parid": "5",
        "regname": "庆阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "73",
        "parid": "5",
        "regname": "天水市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "74",
        "parid": "5",
        "regname": "武威市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "75",
        "parid": "5",
        "regname": "张掖市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "76",
        "parid": "6",
        "regname": "广州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "77",
        "parid": "6",
        "regname": "深圳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "78",
        "parid": "6",
        "regname": "潮州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "79",
        "parid": "6",
        "regname": "东莞市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "80",
        "parid": "6",
        "regname": "佛山市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "81",
        "parid": "6",
        "regname": "河源市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "82",
        "parid": "6",
        "regname": "惠州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "83",
        "parid": "6",
        "regname": "江门市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "84",
        "parid": "6",
        "regname": "揭阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "85",
        "parid": "6",
        "regname": "茂名市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "86",
        "parid": "6",
        "regname": "梅州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "87",
        "parid": "6",
        "regname": "清远市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "88",
        "parid": "6",
        "regname": "汕头市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "89",
        "parid": "6",
        "regname": "汕尾市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "90",
        "parid": "6",
        "regname": "韶关市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "91",
        "parid": "6",
        "regname": "阳江市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "92",
        "parid": "6",
        "regname": "云浮市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "93",
        "parid": "6",
        "regname": "湛江市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "94",
        "parid": "6",
        "regname": "肇庆市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "95",
        "parid": "6",
        "regname": "中山市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "96",
        "parid": "6",
        "regname": "珠海市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "97",
        "parid": "7",
        "regname": "南宁市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "98",
        "parid": "7",
        "regname": "桂林市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "99",
        "parid": "7",
        "regname": "百色市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "100",
        "parid": "7",
        "regname": "北海市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "101",
        "parid": "7",
        "regname": "崇左市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "102",
        "parid": "7",
        "regname": "防城港市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "103",
        "parid": "7",
        "regname": "贵港市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "104",
        "parid": "7",
        "regname": "河池市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "105",
        "parid": "7",
        "regname": "贺州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "106",
        "parid": "7",
        "regname": "来宾市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "107",
        "parid": "7",
        "regname": "柳州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "108",
        "parid": "7",
        "regname": "钦州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "109",
        "parid": "7",
        "regname": "梧州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "110",
        "parid": "7",
        "regname": "玉林市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "111",
        "parid": "8",
        "regname": "贵阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "112",
        "parid": "8",
        "regname": "安顺市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "113",
        "parid": "8",
        "regname": "毕节市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "114",
        "parid": "8",
        "regname": "六盘水市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "115",
        "parid": "8",
        "regname": "黔东南苗族侗族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "116",
        "parid": "8",
        "regname": "黔南布依族苗族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "117",
        "parid": "8",
        "regname": "黔西南布依族苗族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "118",
        "parid": "8",
        "regname": "铜仁市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "119",
        "parid": "8",
        "regname": "遵义市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "120",
        "parid": "9",
        "regname": "海口市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "121",
        "parid": "9",
        "regname": "三亚市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "122",
        "parid": "9",
        "regname": "白沙黎族自治县",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "123",
        "parid": "9",
        "regname": "保亭黎族苗族自治县",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "124",
        "parid": "9",
        "regname": "昌江黎族自治县",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "125",
        "parid": "9",
        "regname": "澄迈县",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "126",
        "parid": "9",
        "regname": "定安县",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "127",
        "parid": "9",
        "regname": "东方市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "128",
        "parid": "9",
        "regname": "乐东黎族自治县",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "129",
        "parid": "9",
        "regname": "临高县",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "130",
        "parid": "9",
        "regname": "陵水黎族自治县",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "131",
        "parid": "9",
        "regname": "琼海市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "132",
        "parid": "9",
        "regname": "琼中黎族苗族自治县",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "133",
        "parid": "9",
        "regname": "屯昌县",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "134",
        "parid": "9",
        "regname": "万宁市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "135",
        "parid": "9",
        "regname": "文昌市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "136",
        "parid": "9",
        "regname": "五指山市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "137",
        "parid": "9",
        "regname": "儋州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "138",
        "parid": "10",
        "regname": "石家庄市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "139",
        "parid": "10",
        "regname": "保定市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "140",
        "parid": "10",
        "regname": "沧州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "141",
        "parid": "10",
        "regname": "承德市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "142",
        "parid": "10",
        "regname": "邯郸市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "143",
        "parid": "10",
        "regname": "衡水市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "144",
        "parid": "10",
        "regname": "廊坊市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "145",
        "parid": "10",
        "regname": "秦皇岛市市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "146",
        "parid": "10",
        "regname": "唐山市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "147",
        "parid": "10",
        "regname": "邢台市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "148",
        "parid": "10",
        "regname": "张家口市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "149",
        "parid": "11",
        "regname": "郑州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "150",
        "parid": "11",
        "regname": "洛阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "151",
        "parid": "11",
        "regname": "开封市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "152",
        "parid": "11",
        "regname": "安阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "153",
        "parid": "11",
        "regname": "鹤壁市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "154",
        "parid": "11",
        "regname": "济源市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "155",
        "parid": "11",
        "regname": "焦作市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "156",
        "parid": "11",
        "regname": "南阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "157",
        "parid": "11",
        "regname": "平顶山市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "158",
        "parid": "11",
        "regname": "三门峡市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "159",
        "parid": "11",
        "regname": "商丘市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "160",
        "parid": "11",
        "regname": "新乡市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "161",
        "parid": "11",
        "regname": "信阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "162",
        "parid": "11",
        "regname": "许昌市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "163",
        "parid": "11",
        "regname": "周口市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "164",
        "parid": "11",
        "regname": "驻马店市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "165",
        "parid": "11",
        "regname": "漯河市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "166",
        "parid": "11",
        "regname": "濮阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "167",
        "parid": "12",
        "regname": "哈尔滨市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "168",
        "parid": "12",
        "regname": "大庆市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "169",
        "parid": "12",
        "regname": "大兴安岭地区",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "170",
        "parid": "12",
        "regname": "鹤岗市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "171",
        "parid": "12",
        "regname": "黑河市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "172",
        "parid": "12",
        "regname": "鸡西市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "173",
        "parid": "12",
        "regname": "佳木斯市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "174",
        "parid": "12",
        "regname": "牡丹江市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "175",
        "parid": "12",
        "regname": "七台河市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "176",
        "parid": "12",
        "regname": "齐齐哈尔市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "177",
        "parid": "12",
        "regname": "双鸭山市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "178",
        "parid": "12",
        "regname": "绥化市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "179",
        "parid": "12",
        "regname": "伊春市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "180",
        "parid": "13",
        "regname": "武汉市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "181",
        "parid": "13",
        "regname": "仙桃",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "182",
        "parid": "13",
        "regname": "鄂州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "183",
        "parid": "13",
        "regname": "黄冈市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "184",
        "parid": "13",
        "regname": "黄石市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "185",
        "parid": "13",
        "regname": "荆门市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "186",
        "parid": "13",
        "regname": "荆州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "187",
        "parid": "13",
        "regname": "潜江市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "188",
        "parid": "13",
        "regname": "神农架林区",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "189",
        "parid": "13",
        "regname": "十堰市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "190",
        "parid": "13",
        "regname": "随州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "191",
        "parid": "13",
        "regname": "天门市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "192",
        "parid": "13",
        "regname": "咸宁市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "193",
        "parid": "13",
        "regname": "襄阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "194",
        "parid": "13",
        "regname": "孝感市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "195",
        "parid": "13",
        "regname": "宜昌市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "196",
        "parid": "13",
        "regname": "恩施土家族苗族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "197",
        "parid": "14",
        "regname": "长沙市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "198",
        "parid": "14",
        "regname": "张家界市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "199",
        "parid": "14",
        "regname": "常德市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "200",
        "parid": "14",
        "regname": "郴州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "201",
        "parid": "14",
        "regname": "衡阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "202",
        "parid": "14",
        "regname": "怀化市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "203",
        "parid": "14",
        "regname": "娄底市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "204",
        "parid": "14",
        "regname": "邵阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "205",
        "parid": "14",
        "regname": "湘潭市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "206",
        "parid": "14",
        "regname": "湘西土家族苗族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "207",
        "parid": "14",
        "regname": "益阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "208",
        "parid": "14",
        "regname": "永州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "209",
        "parid": "14",
        "regname": "岳阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "210",
        "parid": "14",
        "regname": "株洲市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "211",
        "parid": "15",
        "regname": "长春市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "212",
        "parid": "15",
        "regname": "吉林市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "213",
        "parid": "15",
        "regname": "白城市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "214",
        "parid": "15",
        "regname": "白山市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "215",
        "parid": "15",
        "regname": "辽源市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "216",
        "parid": "15",
        "regname": "四平市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "217",
        "parid": "15",
        "regname": "松原市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "218",
        "parid": "15",
        "regname": "通化市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "219",
        "parid": "15",
        "regname": "延边朝鲜族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "220",
        "parid": "16",
        "regname": "南京市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "221",
        "parid": "16",
        "regname": "苏州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "222",
        "parid": "16",
        "regname": "无锡市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "223",
        "parid": "16",
        "regname": "常州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "224",
        "parid": "16",
        "regname": "淮安市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "225",
        "parid": "16",
        "regname": "连云港市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "226",
        "parid": "16",
        "regname": "南通市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "227",
        "parid": "16",
        "regname": "宿迁市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "228",
        "parid": "16",
        "regname": "泰州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "229",
        "parid": "16",
        "regname": "徐州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "230",
        "parid": "16",
        "regname": "盐城市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "231",
        "parid": "16",
        "regname": "扬州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "232",
        "parid": "16",
        "regname": "镇江市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "233",
        "parid": "17",
        "regname": "南昌市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "234",
        "parid": "17",
        "regname": "抚州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "235",
        "parid": "17",
        "regname": "赣州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "236",
        "parid": "17",
        "regname": "吉安市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "237",
        "parid": "17",
        "regname": "景德镇市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "238",
        "parid": "17",
        "regname": "九江市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "239",
        "parid": "17",
        "regname": "萍乡市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "240",
        "parid": "17",
        "regname": "上饶市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "241",
        "parid": "17",
        "regname": "新余市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "242",
        "parid": "17",
        "regname": "宜春市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "243",
        "parid": "17",
        "regname": "鹰潭市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "244",
        "parid": "18",
        "regname": "沈阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "245",
        "parid": "18",
        "regname": "大连市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "246",
        "parid": "18",
        "regname": "鞍山市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "247",
        "parid": "18",
        "regname": "本溪市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "248",
        "parid": "18",
        "regname": "朝阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "249",
        "parid": "18",
        "regname": "丹东市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "250",
        "parid": "18",
        "regname": "抚顺市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "251",
        "parid": "18",
        "regname": "阜新市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "252",
        "parid": "18",
        "regname": "葫芦岛市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "253",
        "parid": "18",
        "regname": "锦州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "254",
        "parid": "18",
        "regname": "辽阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "255",
        "parid": "18",
        "regname": "盘锦市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "256",
        "parid": "18",
        "regname": "铁岭市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "257",
        "parid": "18",
        "regname": "营口市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "258",
        "parid": "19",
        "regname": "呼和浩特",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "259",
        "parid": "19",
        "regname": "阿拉善盟",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "260",
        "parid": "19",
        "regname": "巴彦淖尔盟",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "261",
        "parid": "19",
        "regname": "包头市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "262",
        "parid": "19",
        "regname": "赤峰市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "263",
        "parid": "19",
        "regname": "鄂尔多斯市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "264",
        "parid": "19",
        "regname": "呼伦贝尔市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "265",
        "parid": "19",
        "regname": "通辽市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "266",
        "parid": "19",
        "regname": "乌海市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "267",
        "parid": "19",
        "regname": "乌兰察布市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "268",
        "parid": "19",
        "regname": "锡林郭勒盟",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "269",
        "parid": "19",
        "regname": "兴安盟",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "270",
        "parid": "20",
        "regname": "银川市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "271",
        "parid": "20",
        "regname": "固原市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "272",
        "parid": "20",
        "regname": "石嘴山市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "273",
        "parid": "20",
        "regname": "吴忠市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "274",
        "parid": "20",
        "regname": "中卫市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "275",
        "parid": "21",
        "regname": "西宁市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "276",
        "parid": "21",
        "regname": "果洛藏族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "277",
        "parid": "21",
        "regname": "海北藏族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "278",
        "parid": "21",
        "regname": "海东市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "279",
        "parid": "21",
        "regname": "海南藏族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "280",
        "parid": "21",
        "regname": "海西蒙古族藏族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "281",
        "parid": "21",
        "regname": "黄南藏族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "282",
        "parid": "21",
        "regname": "玉树藏族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "283",
        "parid": "22",
        "regname": "济南市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "284",
        "parid": "22",
        "regname": "青岛市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "285",
        "parid": "22",
        "regname": "滨州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "286",
        "parid": "22",
        "regname": "德州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "287",
        "parid": "22",
        "regname": "东营市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "288",
        "parid": "22",
        "regname": "菏泽市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "289",
        "parid": "22",
        "regname": "济宁市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "290",
        "parid": "22",
        "regname": "莱芜市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "291",
        "parid": "22",
        "regname": "聊城市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "292",
        "parid": "22",
        "regname": "临沂市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "293",
        "parid": "22",
        "regname": "日照市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "294",
        "parid": "22",
        "regname": "泰安市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "295",
        "parid": "22",
        "regname": "威海市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "296",
        "parid": "22",
        "regname": "潍坊市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "297",
        "parid": "22",
        "regname": "烟台市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "298",
        "parid": "22",
        "regname": "枣庄市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "299",
        "parid": "22",
        "regname": "淄博市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "300",
        "parid": "23",
        "regname": "太原市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "301",
        "parid": "23",
        "regname": "长治市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "302",
        "parid": "23",
        "regname": "大同市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "303",
        "parid": "23",
        "regname": "晋城市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "304",
        "parid": "23",
        "regname": "晋中市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "305",
        "parid": "23",
        "regname": "临汾市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "306",
        "parid": "23",
        "regname": "吕梁市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "307",
        "parid": "23",
        "regname": "朔州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "308",
        "parid": "23",
        "regname": "忻州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "309",
        "parid": "23",
        "regname": "阳泉市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "310",
        "parid": "23",
        "regname": "运城市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "311",
        "parid": "24",
        "regname": "西安市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "312",
        "parid": "24",
        "regname": "安康市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "313",
        "parid": "24",
        "regname": "宝鸡市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "314",
        "parid": "24",
        "regname": "汉中市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "315",
        "parid": "24",
        "regname": "商洛市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "316",
        "parid": "24",
        "regname": "铜川市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "317",
        "parid": "24",
        "regname": "渭南市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "318",
        "parid": "24",
        "regname": "咸阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "319",
        "parid": "24",
        "regname": "延安市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "320",
        "parid": "24",
        "regname": "榆林市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "321",
        "parid": "25",
        "regname": "上海市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "322",
        "parid": "26",
        "regname": "成都市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "323",
        "parid": "26",
        "regname": "绵阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "324",
        "parid": "26",
        "regname": "阿坝市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "325",
        "parid": "26",
        "regname": "巴中市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "326",
        "parid": "26",
        "regname": "达州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "327",
        "parid": "26",
        "regname": "德阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "328",
        "parid": "26",
        "regname": "阿坝藏族羌族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "329",
        "parid": "26",
        "regname": "广安市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "330",
        "parid": "26",
        "regname": "广元市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "331",
        "parid": "26",
        "regname": "乐山市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "332",
        "parid": "26",
        "regname": "凉山市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "333",
        "parid": "26",
        "regname": "眉山市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "334",
        "parid": "26",
        "regname": "南充市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "335",
        "parid": "26",
        "regname": "内江市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "336",
        "parid": "26",
        "regname": "攀枝花市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "337",
        "parid": "26",
        "regname": "遂宁市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "338",
        "parid": "26",
        "regname": "雅安市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "339",
        "parid": "26",
        "regname": "宜宾市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "340",
        "parid": "26",
        "regname": "资阳市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "341",
        "parid": "26",
        "regname": "自贡市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "342",
        "parid": "26",
        "regname": "泸州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "343",
        "parid": "27",
        "regname": "天津市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "344",
        "parid": "28",
        "regname": "拉萨市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "345",
        "parid": "28",
        "regname": "阿里地区",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "346",
        "parid": "28",
        "regname": "昌都市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "347",
        "parid": "28",
        "regname": "林芝市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "348",
        "parid": "28",
        "regname": "那曲地区",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "349",
        "parid": "28",
        "regname": "日喀则市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "350",
        "parid": "28",
        "regname": "山南地区",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "351",
        "parid": "29",
        "regname": "乌鲁木齐市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "352",
        "parid": "29",
        "regname": "阿克苏地区",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "353",
        "parid": "29",
        "regname": "阿拉尔市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "354",
        "parid": "29",
        "regname": "巴音郭楞蒙古自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "355",
        "parid": "29",
        "regname": "博尔塔拉蒙古自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "356",
        "parid": "29",
        "regname": "昌吉市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "357",
        "parid": "29",
        "regname": "哈密地区",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "358",
        "parid": "29",
        "regname": "和田地区",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "359",
        "parid": "29",
        "regname": "喀什市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "360",
        "parid": "29",
        "regname": "克拉玛依市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "361",
        "parid": "29",
        "regname": "克孜勒苏柯尔克孜自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "362",
        "parid": "29",
        "regname": "石河子市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "363",
        "parid": "29",
        "regname": "图木舒克市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "364",
        "parid": "29",
        "regname": "吐鲁番市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "365",
        "parid": "29",
        "regname": "五家渠市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "366",
        "parid": "29",
        "regname": "伊犁哈萨克自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "367",
        "parid": "30",
        "regname": "昆明市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "368",
        "parid": "30",
        "regname": "怒江傈僳族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "369",
        "parid": "30",
        "regname": "普洱市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "370",
        "parid": "30",
        "regname": "丽江市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "371",
        "parid": "30",
        "regname": "保山市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "372",
        "parid": "30",
        "regname": "楚雄彝族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "373",
        "parid": "30",
        "regname": "大理白族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "374",
        "parid": "30",
        "regname": "德宏傣族景颇族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "375",
        "parid": "30",
        "regname": "迪庆藏族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "376",
        "parid": "30",
        "regname": "红河哈尼族彝族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "377",
        "parid": "30",
        "regname": "临沧市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "378",
        "parid": "30",
        "regname": "曲靖市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "379",
        "parid": "30",
        "regname": "文山壮族苗族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "380",
        "parid": "30",
        "regname": "西双版纳傣族自治州",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "381",
        "parid": "30",
        "regname": "玉溪市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "382",
        "parid": "30",
        "regname": "昭通市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "383",
        "parid": "31",
        "regname": "杭州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "384",
        "parid": "31",
        "regname": "湖州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "385",
        "parid": "31",
        "regname": "嘉兴市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "386",
        "parid": "31",
        "regname": "金华市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "387",
        "parid": "31",
        "regname": "丽水市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "388",
        "parid": "31",
        "regname": "宁波市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "389",
        "parid": "31",
        "regname": "绍兴市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "390",
        "parid": "31",
        "regname": "台州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "391",
        "parid": "31",
        "regname": "温州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "392",
        "parid": "31",
        "regname": "舟山市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "393",
        "parid": "31",
        "regname": "衢州市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "394",
        "parid": "32",
        "regname": "重庆市",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "395",
        "parid": "33",
        "regname": "香港",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "396",
        "parid": "34",
        "regname": "澳门",
        "regtype": "2",
        "ageid": "0"
      }, {
        "regid": "397",
        "parid": "35",
        "regname": "台湾",
        "regtype": "2",
        "ageid": "0"
      }]
  },
  yesFourSHellpMe: function(){
    this.setData({ showNow: true })
  },
  getFoursHellp: function(e){
    var elTop2 = this.data.elTop
    this.setData({ showNow: false, elTop2: elTop2})
  },
  bindMultiPickerChange: function(e) {//最终确定选择 城市时  省  市的索引值
    var that = this
    var multiArray = that.data.multiArray
    var multiIndex = that.data.multiIndex
    console.log('选择省：', e.detail.value[0], e.detail.value[1])
    that.setData({
      "multiIndex[0]": e.detail.value[0],//省的下标
      "multiIndex[1]": e.detail.value[1]//市的小标
    })
  },
  bindMultiPickerColumnChange: function(e) {//赋值省市
    var that = this
    var list
    switch (e.detail.column) {
      case 0:
        list = []
        for (var i = 0; i < that.data.objectMultiArray.length; i++) {
          // console.log(that.data.objectMultiArray[i].parid, that.data.objectMultiArray[e.detail.value], that.data.objectMultiArray[e.detail.value].regid)
          if (that.data.objectMultiArray[i].parid == that.data.objectMultiArray[e.detail.value].regid) {
            list.push(that.data.objectMultiArray[i].regname)
          }
        }
        // console.log('赋值操作：', list, e.detail.value)
        that.setData({
          "multiArray[1]": list,//当前省对应的市名集合
          "multiIndex[0]": e.detail.value,//当前省份的索引
          "multiIndex[1]": 0
        })
    }
  },
  inputChange: function(e) {
    // var region = this.data.region
    var _this = this
    var inputVal = e.detail.value
    var multiArray = this.data.multiArray
    var multiIndex = this.data.multiIndex
    // var region = this.data.region
    // console.log('我擦：', _this.data.multiArray)
    // var regionString = region.join('-')
    var regionString = _this.data.multiArray[0][multiIndex[0]] + '-' + _this.data.multiArray[1][multiIndex[1]]
    console.log(`地址拼接： ${regionString}, 当前选择市： ${_this.data.multiArray[1][multiIndex[1]]}`)
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
  bindfocus: function() {
    this.setData({
      isShow: true
    })
  },
  lookInfo: function() {
    this.setData({
      isShow: true
    })
  },
  close: function() {
    var isShow = this.data.isShow
    if (isShow) {
      this.setData({
        isShow: false
      })
    } else {
      this.setData({
        isShow: true
      })
    }

  },
  // 滚动切换标签样式
  switchTab: function(e) {
    var _this = this
    _this.setData({
      currentTab: e.detail.current
    });
    _this.checkCor();
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
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
  changeName: function (e) {
    this.setData({ name: e.detail.value})
  },
  changePhone: function (e) {
    this.setData({ phone: e.detail.value })
  },
  changeInsurer: function (e) {
    this.setData({ insurer: e.detail.value })
  },
  changeDesc: function (e) {
    this.setData({ desc: e.detail.value })
  },
  Order: function(e) { //下单
    var _this = this
    var data = _this.data.items
    var url = this.data.url || []
    var dataList = this.data.dataList.join(',') || '' //拼接好的id字符串
    var userId = app.globalData.sessionId
    var name = this.data.name || ''
    var phone = this.data.phone || ''
    var insurer = this.data.insurer || ''
    var desc = this.data.desc || ''
    var claimImg //需要拼接的图片url的字符串
    var index = url.length
    var k = 0
    this.setData({ isClick: false})
    if (url.length == 0) {
      wx.showToast({
        title: '请拍至少一张照片',
        icon: 'none'
      })
      _this.setData({ isClick: true })
      return false
    } 
    // if (name == undefined) {
    //   wx.showToast({
    //     title: '请填写用户姓名',
    //     icon: 'none'
    //   })
    //   _this.setData({ isClick: true })
    //   return false
    // }
    // if (phone == undefined) {
    //   wx.showToast({
    //     title: '请填写用户手机',
    //     icon: 'none'
    //   })
    //   _this.setData({ isClick: true })
    //   return false
    // }
    // if (insurer == undefined) {
    //   wx.showToast({
    //     title: '请填保险公司',
    //     icon: 'none'
    //   })
    //   _this.setData({ isClick: true })
    //   return false
    // }
    // if (desc == undefined) {
    //   wx.showToast({
    //     title: '请填现场情况',
    //     icon: 'none'
    //   })
    //   _this.setData({ isClick: true })
    //   return false
    // }
    if (!dataList) {
      _this.setData({ isClick: true })
      wx.showToast({
        title: '请至少选择一个4s店',
        icon: 'none'
      })
      return false
    }
    wx.showLoading({
      title: '下单中...'
    })
    for (var i = 0; i < url.length; i++) { //上传图片
      wx.uploadFile({
        url: api + 'api/v1/wx/claim/uploadfile',
        filePath: url[i],
        name: 'file',
        formData: {
          'thirdSessionKey': userId
        },
        success: function(res) {
          k++
          var data = JSON.parse(res.data)
          claimImg = claimImg === undefined ? data.data[0] : claimImg + '|' + data.data[0] //拼接图片url地址
          if (k == index) {
              wx.getLocation({
                type: 'gcj02',
                success: function(res) {
                  var latitude = res.latitude
                  var longitude = res.longitude
                  var qqmapsdk = new QQMapWX({
                    key: 'E6OBZ-I2YK6-QWESQ-MH3TB-OZUKO-THBPD' // 必填
                  });
                  qqmapsdk.reverseGeocoder({ //逆地址解析
                    location: {
                      latitude: latitude,
                      longitude: longitude
                    },
                    success: function(addressRes) {
                      var address1 = addressRes.result.formatted_addresses.recommend //需要的地址
                      var component = addressRes.result.address_component
                      var province = component.province
                      var city = component.city
                      var address = province + city + address1 //未处理的地址
                      console.log('最后的地址及需要用到的信息：', address, latitude, longitude, claimImg, dataList, userId)
                      _this.orderDom(address, latitude, longitude, claimImg, dataList, userId, name, phone, insurer, desc)
                    },
                    fail: function(e) {
                      console.log('错误：', e)
                    }
                  })
                }
              })
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
  orderDom: function (address, latitude, longitude, claimImg, dataList, userId, name, phone, insurer, desc) { //下单方法
    var _this = this
    wx.request({
      url: api + 'api/v1/wx/open/claimer/order/add',
      data: {
        'claimImg': claimImg,
        'lat': latitude,
        'lng': longitude,
        'address': address,
        'deptids': dataList,
        'thirdSessionKey': userId,
        'name': name,
        'phone': phone,
        'insurer': insurer,
        'desc': desc
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        if (res.data.errorCode == 0) {
          console.log('下单结果：', res.data)
          _this.setData({
            index: null,
            inputVal: '',
            dataList: [],
            url: null,
            isShow: false,
            name: '',
            phone: '',
            insurer: '',
            desc: '',
            isClick: true
          }) //重置所有状态
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
      fail: function(e) {
        console.log('下单失败的结果：', e)
      }
    })
  },
  checkboxChange: function(e) { //多选框
    var _this = this
    var id = e.currentTarget.dataset.id //当前点击的索引
    var dataList = this.data.dataList //选中的4s店
    var name = e.currentTarget.dataset.cont //当前点击的名字
    var index = dataList.indexOf(name) //当前点击名字是否在选中的4s店里面
    if (index == -1) {
      dataList.push(name) //如果没有 就加入选中数组
    } else {
      dataList.splice(index, 1) //如果有 就移除该数组
    }
    this.setData({
      dataList: dataList
    }) //渲染到视图

    //接下来的操作是把得到的数据都加一个disable对象名，值为false，当改变值时当前disable受到影响
    var data = this.data.fourSMapData //当前得到的数据 
    console.log('dataList++++++++++++++++++++:', dataList, data)
    for (var i = 0; i < data.length; i++) { //循环整个数据
      if (dataList.length > 2) { //当选中项数组大于2时 
      // debugger
        if (dataList.indexOf(data[i].id) == -1) { //那么禁止其余未被选中的选择框
          data[i].disable = true
        } else { //其余被选中的依然保持可更改状态
          data[i].checked = true
        }
      } else { //当选中项小于2时
        // debugger
        data[i].disable = false
        if (dataList.indexOf(data[i].id) == -1) { // 未被选中的
          data[i].disable = false //一直被禁用项释放禁用状态的变为可选状态
          data[i].checked = false //而之前被选中的，现在改为未选中状态
        } else { //其余的选中状态不变
          data[i].checked = true
        }
        // _this.setData({
        //   fourSMapData: data
        // }) //渲染到视图
      }
    }
    _this.setData({
      fourSMapData: data
    }) //渲染到视图
  },
  getBrand: function() { //获得品牌信息
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
      success: function(res) {
        console.log('获取品牌信息：', res.data)
        if (res.data.errorCode == 5001) {
          wx.login({
            success: function(res) {
              if (res.code) {
                // 发起网络请求
                wx.request({
                  url: api + 'api/v1/wx/getSession?code=' + res.code,
                  success: function(ress) {
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
          var brands = [] //品牌集合
          var datas = res.data.data
          for (var i = 0; i < datas.length; i++) {
            brands.push(datas[i].name)
          }
          _this.setData({
            array: brands
          })
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
      success: function(res) {
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
        qqmapsdk.reverseGeocoder({ //逆地址解析
          location: {
            latitude: latitudes,
            longitude: longitudes
          },
          success: function(addressRes) {
            var address1 = addressRes.result.formatted_addresses.recommend //需要的地址
            var component = addressRes.result.address_component
            var province = component.province
            var city = component.city
            var district = component.district
            var street_number = component.street_number
            var address = province + city + address1 //合并后的地址
            console.log('处理后的地址:', address)
            _this.setData({
              latitude: latitudes,
              longitude: longitudes,
              address: address
            })
          },
          fail: function(e) {
            console.log('错误：', e)
          }
        })
      }
    })
    wx.getSystemInfo({
      success(res) {
        var PmHeight = res.windowHeight
        var elTop = PmHeight - 360 + 'rpx'
        console.log('PmHeight:', PmHeight)
        _this.setData({ elTop: elTop })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  goFoursInfo: function(e) {
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
  goBottom: function(e) { //触底事件
    var _this = this
    var pageIndex = _this.data.pageIndex + 1
    var dict = _this.data.dict
    var qcpp = _this.data.qcpp
    var pageAll = _this.data.pageAll
    console.log('我监听到了滚动条到底事件:', pageIndex, pageAll)
    if (pageIndex >= pageAll) {
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
    } else {
      _this.getFourSMap(dict, qcpp, pageIndex, 1)
      _this.setData({
        pageIndex: pageIndex
      })
    }
  },
  getFourSMap: function(dict, qcpp, pageIndex, types) { //查询4s店信息
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
      success: function(res) {
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
        if (types) { //上拉加载更多
          var fourSMapData = _this.data.fourSMapData //已经获得的值
          for (var i = 0; i < fourSData.length; i++) {
            fourSMapData.push(fourSData[i])
          }
          // var url = []
          // for(var j = 0; j < fourSMapData.length; j++){
          //   url.push(fourSMapData[j].imgUrls.split("|")[0])
          // }
          // console.log('首页的图片：', url)

          console.log('上拉时的值：', fourSMapData, '现在获得的值：', fourSData)
          _this.setData({
            fourSMapData: fourSMapData,
            pageAll: total
          })
          wx.hideLoading()
        } else { //普通加载

          // var url = []
          // for (var j = 0; j < fourSMapData.length; j++) {
          //   url.push(fourSMapData[j].imgUrls.split("|")[0])
          // }
          // console.log('首页的图片：', url)

          _this.setData({
            fourSMapData: fourSData,
            pageAll: total,
            dataList: []
          })
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
  allUpload: function() {
    var _this = this
    var urls = []
    wx.chooseImage({
      count: 5,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        // tempFilePaths.reverse()
        _this.setData({
          url: tempFilePaths
        })
      }
    })
  }
})