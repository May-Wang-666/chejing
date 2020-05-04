//index.js
//获取应用实例
const utils = require("../../utils/util");
const app = getApp()
const db = wx.cloud.database();
const _ = db.command;

Page({
  data: {
    motto: '点下头像试看看',
    userInfo: {},
    hasUserInfo: false,
    openid: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    happiness: [],
    showDialog: false,
    detailId: null,
    detailContent: null,
    detailFrom: null,
    detailComments: [],
    config: app.globalData.configuration,
  },

  //事件处理函数
  bindViewTap: function () {
    // 跳转到首页
    wx.switchTab({
      url: '../chejing/index',
    })
  },

  getHappiness: function () {
    if (this.data.openid != null) {
      db.collection(this.data.config.dbData)
        .where({
          _openid: this.data.openid
        }).get().then((res) => {
          this.setData({
            happiness: res.data
          })
        })
    } else {
      this.setData({
        happiness: []
      })
    }
  },

  getOpenid: function () {
    wx.cloud.callFunction({
      name: 'getOpenId'
    }).then(res => {
      var openid = res.result.openid
      this.setData({
        openid: openid
      })
      this.getHappiness();
    }).catch(err => {
      console.log(err)
    });
  },

  hideDetail: function () {
    this.setData({
      showDialog: false,
    })
  },

  getDetail: function (e) {
    var id = e.currentTarget.id;
    utils.getHappyById(Number(id))
      .then((res) => {
        this.setData({
          detailContent: res.data[0].content,
          detailFrom: res.data[0].origin,
          detailId: res.data[0]._id
        });

        utils.getCommentsById(this.data.detailId)
          .then((res) => {
            comments = []
            res.data.forEach((item, index) => {
              comments.push({
                "comment": item.comment,
                "time": utils.formatTime(new Date(item.time))
              })
            })
            this.setData({
              detailComments: comments,
              showDialog: true,
            })
          });
      })
  },

  hideDialog: function () {
    this.setData({
      showDialog: false
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      });
    } else if (this.data.canIUse) {
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

    this.getOpenid();
  },

  getUserInfo: function (e) {
    if (Object.keys(e.detail.userInfo).length != 0) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
    }
  }
})