cc.Class({
    extends: require('NetComponent'),

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        editBox: cc.EditBox,

        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;
        Network.initNetwork();
    },

    // called every frame
    update: function (dt) {

    },



    send() {
        if (this.editBox.string == '') {
            alert('消息不能为空');
            return;
        }
        Network.send(3);
    },


    //退出房间
    close() {
        Network.close();
        this.mainLayer.active = true;
        this.chatLayer.active = false;
    },

    //连接成功
    netStart(event) {
        this._super(event);
        //发送登录
        Network.send(2);
    },


    getNetData(event) {

        let data = event.detail;
        cc.log(data)
        this.label.string=data;
            
        },
   

});
