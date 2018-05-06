cc.Class({
    extends: cc.Component,
    properties: {
        hall_label: {
            default: null,
            type: cc.Label
        },



        // defaults, set visually when attaching this script to the Canvas
        hall_text: 'stat game!'
    },

    // use this for initialization
    onLoad: function () {
        this.hall_label.string = this.hall_text;
    },

    // called every frame
    update: function (dt) {

    },

    chooce_game: function () {
        
        cc.director.loadScene("gameB");
    },

    // initwss: function (ret) {
    //     console.log(ret.token);
    //     cc.vv.hello.savetoken = ret.token
    //     Network.initNetwork(cc.vv.hello.savetoken);

    // },







});
