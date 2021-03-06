// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let {userInfo, collection, id} = event;

  // 根据传入的集合名和文档 id 删除记录
  await db.collection(collection).doc(id).remove({
    success: function (res) {
      console.log(res.data);
    }
  });

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  };
}