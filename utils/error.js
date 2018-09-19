function errorHandle (code) {
  console.log('js里面的code:', code)
  let err2 = new Promise(function (resolve, reject) {
    wx.request({
      url: 'http://kosan.tunnel.qydev.com/api/v1/wx/getSession?code=' + code,
      success: function (ress) {
        resolve(ress.data.data.sessionId)
      }
    })
  });
  //记得return
  return err2
}

module.exports = {
  errorHandle: errorHandle
}