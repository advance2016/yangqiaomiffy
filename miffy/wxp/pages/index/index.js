//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');

Page({
  data: {
    //weburl: "https://yangqiaomiffy.club",
    //weburl: "https://192.168.2.118",198.13.43.220
    weburl: "https://198.13.43.220",
    showModalStatus: false,
    pgidarray: [],
    pgidarrayvalue:[],
    currentTab: 0,
    clientHeight: 0,
    sdate: '2016-09-01',
    edate: '2016-09-01',

    wangarray: ['-10', '-9', '-8','-7', '-6','-5','-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],

    val_zhibang: 10,
    val_miwang: 10,
    val_mifei: 10,
    val_mixiaozhu: 10,
    val_mifen: 10,
    val_zhaoan: 10,
    val_wangan: 10,
    val_linshe: 10,
    val_huifang: 10,
    val_ditui: 10,
    val_yingliu: 10,
    val_fenxiang: 10,
    val_pgid: 0,
    val_shiyonzhang: 10,

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    
    listData: [],
    grp_detail:{},
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  show_group: function(data) {
      //var obj = JSON.parse(data);
      var obj = data;
      var ga = new Array();
      var gv = new Array();

      if(obj.result < 0) {
        alert(obj.msg);
        return false;
      }

      for (var i in obj.data) {
        ga.push(obj.data[i].gname);
        gv.push(obj.data[i].gid);
      }

      this.setData({
        pgidarray: ga,
        pgidarrayvalue: gv
      })

      return true;
  },

  show_person: function (data) {
    var obj = data;
    if (obj.result < 0) {
      alert(obj.msg);
      return false;
    }

    this.setData({
      listData: obj.data
    })

    return true;
  },

  clickBtnQuery: function (e) {
    var post_data = "";
    var that = this;
  },

  clickBtnAddPerson: function (e) {
    var post_data = "";
    var that = this;

    post_data = "zhibang=" + this.data.wangarray[this.data.val_zhibang];
    post_data += "&miwang=" + this.data.wangarray[this.data.val_miwang];
    post_data += "&mifei=" + this.data.wangarray[this.data.val_mifei];
    post_data += "&mixiaozhu=" + this.data.wangarray[this.data.val_mixiaozhu];
    post_data += "&mifen=" + this.data.wangarray[this.data.val_mifen];
    post_data += "&zhaoan=" + this.data.wangarray[this.data.val_zhaoan];
    post_data += "&wangan=" + this.data.wangarray[this.data.val_wangan];
    post_data += "&linshe=" + this.data.wangarray[this.data.val_linshe];
    post_data += "&huifang=" + this.data.wangarray[this.data.val_huifang];
    post_data += "&ditui=" + this.data.wangarray[this.data.val_ditui];
    post_data += "&yingliu=" + this.data.wangarray[this.data.val_yingliu];
    post_data += "&fenxiang=" + this.data.wangarray[this.data.val_fenxiang];
    post_data += "&shiyonzhang=" + this.data.wangarray[this.data.val_shiyonzhang];
    post_data += "&pgid=" + this.data.pgidarrayvalue[this.data.val_pgid];

    wx.request({
      url: this.data.weburl + '/add_person?' + post_data,//上线的话必须是https，没有appId的本地请求貌似不受影响
      data: post_data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
          that.show_person(res.data);
        that.setData({
          val_zhibang: 10,
          val_miwang: 10,
          val_mifei: 10,
          val_mixiaozhu: 10,
          val_mifen: 10,
          val_zhaoan: 10,
          val_wangan: 10,
          val_linshe: 10,
          val_huifang: 10,
          val_ditui: 10,
          val_yingliu: 10,
          val_fenxiang: 10,
          //val_pgid: 0,
          val_shiyonzhang: 10});


          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
      },
      fail: function (e) {
        // fail
        wx.showModal({
          title: '提示',
          content: '请求失败:' + e.errMsg,
          showCancel: false,
          confirmColor: '#0f77ff',
          success: (res) => { }
        })  
      },
      complete: function () {
        // complete
      }
    })

  },

  onLoad: function () {
    var that = this;

    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time_curr = util.formatDate(new Date());
    console.log(time_curr);
    // 再通过setData更改Page()里面的data，动态更新
    this.setData({
      sdate: time_curr,
      edate: time_curr
    });

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
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

    wx.request({
      url: this.data.weburl + '/show_group',//上线的话必须是https，没有appId的本地请求貌似不受影响
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        that.show_group(res.data);
      },
      fail: function (e) {
        // fail
        wx.showModal({
          title: '提示',
          content: '请求失败:' + e.errMsg,
          showCancel: false,
          confirmColor: '#0f77ff',
          success: (res) => { }
        })
      },
      complete: function () {
        // complete
      }
    })
    
    wx.request({
      url: this.data.weburl + '/show_person',//上线的话必须是https，没有appId的本地请求貌似不受影响
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        that.show_person(res.data);
      },
      fail: function (e) {
        // fail
        wx.showModal({
          title: '提示',
          content: '请求失败:' + e.errMsg,
          showCancel: false,
          confirmColor: '#0f77ff',
          success: (res) => { }
        })  
      },
      complete: function () {
        // complete
      }
    })
  },
  
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  
  bindStartDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sdate: e.detail.value
    })
  },

  bindEndDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      edate: e.detail.value
    })
  },

  bindzhibangPickerChange: function (e) {
    this.setData({
      val_zhibang: e.detail.value
    })
  },
  bindMiWangPickerChange: function (e) {
    this.setData({
      val_miwang: e.detail.value
    })
  },
  bindMiFeiPickerChange: function (e) {
    this.setData({
      val_mifei: e.detail.value
    })
  },
  bindXiaoZhuPickerChange: function (e) {
    this.setData({
      val_mixiaozhu: e.detail.value
    })
  },
  bindMiFenPickerChange: function (e) {
    this.setData({
      val_mifen: e.detail.value
    })
  },

  bindzhaoanChange: function (e) {
    this.setData({
      val_zhaoan: e.detail.value
    })
  },
  bindwanganChange: function (e) {
    this.setData({
      val_wangan: e.detail.value
    })
  }, 
  bindlinsheChange: function (e) {
    this.setData({
      val_linshe: e.detail.value
    })
  }, 
  bindhuifangChange: function (e) {
    this.setData({
      val_huifang: e.detail.value
    })
  },
  binddituiChange: function (e) {
    this.setData({
      val_ditui: e.detail.value
    })
  },
  bindyingliuChange: function (e) {
    this.setData({
      val_yingliu: e.detail.value
    })
  },
  bindfenxiangChange: function (e) {
    this.setData({
      val_fenxiang: e.detail.value
    })
  },
  bindPgidChange: function (e) {
    this.setData({
      val_pgid: e.detail.value
    })
  },       
  bindshiyonzhangChange: function(e) {
    this.setData({
      val_shiyonzhang: e.detail.value
    })
  },

  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  powerDrawer: function (e) {  
    var currentStatu = e.currentTarget.dataset.statu;
    if (currentStatu == "open") {
      this.setData({ grp_detail: this.data.listData[e.currentTarget.id - 1] });
    }
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200,  //动画时长
      timingFunction: "linear", //线性
      delay: 0  //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  }
         
})
