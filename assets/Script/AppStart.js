function initMgr() {
    cc.vv = {};
    cc.gameData = {};
    cc.playData = {};
    cc.vv.http = require("HTTP");
    cc.vv.hello = require("HelloWorld");
    cc.vv.hall = require("Hall");
}



cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        initMgr();
    },




});
