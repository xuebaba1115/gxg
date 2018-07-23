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
        cc.vv.http.sendRequest('/api/creatroom', {token:cc.gameData.token}, this.goto_initroom.bind(this),null,"GET")
    },

    goto_initroom: function(data){
        console.log(data)
        if (data.errcode==0  ||data.errcode==1) {
            cc.gameData.roomid=data.roomstat;
            cc.gameData.command='join_room';
            cc.director.loadScene("mjgame");    
        } else if(data.errcode==2){
            cc.vv.http.sendRequest('/api/delroomid', {token:cc.gameData.token}, null,null,"GET")
            cc.vv.http.sendRequest('/api/creatroom', {token:cc.gameData.token}, this.goto_initroom.bind(this),null,"GET")
        }else{
            cc.gameData.roomid=data.roomstat;
            cc.gameData.command='init_room';
            cc.director.loadScene("mjgame");
        }        

    },


    joinroom: function (data,oldroomid) {
        console.log(oldroomid)
        if (oldroomid==undefined || cc.gameData==null) {
            cc.vv.http.sendRequest('/api/creatroom', {"roomid":this.roomNum.string,token:cc.gameData.token}, this.goto_joinroom,null,"GET")
        } else {
            cc.vv.http.sendRequest('/api/creatroom', {"roomid":oldroomid,token:cc.gameData.token}, this.goto_joinroom,null,"GET")
        }
    },    
    goto_joinroom: function(data){
        console.log(data)
        if (data.errcode==0) {
            console.log(data.roomstat)
            cc.gameData.command='join_room';
            cc.gameData.roomid=data.roomstat;
            cc.director.loadScene("mjgame");
        }
    }

    // initwss: function (ret) {
    //     console.log(ret.token);
    //     cc.vv.hello.savetoken = ret.token
    //     Network.initNetwork(cc.vv.hello.savetoken);

    // },







});
