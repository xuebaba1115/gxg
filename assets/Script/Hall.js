cc.Class({
    extends: cc.Component,
    properties: {
        hall_label: {
            default: null,
            type: cc.Label
        },

        roomNum:{
            default: null,
            type: cc.EditBox
        },


        // defaults, set visually when attaching this script to the Canvas
        hall_text: 'stat game!'
    },

    // use this for initialization
    onLoad: function () {
        if (!cc.vv) {
            cc.director.loadScene("helloworld");
            return
        }
        this.hall_label.string = this.hall_text;
    },

    // called every frame
    update: function (dt) {

    },

    gototankgame: function(){
        cc.director.loadScene("gameB");


    },

    chooce_game: function () {
        // cc.gameData.token
        // cc.gameData.pid
        cc.vv.http.sendRequest('/api/creatroom', null, this.goto_initroom,null,"GET",cc.gameData.token)
    },

    goto_initroom: function(data){
        console.log(data)
        cc.gameData.roomid=data.roomid;
        cc.gameData.command='init_room';
        cc.director.loadScene("mjgame");
    },
    goto_joinroom: function(){
        cc.log(this.roomNum.string)

        
        cc.gameData.roomid=this.roomNum.string;
        cc.gameData.command='join_room';
        cc.director.loadScene("mjgame");
    }

    // initwss: function (ret) {
    //     console.log(ret.token);
    //     cc.vv.hello.savetoken = ret.token
    //     Network.initNetwork(cc.vv.hello.savetoken);

    // },







});
