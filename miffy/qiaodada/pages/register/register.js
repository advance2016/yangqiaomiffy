// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    val_pgid: -1,
    pgidarray: [],
    pgidarrayvalue: [],
    nickname: '',
    weburl: "https://yangqiaomiffy.club",
    loginstate: true,
    btntext: '注册',
    openid: '',
    authority: 0,  
  },

  show_group: function (data) {
    //var obj = JSON.parse(data);
    var obj = data;
    var ga = new Array();
    var gv = new Array();

    if (obj.result < 0) {
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

    if (ga.length > 0) {
      this.setData({
        val_pgid: 0
      })
    }

    return true;
  },

  get_group: function() {
    var that = this;
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
  },

  set_view: function() {
    if (this.data.loginstate) {
      this.setData({btntext: "微信一键登录"});
    }
    else 
    {
      this.setData({ btntext: "注册" });
    }

    console.log(this.data.btntext);
  },

  set_gobal: function(data) {
    wx.setStorageSync("authority", data.authority);
    wx.setStorageSync("uuid", data.uuid);
    wx.setStorageSync("group", data.group);
  },

  getRegisterInfo: function (code) {
    var that = this;

    console.log('获取用户登录凭证：' + code);
    // --------- 发送凭证 ------------------
    wx.request({
      //url: 'https://192.168.2.118/on_login',https://yangqiaomiffy.club/on_login
      url: 'https://yangqiaomiffy.club/on_login',
      data: { code: code },
      success: function (res) {
        var result = res.data['result'];
        console.log(res.data);
        if (result < 0 || result == undefined) {
          // fail
          //< 0失败，1未注册，0已注册
          wx.showModal({
            title: '提示',
            content: '请求失败:' + rspdata['msg'],
            showCancel: false,
            confirmColor: '#0f77ff',
            success: (res) => { }
          })
        } else if (result == 1) {
          wx.showModal({
            title: '提示',
            content: '该微信号尚未注册，请先注册',
            showCancel: false,
            confirmColor: '#0f77ff',
            success: (res) => { }
          })
          that.setData({
            loginstate: false,
            openid: res.data['openid'],
            authority: res.data['authority']
          });
          that.set_view();
        } else if (result == 0) {
          console.log(res.data);
          that.set_gobal(res.data);

          //跳转到主页面
          wx.redirectTo({
            url: '../index/index',
          })
        }
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
      // ------------------------------------         
    })

  },

  login: function() {
    var that = this;
    // 登录
    wx.login({
      success: function(res) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        if (code) {
          that.getRegisterInfo(code);          
        } else {

          console.log('获取用户登录态失败：' + res.errMsg);

          wx.showModal({
            title: '提示',
            content: '获取用户登录态失败：' + res.errMsg,
            showCancel: false,
            confirmColor: '#0f77ff',
            success: (res) => { }
          })
        }
      },

      fail: function (res) { 
        wx.showModal({
          title: '提示',
          content: '微信登录态失败：' + res.errMsg,
          showCancel: false,
          confirmColor: '#0f77ff',
          success: (res) => { }
        })        
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    this.set_view();
    this.login();

    this.get_group();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  bindPgidChange: function (e) {
    console.log(e);
    this.setData({
      val_pgid: e.detail.value
    })
  },

  // 去前后空格
  trim: function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },

  bindNameInput: function (e) {
    this.setData({
      nickname: this.trim(e.detail.value)
    })
  },

  on_register: function () {
    if (this.data.loginstate)
    {
      this.login();
      return true;
    }

    if (this.data.val_pgid == -1 && this.data.authority == 0) {
      wx.showToast({
        title: '请选择所属群',
        icon: 'loading',
        duration: 1000
      })

      return;    
    }

    if (this.data.nickname.length == 0) {
      wx.showToast({
        title: '昵称不能为空',
        icon: 'loading',
        duration: 1000
      })
      return;  
    }

    var post_data = "";
    var that = this;

    if (this.data.val_pgid == -1) {
      post_data = "pgid=" + -1;
    } else {
      post_data = "pgid=" + this.data.pgidarrayvalue[this.data.val_pgid];
    }
    post_data += "&nickname=" + this.data.nickname; 
    post_data += "&authority=" + this.data.authority;
    post_data += "&openid=" + this.data.openid;
 
    console.log(post_data);

    wx.request({
      url: this.data.weburl + '/register?' + post_data,//上线的话必须是https，没有appId的本地请求貌似不受影响
      data: post_data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.result == 0) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
            })
          that.set_gobal(res.data);
          //跳转到主页面
          wx.redirectTo({
            url: '../index/index',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })          
        }
      },
      fail: function (e) {
        // fail
        wx.showToast({
          title: '请求失败:' + e.errMsg,
          icon: 'success',
          duration: 2000
        })
      },
      complete: function () {
        // complete
      }
    })

  }  
})