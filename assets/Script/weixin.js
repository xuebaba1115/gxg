var jssdk = document.createElement('script');
jssdk.async = true;
jssdk.src = 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js';
document.body.appendChild(jssdk);
/*---------JSSDK初始化-----------*/
var data = {
    appId: '',
    timestamp: '',
    nonceStr: '',
    signature: '',
}
jssdk.addEventListener('load', function () {
    wx.config({
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ',
            'onMenuShareWeibo', 'onMenuShareQZone', 'chooseImage', 'uploadImage'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(function () {
        var shareContent = {
            title: '', // 分享标题
            link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: '', // 分享图标
            desc: '', // 分享描述
            success: function () { },
            cancel: function () { }
        }
        function _shareCfuc() { wx.onMenuShareTimeline(shareContent); wx.onMenuShareAppMessage(shareContent); };
        _shareCfuc();
    });
});