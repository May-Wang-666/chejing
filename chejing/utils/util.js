const app = getApp()
const db = wx.cloud.database();
const _ = db.command;
const dbConfig = app.globalData.configuration

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getHappyById = id => {
  return db.collection(dbConfig.dbData)
      .where({ _id: _.gte(id)})
      .limit(1).get()
}

const getCommentsById = id => {
  return db.collection(dbConfig.dbComment)
    .where({origin_id: id})
    .orderBy("time", "desc")
    .get()
}

module.exports = {
  formatTime: formatTime,
  getHappyById: getHappyById,
  getCommentsById: getCommentsById
}