// pages/database/index.js
wx.cloud.init();
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "",
    origin: "",
    count: "",
    userInfo: {},
    hasUserInfo: false,
    config: app.globalData.configuration
  },

  /**
   * 获取输入的content信息
   */
  contentInput: function(e) {
    this.data.content = e.detail.value;
  },

  /**
   * 获取输入的来源信息
   */
  originInput: function(e) {
    this.data.origin = e.detail.value;
  },

  /**
   * 插入用户输入的记录进数据库
   */
  async insertRecord() {
    if (this.data.content.length == 0 || this.data.origin.length == 0) {
      wx.showToast({
        title: '不能留空哟',
        image:"../../image/daidai.png",
        duration: 2000
      });
    } else {
      await this.updateCount();
      await db.collection(this.data.config.dbCount).doc(this.data.config.docCount).get().then((res) => {
        db.collection(this.data.config.dbData).add({
          data: {
            _id: res.data.count,
            content: this.data.content,
            origin: this.data.origin
          },
          success(res) {
            console.log(res);
          },
          fail: console.error
        });
      });
      wx.showToast({
        title: '快乐已入库',
        duration: 2000
      });
      this.setData({
        content: ""
      });
    }
  },

  /**
   * 获取记录总数，然后+1，生成新 id
   */
  updateCount() {
    // 调用云函数使总数加1
    return new Promise((resolve) => {
      wx.cloud.callFunction({
        name: 'incrCount',
        data:{
          dbName: this.data.config.dbCount,
          docName: this.data.config.docCount
        },
        success() {
          console.log("调用云函数成功");
          resolve();
        },
        fail: console.error
      });
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
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
    this.setData({
      origin: ""
    });
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

  }
})