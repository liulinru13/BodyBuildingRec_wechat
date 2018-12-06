// miniprogram/pages/homePage/homePage.js
const app = getApp();
const TRAIN = 'train';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    openid: null,
    trainObjs: [],//训练记录数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info(app.globalData);
    if (app.globalData.userInfo && app.globalData.openid){
      this.setData({
        userName: app.globalData.userInfo.nickName,
        openid: app.globalData.openid,
        });
    }else{
      wx.showToast({
        icon: 'none',
        title: '获取userInfo和openid失败',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.info('onReady');
    this.queryUserTrainInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.info('onShow');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.info('onHide');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.info('onUnload');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.info('onPullDownRefresh');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.info('onReachBottom');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.info('onShareAppMessage');
  },

  /**
   * 根据openId查询数据库记录
   * 如果没有数据，则插入数据
   */
  queryUserTrainInfo: function () {
    if (!this.data.openid) return;

    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection(TRAIN).where({
      _openid: this.data.openid
    }).get({
      success: res => {
        if(res.data && res.data.length > 0){
          this.setData({
            trainObjs: res.data
          })
        }
        //插入新数据
        else{
          this.insertTrain();
        }
        console.log('[数据库] [查询记录] 成功: ', res)
        
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  /**
   * 插入一条记录到表train
   */
  insertTrain: function () {
    const db = wx.cloud.database();
    // const obj = this.getEmptyTrainObj();
    const obj = {
      date: new Date(),
      effect: '#fff',//颜色表示的训练感受
      exerciseCapacity: '',//锻炼容量 求和 次数*重量
      group: [],//锻炼记录
      subject: '',//训练科目
      timeConsuming: 0,//消耗时间，分钟
      nickName: this.data.userName,
    };
    db.collection(TRAIN).add({
      data: obj,
      success: res => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id);
        this.queryUserTrainInfo();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
})