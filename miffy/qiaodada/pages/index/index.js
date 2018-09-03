//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');

Page({
  data: {
    weburl: "https://yangqiaomiffy.club",
    //weburl: "https://192.168.2.118",
    //weburl: "https://198.13.43.220",
    showModalStatus: false,
    showOwnerModalStatus: false,
    pgidarray: [],
    pgidarrayvalue:[],
    currentTab: 0,
    clientHeight: 0,
    sdate: '2018-08-11',
    edate: '2018-08-11',
    owner_sdate: '2018-08-11',
    owner_edate: '2018-08-11',    
    inputgrpname: '',
    inputnickname: '',
    uuid: '',
    authority: '',
    group: '',
    idkey: '',

    wangarray: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],

    grp_show_detail: {},

    val_zhibang: 0,
    val_miwang: 0,
    val_mifei: 0,
    val_mixiaozhu: 0,
    val_mifen: 0,
    val_zhaoan: 0,
    val_wangan: 0,
    val_linshe: 0,
    val_huifang: 0,
    val_ditui: 0,
    val_yingliu: 0,
    val_fenxiang: 0,
    val_pgid: 0,
    val_shiyonzhang: 0,

    val_set_pgid: 0,
    val_query_pgid: 0,
    owner_grp: -1,

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    
    listData: [],
    grp_detail:{},
    val_set_auth:0,
    userarray:[],
    userdata: [],
    authbtntext: '',

    listOwnerData:[],
    owner_detail: {},
    owneridkey: '',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  showReqFail: function (msg) {
    wx.showModal({
      title: '提示',
      content: '请求失败:' + msg,
      showCancel: false,
      confirmColor: '#0f77ff',
      success: (res) => { }
    })
  },

  show_group: function(data) {

      var obj = data;
      var ga = new Array();
      var gv = new Array();
      var index = -1;

      console.log(obj);
      if(obj.result < 0) {
        alert(obj.msg);
        return false;
      }

      for (var i in obj.data) {
        ga.push(obj.data[i].gname);
        gv.push(obj.data[i].gid);

        if (obj.owner_grp != -1 && obj.data[i].gid == obj.owner_grp) {
          this.setData({ owner_grp: i });
          this.setData({ val_pgid: i });
        }        
      }

      if (obj.owner_grp == -1) {
        this.setData({ owner_grp: -1 });
        this.setData({ val_pgid: -1 });
      }
    
      this.setData({
        pgidarray: ga,
        pgidarrayvalue: gv
      });
    
      if (this.data.val_set_pgid >= this.data.pgidarray.length) {
        this.setData({ val_set_pgid: this.data.pgidarray.length - 1});
      }

      return true;
  },

  show_person: function (data) {
    var obj = data;
    if (obj.result < 0) {
      this.showReqFail(obj.msg);
      return false;
    }

    console.log(data);

    this.setData({
      listData: obj.data,
      person_detail: obj.person_detail
    })

    return true;
  },

  show_owner_person: function (data) {
    var obj = data;
    if (obj.result < 0) {
      this.showReqFail(obj.msg);
      return false;
    }

    console.log(data);

    this.setData({
      listOwnerData: obj.data,
    })

    return true;
  },  

  clickBtnQuery: function (e) {
    this.query_person();
  },

  clickOwnerBtnQuery: function (e) {
    this.query_owner_person();
  },

  clickBtnAddPerson: function (e) {
    var post_data = "";
    var that = this;

    if (this.data.val_pgid == -1) {
      wx.showToast({
        title: '请到设置页面修改所属群',
        icon: 'none',
        duration: 2000
      })
      return;
    }

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
    post_data += "&uuid=" + this.data.uuid;

    wx.request({
      url: this.data.weburl + '/add_person?' + post_data,//上线的话必须是https，没有appId的本地请求貌似不受影响
      data: post_data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
          that.query_person(res.data);
        that.setData({
          val_zhibang: 0,
          val_miwang: 0,
          val_mifei: 0,
          val_mixiaozhu: 0,
          val_mifen: 0,
          val_zhaoan: 0,
          val_wangan: 0,
          val_linshe: 0,
          val_huifang: 0,
          val_ditui: 0,
          val_yingliu: 0,
          val_fenxiang: 0,
          //val_pgid: 0,
          val_shiyonzhang: 0});


          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
      },
      fail: function (e) {
        that.showReqFail(e.errMsg); 
      },
      complete: function () {
        // complete
      }
    })

  },

  // 去前后空格
  trim: function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },  

  bindAddGrpInput: function (e) {
    this.setData({
      inputgrpname: this.trim(e.detail.value)
    })
  },

  bindModifyNicknameInput: function (e) {
    this.setData({
      inputnickname: this.trim(e.detail.value)
    })
  },

  ModifyNickname: function() {
    var post_data = "";
    
    post_data = "nickname=" + this.data.inputnickname;
    post_data += "&uuid=" + this.data.uuid;

    wx.request({
      url: this.data.weburl + '/modify_nickname?' + post_data,//上线的话必须是https，没有appId的本地请求貌似不受影响
      data: post_data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        var result = res.data['result'];

        if (result < 0 || result == undefined) {
          that.showReqFail(res.data['msg']);
        } else {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: function (e) {
        that.showReqFail(e.errMsg);
      },
      complete: function () {
        // complete
      }
    })

  },

  clickModifyNickname: function (e) {
    var post_data = "";
    var that = this;

    if (this.data.inputnickname == '') {
      wx.showToast({
        title: '请输入昵称',
        icon: 'success',
        duration: 2000
      })
      return;
    }

    var post_data = "";
    var that = this;

    wx.showModal({
      title: '修改昵称',
      content: '确定要修改昵称为"' + this.data.inputnickname + '"吗',
      showCancel: true,//是否显示取消按钮
      //cancelText: "否",//默认是“取消”
      //cancelColor: 'skyblue',//取消文字的颜色
      //confirmText: "是",//默认是“确定”
      //confirmColor: 'skyblue',//确定文字的颜色
      success: function (res) {
        if (res.confirm) {
          that.ModifyNickname();
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    })


  },

  modify_grp: function() {
    var post_data = "";
    var that = this;

    post_data = "uuid=" + this.data.uuid;
    post_data += "&pgid=" + this.data.pgidarrayvalue[this.data.val_set_pgid];

    wx.request({
      url: this.data.weburl + '/modify_grp?' + post_data,//上线的话必须是https，没有appId的本地请求貌似不受影响
      data: post_data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);

        var result = res.data['result'];

        if (result < 0 || result == undefined) {
          that.showReqFail(res.data['msg']);
        } else {

          that.setData({ val_pgid: that.data.val_set_pgid});
          //that.setData({ val_query_pgid: that.data.val_set_pgid });
          that.setData({ owner_grp: that.data.val_set_pgid });

          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        }

      },
      fail: function (e) {
        that.showReqFail(e.errMsg,);
      },
      complete: function () {
        // complete
      }
    })      
  },


  clickModifyGrp: function (e) {
    var post_data = "";
    var that = this;

    wx.showModal({
      title: '修改群',
      content: '确定要修改群为"' + that.data.pgidarray[that.data.val_set_pgid] +'"吗',
      showCancel: true,//是否显示取消按钮
      //cancelText: "否",//默认是“取消”
      //cancelColor: 'skyblue',//取消文字的颜色
      //confirmText: "是",//默认是“确定”
      //confirmColor: 'skyblue',//确定文字的颜色
      success: function (res) {
        if (res.confirm) {
          that.modify_grp();
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },

  del_grp: function (value) {
    var post_data = "";
    var that = this;
    var posturl = '';

    if (value != '') {
      posturl = this.data.weburl + '/del_group?name=' + this.data.pgidarrayvalue[this.data.val_set_pgid];
      posturl += '&uuid=' + this.data.uuid;
    } else {
      posturl = this.data.weburl + '/clear_group?uuid=' + this.data.uuid;
    }
  
    wx.request({
      url: posturl,//上线的话必须是https，没有appId的本地请求貌似不受影响
      data: post_data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data['result'];

        if (result < 0 || result == undefined) {
          that.showReqFail(res.data['msg']);
        } else {
          that.show_group(res.data);
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        }

      },
      fail: function (e) {
        that.showReqFail(e.errMsg);
      },
      complete: function () {
        // complete
      }
    })
  },

  clickDelGrp: function (e) {
    var post_data = "";
    var that = this;

    wx.showModal({
      title: '删除群',
      content: '确定要删除群"' + that.data.pgidarray[this.data.val_set_pgid] + '"吗?',
      showCancel: true,//是否显示取消按钮
      //cancelText: "否",//默认是“取消”
      //cancelColor: 'skyblue',//取消文字的颜色
      //confirmText: "是",//默认是“确定”
      //confirmColor: 'skyblue',//确定文字的颜色
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          that.del_grp();
        } else if (res.cancel) {
          //点击取消,默认隐藏弹框
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },

  clickAddGrp: function (e) {
    var post_data = "";
    var that = this;

    if (this.data.inputgrpname == '') {
      wx.showToast({
        title: '请输入群名称',
        icon: 'success',
        duration: 2000
      })    
      return;
    }

    post_data = "name=" + this.data.inputgrpname;
    post_data += "&uuid=" + this.data.uuid;

    wx.request({
      url: this.data.weburl + '/add_group?' + post_data,//上线的话必须是https，没有appId的本地请求貌似不受影响
      data: post_data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        var result = res.data['result'];

        if (result < 0 || result == undefined) {
          that.showReqFail(res.data['msg']);
        } else {
          that.show_group(res.data);

          that.setData({inputgrpname: ''});
         
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: function (e) {
        that.showReqFail(e.errMsg);
      },
      complete: function () {
        // complete
      }
    })
  },

  clear_persion: function() {
    var that = this;
    wx.request({
      url: this.data.weburl + '/clear_person',//上线的话必须是https，没有appId的本地请求貌似不受影响
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        var result = res.data['result'];

        if (result < 0 || result == undefined) {
          that.showReqFail(rspdata['msg']);
        } else {
          that.query_person();

          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: function (e) {
        that.showReqFail(e.errMsg);
      },
      complete: function () {
        // complete
      }
    })
  },

  modify_auth: function () {
    var post_data = "";
    var that = this;
    var curr_user = {};

    curr_user = this.data.userdata[this.data.val_set_auth]

    post_data = "uuid=" + curr_user.uuid;

    if (curr_user.authority == 1) {
      post_data += "&authority=0";
    } else if (curr_user.authority == 0) {
      post_data += "&authority=1";
    } 

    wx.request({
      url: this.data.weburl + '/modify_auth?' + post_data,//上线的话必须是https，没有appId的本地请求貌似不受影响
      data: post_data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);

        var result = res.data['result'];

        if (result < 0 || result == undefined) {
          that.showReqFail(res.data['msg']);
        } else {

          var ga = new Array();

          that.setData({
            userdata: res.data.data
          })

          for (var i in res.data.data) {
            if (res.data.data[i]['uuid'] == that.data.uuid) {
              that.data.userdata.splice(i, 1);;
              continue
            }
            ga.push(res.data.data[i]['nickname']);
          }

          that.setData({
            userarray: ga,
          })

          that.setBtnAuthText(that.data.userdata[that.data.val_set_auth].authority);

          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        }

      },
      fail: function (e) {
        that.showReqFail(e.errMsg);
      },
      complete: function () {
        // complete
      }
    })
  },


  clickModifyAuth: function (e) {
    var post_data = "";
    var that = this;

    wx.showModal({
      title: '权限',
      content: '确定要' + that.data.authbtntext + '吗',
      showCancel: true,//是否显示取消按钮
      //cancelText: "否",//默认是“取消”
      //cancelColor: 'skyblue',//取消文字的颜色
      //confirmText: "是",//默认是“确定”
      //confirmColor: 'skyblue',//确定文字的颜色
      success: function (res) {
        if (res.confirm) {
          that.modify_auth();
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },  

  clickClearPerson: function (e) {
    var that = this;

    wx.showModal({
      title: '',
      content: '确定要清空所有积分数据',
      showCancel: true,//是否显示取消按钮
      //cancelText: "否",//默认是“取消”
      //cancelColor: 'skyblue',//取消文字的颜色
      //confirmText: "是",//默认是“确定”
      //confirmColor: 'skyblue',//确定文字的颜色
      success: function (res) {
        if (res.confirm) {
          that.clear_persion();
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },   

  query_owner_person: function () {
    var that = this;
    var db = new Date(this.data.owner_sdate);
    var de = new Date(this.data.owner_edate);
    var postdata = '';

    if (de.getTime() <= db.getTime()) {
      wx.showToast({
        title: '结束日期必须大于起始日期',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    //postdata = 'pgid=' + that.data.pgidarray[that.data.val_query_pgid];
    postdata += 'sdate=' + this.data.owner_sdate;
    postdata += '&edate=' + this.data.owner_edate;
    postdata += '&uuid=' + that.data.uuid;

    wx.request({
      url: this.data.weburl + '/show_owner_person?' + postdata,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        that.show_owner_person(res.data);
      },
      fail: function (e) {
        that.showReqFail(e.errMsg);
      },
      complete: function () {
        // complete
      }
    })
  },

  query_person: function() {
    var that = this;
    var db = new Date(this.data.sdate);
    var de = new Date(this.data.edate);
    var postdata = '';
  
    if (de.getTime() <= db.getTime()) {
      wx.showToast({
        title: '结束日期必须大于起始日期',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    //postdata = 'pgid=' + that.data.pgidarray[that.data.val_query_pgid];
    postdata += 'sdate=' + this.data.sdate;
    postdata += '&edate=' + this.data.edate;
    postdata += '&uuid=';
    /*
    if (!this.data.authority) {
      postdata += '&uuid=' + that.data.uuid;
    } else {
      postdata += '&uuid=';
    }
    */
    wx.request({
      url: this.data.weburl + '/show_person?' + postdata,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        that.show_person(res.data);
      },
      fail: function (e) {
        that.showReqFail(e.errMsg);
      },
      complete: function () {
        // complete
      }
    })    
  },

  setBtnAuthText: function(auth) {
    var str = '';
    if (auth == 1) {
      str = "修改为普通会员";
    } else if(auth == 0) {
      str = "修改为管理员";
    }

    this.setData({ authbtntext: str})
  },

  onLoad: function () {
    var that = this;

    this.setData({ uuid:wx.getStorageSync("uuid"),
      authority: wx.getStorageSync("authority"),
      group: wx.getStorageSync("group"), 
      inputnickname: wx.getStorageSync("nickname")});

    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time_curr = util.formatDate(new Date());
    console.log(time_curr);

    var date_next = new Date(time_curr);
    date_next.setDate(date_next.getDate() + 1);

    var time_next = util.formatDate(date_next);

    // 再通过setData更改Page()里面的data，动态更新
    this.setData({
      sdate: time_curr,
      edate: time_next,
      owner_sdate: time_curr,
      owner_edate: time_next,    
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
      url: this.data.weburl + '/show_group?uuid=' + that.data.uuid,//上线的话必须是https，没有appId的本地请求貌似不受影响
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        that.show_group(res.data);
        that.query_person();
      },
      fail: function (e) {
        that.showReqFail(e.errMsg);
      },
      complete: function () {
        // complete
      }
    })

    if (this.data.authority == 1) {
      wx.request({
        url: this.data.weburl + '/get_users',
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          var ga = new Array();
          console.log(res.data);
          that.setData({
            userdata: res.data.data
          })

          for (var i in res.data.data) {
             if (res.data.data[i]['uuid'] == that.data.uuid) {
              that.data.userdata.splice(i, 1);;
              continue
            }
            ga.push(res.data.data[i]['nickname']);
          }
          
          that.setData({
            userarray: ga,
            val_set_auth: 0,
          })

          if (ga.length > 0) {
            that.setBtnAuthText(that.data.userdata[0].authority);
          }
        },
        fail: function (e) {
          that.showReqFail(e.errMsg);
        },
        complete: function () {
          // complete
        }
      })    
    }
  },
  
  getUserInfo: function(e) {
    console.log(e)
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

  bindOwnerStartDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      owner_sdate: e.detail.value
    })
  },

  bindOwnerEndDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      owner_edate: e.detail.value
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

  bindAuthChange: function (e) {
    console.log(e);
    this.setData({
      val_set_auth: e.detail.value
    })
  },  

  bindSetPgidChange: function (e) {
    console.log(e);
    this.setData({
      val_set_pgid: e.detail.value
    })
  }, 

  bindQueryPgidChange: function (e) {
    this.setData({
      val_query_pgid: e.detail.value
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
    if (e.target.dataset.current == 1) {
      this.query_owner_person();
    }   
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
      if (e.target.dataset.current == 1) {
        this.query_owner_person();
      }
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  del_person: function (value) {
    var post_data = "";
    var that = this;
    var posturl = '';

    if (this.data.owneridkey == '' || this.data.owneridkey == undefined) {
      console.log("owneridkey is error");
      return;
    }

    wx.request({
      url: this.data.weburl + '/del_person?idkey=' + this.data.owneridkey,
      data: post_data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var result = res.data['result'];
        console.log(res.data);
        console.log("result"+res.data.result);
        if (result < 0 || result == undefined) {
          that.showReqFail(res.data['msg']);
        } else {
          that.ownerutil('close');
          that.query_owner_person();
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        }

      },
      fail: function (e) {
        that.showReqFail(e.errMsg);
      },
      complete: function () {
        // complete
      }
    })
  },  

  btn_del_person: function(e) {
    var that = this;

    wx.showModal({
      title: '',
      content: '确定删除该记录吗',
      showCancel: true,//是否显示取消按钮
      //cancelText: "否",//默认是“取消”
      //cancelColor: 'skyblue',//取消文字的颜色
      //confirmText: "是",//默认是“确定”
      //confirmColor: 'skyblue',//确定文字的颜色
      success: function (res) {
        if (res.confirm) {
          that.del_person();
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    })    
  },

  powerOwnerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;

    if (currentStatu == "open") {
      this.setData({ owner_detail: this.data.listOwnerData[e.currentTarget.id - 1] });
      this.setData({ owneridkey: e.currentTarget.dataset.idkey });
    }
    this.ownerutil(currentStatu)
  },  

  ownerutil: function (currentStatu) {
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
      animationOwnerData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationOwnerData: animation
      })

      //关闭
      if (currentStatu == "close") {
        this.setData(
          {
            showOwnerModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示
    if (currentStatu == "open") {
      this.setData(
        {
          showOwnerModalStatus: true
        }
      );
    }
  },

  powerDrawer: function (e) {  
    var currentStatu = e.currentTarget.dataset.statu;

    if (currentStatu == "open") {

      this.data.grp_show_detail.zhibang = "";
      this.data.grp_show_detail.miwang = "";
      this.data.grp_show_detail.mifei = "";
      this.data.grp_show_detail.mixiaozhu = "";
      this.data.grp_show_detail.mifen = "";
      this.data.grp_show_detail.zhaoan = "";
      this.data.grp_show_detail.wangan = "";
      this.data.grp_show_detail.linshe = "";
      this.data.grp_show_detail.huifang = "";
      this.data.grp_show_detail.ditui = "";
      this.data.grp_show_detail.yingliu = "";
      this.data.grp_show_detail.fenxiang = "";
      this.data.grp_show_detail.pgid = "";
      this.data.grp_show_detail.shiyonzhang = "";
    
      this.data.grp_show_detail.zhibangnum = 0;
      this.data.grp_show_detail.miwangnum = 0;
      this.data.grp_show_detail.mifeinum = 0;
      this.data.grp_show_detail.mixiaozhunum = 0;
      this.data.grp_show_detail.mifennum = 0;
      this.data.grp_show_detail.zhaoannum = 0;
      this.data.grp_show_detail.wangannum = 0;
      this.data.grp_show_detail.linshenum = 0;
      this.data.grp_show_detail.huifangnum = 0;
      this.data.grp_show_detail.dituinum = 0;
      this.data.grp_show_detail.yingliunum = 0;
      this.data.grp_show_detail.fenxiangnum = 0;
      this.data.grp_show_detail.pgidnum = 0;
      this.data.grp_show_detail.shiyonzhangnum = 0;    

      var pgid = this.data.listData[e.currentTarget.id - 1].pgid;
      var nickname = '';
      var num = 0;

      this.data.grp_show_detail.gname = this.data.listData[e.currentTarget.id - 1].gname;

      for (var i in this.data.person_detail) {
        //console.log(this.data.person_detail[i] + " pgid=" + pgid);
        nickname = this.data.person_detail[i].nickname;
        if (this.data.person_detail[i].pgid != pgid) {
          continue;
        }
    
        //num = 
        if (this.data.person_detail[i].zhibang != 0) {
          this.data.grp_show_detail.zhibang += nickname + " " + this.data.person_detail[i].zhibang + "; ";
          this.data.grp_show_detail.zhibangnum += this.data.person_detail[i].zhibang;
        }
        if (this.data.person_detail[i].miwang != 0) {
          this.data.grp_show_detail.miwang += nickname + " " + this.data.person_detail[i].miwang + "; ";
          this.data.grp_show_detail.miwangnum += this.data.person_detail[i].miwang;
        }        
        if (this.data.person_detail[i].mifei != 0) {
          this.data.grp_show_detail.mifei += nickname + " " + this.data.person_detail[i].mifei + "; ";
          this.data.grp_show_detail.mifeinum += this.data.person_detail[i].mifei;
        }
        if (this.data.person_detail[i].mixiaozhu != 0) {
          this.data.grp_show_detail.mixiaozhu += nickname + " " + this.data.person_detail[i].mixiaozhu + "; ";
          this.data.grp_show_detail.mixiaozhunum += this.data.person_detail[i].mixiaozhu;
        }
        if (this.data.person_detail[i].mifen != 0) {
          this.data.grp_show_detail.mifen += nickname + " " + this.data.person_detail[i].mifen + "; ";
          this.data.grp_show_detail.mifennum += this.data.person_detail[i].mifen;
        }  
        if (this.data.person_detail[i].zhaoan != 0) {
          this.data.grp_show_detail.zhaoan += nickname + " " + this.data.person_detail[i].zhaoan + "; ";
          this.data.grp_show_detail.zhaoannum += this.data.person_detail[i].zhaoan;
        } 
        if (this.data.person_detail[i].wangan != 0) {
          this.data.grp_show_detail.wangan += nickname + " " + this.data.person_detail[i].wangan + "; ";
          this.data.grp_show_detail.wangannum += this.data.person_detail[i].wangan;
        }               
        if (this.data.person_detail[i].linshe != 0) {
          this.data.grp_show_detail.linshe += nickname + " " + this.data.person_detail[i].linshe + "; ";
          this.data.grp_show_detail.linshenum += this.data.person_detail[i].linshe;
        }  
        if (this.data.person_detail[i].huifang != 0) {
          this.data.grp_show_detail.huifang += nickname + " " + this.data.person_detail[i].huifang + "; ";
          this.data.grp_show_detail.huifangnum += this.data.person_detail[i].huifang;
        }                
        if (this.data.person_detail[i].ditui != 0) {
          this.data.grp_show_detail.ditui += nickname + " " + this.data.person_detail[i].ditui + "; ";
          this.data.grp_show_detail.dituinum += this.data.person_detail[i].ditui;
        }    
        if (this.data.person_detail[i].yingliu != 0) {
          this.data.grp_show_detail.yingliu += nickname + " " + this.data.person_detail[i].yingliu + "; ";
          this.data.grp_show_detail.yingliunum += this.data.person_detail[i].yingliu;
        }    
        if (this.data.person_detail[i].fenxiang != 0) {
          this.data.grp_show_detail.fenxiang += nickname + " " + this.data.person_detail[i].fenxiang + "; ";
          this.data.grp_show_detail.fenxiangnum += this.data.person_detail[i].fenxiang;
        }
        if (this.data.person_detail[i].shiyonzhang != 0) {
          this.data.grp_show_detail.shiyonzhang += nickname + " " + this.data.person_detail[i].shiyonzhang + "; ";
          this.data.grp_show_detail.shiyonzhangnum += this.data.person_detail[i].shiyonzhang;
        }       
      }
      this.setData({ grp_show_detail: this.data.grp_show_detail});
      console.log(this.data.grp_show_detail);
      //this.setData({ grp_detail: this.data.listData[e.currentTarget.id - 1] });
      //this.setData({idkey: e.currentTarget.dataset.idkey});
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
  },
  videoErrorCallback: function (e) {
    console.log('视频错误信息:' + e.detail.errMsg);
  }
})
