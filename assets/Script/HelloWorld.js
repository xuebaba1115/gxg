cc.Class({
    extends: require('NetComponent'),
    properties: {

        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!',
        //hall
    },

    // use this for initialization
    onLoad: function () {
 

    },

    // called every frame
    update: function (dt) {

    },

    onauth: function () {
        // console.log(wx.getSystemInfoSync())
        if (cc.sys.isMobile) {
            wx.login({
                success: function (loginResult) {
                    wx.getUserInfo({
                        success: function (userResult) {
                            var userInfo = userResult.userInfo;
                            var code = loginResult.code;
                            var encryptedData = userResult.encryptedData;
                            var iv = userResult.iv;
                            var header = {};

                            header['X-WX-Code'] = code;
                            header['X-WX-Encrypted-Data'] = encryptedData;
                            header['X-WX-IV'] = iv;

                            wx.request({
                                url: "https://www.tongqiaocun.com/api/wxauth",
                                header: header,
                                method: "GET",
                                data: null,

                                success: function (result) {
                                    let data = result.data;
                                    console.log(data);
                                    cc.gameData.token = data["token"];
                                    cc.gameData.nickname = data["nickName"];
                                    cc.gameData.pid = data["pid"];
                                    cc.director.loadScene("hall");

                                },

                                // 响应错误
                                fail: function (loginResponseError) {
                                    // var error = new LoginError(constants.ERR_LOGIN_FAILED, '登录失败，可能是网络错误或者服务器发生异常');
                                    // options.fail(error);
                                },
                            });
                        },

                        fail: function (userError) {
                            // var error = new LoginError(constants.ERR_WX_GET_USER_INFO, '获取微信用户信息失败，请检查网络状态');
                            // error.detail = userError;
                            // callback(error, null);
                        },
                    });
                },

                fail: function (loginError) {
                    // var error = new LoginError(constants.ERR_WX_LOGIN_FAILED, '微信登录失败，请检查网络状态');
                    // error.detail = loginError;
                    // callback(error, null);
                },
            });
            wx.authorize({
                scope: 'scope.userLocation',
                fail: function (res) {
                    // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                    if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                        // 处理用户拒绝授权的情况
                    }
                }
            })
        }
    },

    loging: function () {
        if (cc.sys.isBrowser) {
            cc.vv.http.sendRequest('/api/addyouke', null, this.tt,null,"POST")
            cc.log("use click weixin")
        // } else {
        //     // cc.gameData.token = "abc"
        //     // cc.gameData.nickname = "youke"
        //     // cc.director.loadScene("hall");
        //     // var zz = this.zhanghao.string;
        //     // var mm = this.passwd.string
        //     cc.vv.http.sendRequest('/api/addyouke', null, this.tt,null,"POST")
        }
    },

    tt: function (data) {
        console.log(data)
        cc.gameData.token = data.token
        cc.gameData.pid = data.pid
        cc.gameData.nickname = "youke"
        cc.director.loadScene("hall");
        
    }

});
