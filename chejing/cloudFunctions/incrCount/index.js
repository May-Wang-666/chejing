// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext();
  // 更新文档总数 + 1
  // todo:出错控制
  await db.collection('counters').doc('chejing_total').update({
    data: {
      // count字段自增1
      count: _.inc(1)
    },
    success(res) {
      console.log("更新文件总数成功");
    },
    fail(res) {
      console.log("更新文件总数失败")
    }
  });

  return {
    sum: event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}