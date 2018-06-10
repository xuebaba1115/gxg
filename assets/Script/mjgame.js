
cc.Class({
    extends: require('NetComponent'),

    properties: {
        _seats: [],
        _seats2: [],
        _myMJArr: [],
        _handcards: [],
        _globindex: [],
        _selectmj: cc.Node,
        _selectflag: cc.Boolean,
        _isoutcard: cc.Boolean,
        roomlable: {
            default: null,
            type: cc.Label
        },
        caisheng:{
            default: null,
            type: cc.Node
        },
        holdsEmpty: {
            default: [],
            type: [cc.SpriteFrame]
        },

    },


    onLoad: function () {
        if (!cc.vv) {
            cc.director.loadScene("helloworld");
            return
        }
        Network.initNetwork(cc.gameData.token);
        this.roomlable.string="房间号："+cc.gameData.roomid
        this.initView()
    },

    initView: function () {
        var prepare = cc.find("/Canvas/prepare");
        var seats = prepare.getChildByName("seats");
        for (var i = 0; i < seats.children.length; ++i) {
            // this._seats.push(seats.children[i]);
            this._seats.push(seats.children[i].getComponent("Seat"));
        }
        this._isoutcard = false
        this._selectflag = false
        this._globindex = ["M_character_1", 'M_character_2', 'M_character_3', 'M_character_4',
            'M_character_5', 'M_character_6', 'M_character_7', 'M_character_8', 'M_character_9',
            'M_dot_1', 'M_dot_2', 'M_dot_3', 'M_dot_4', 'M_dot_5', 'M_dot_6', 'M_dot_7', 'M_dot_8',
            'M_dot_9', 'M_bamboo_1', 'M_bamboo_2', 'M_bamboo_3', 'M_bamboo_4', 'M_bamboo_5',
            'M_bamboo_6', 'M_bamboo_7', 'M_bamboo_8', 'M_bamboo_9', 'M_wind_east', 'M_wind_north',
            'M_wind_south', 'west', 'M_white', 'M_green', 'M_red']
        console.log(this._seats)
    },

    netStart(event) {
        console.log('nestart')
        Network.send({ "command": cc.gameData.command, "roomid": parseInt(cc.gameData.roomid), "pid": parseInt(cc.gameData.pid) })
    },

    readygame: function () {
        console.log('ready')
        Network.send({ "command": "ready", "roomid": parseInt(cc.gameData.roomid), "pid": parseInt(cc.gameData.pid), "readystat": 1 })
    },

    gameOver: function (data) {
        cc.log(data)
        Network.send({ "command": "overroom", "roomid": parseInt(cc.gameData.roomid), "pid": parseInt(cc.gameData.pid) })
        Network.close()
        cc.director.loadScene("hall");
    },

    getNetData(event) {
        let data = event.detail;
        switch (data.command) {
            case "gaming":
                this.mg_gaming(data)
                break;
            case "join_room":
                this.init_room(data)
                break;
            case "init_room":
                this.init_room(data)
                break;
            case "ready":
                this.ready(data)
                break;
            case "getcard":
                this.mg_getcard(data)
                break;
        }

    },

    mg_gaming: function (data) {
        console.log(data)
        var prepare = cc.find("/Canvas/prepare");
        prepare.active = false;
        this._myMJArr = data.pinfo.handcard;
        this.showguicard(data.guicard)
        this.initmjs();
    },

    mg_getcard: function (data) {
        var getcard_id = data.getcard
        this._isoutcard = true
        var nc = this._handcards[0]
        var sprite = nc.getComponent(cc.Sprite);
        sprite.spriteFrame = this.holdsEmpty[getcard_id]
        this._myMJArr[getcard_id] = this._myMJArr[getcard_id] + 1
        nc.active = true
    },

    init_room: function (data) {
        // var self=this;
        console.log(data.pinfo)

        for (var i = 0; i < data.pinfo.length; i++) {
            console.log(data.pinfo[i])
            var seat = this._seats[data.pinfo[i].onlyone - 1]
            seat.setInfo("youke" + data.pinfo[i].pid, data.pinfo[i].pid, data.pinfo[i].onlyone)
            if (data.pinfo[i].pid == cc.gameData.pid) {
                this._seats2.push(seat)
            }
            if (data.pinfo[i].readystat == 1) {
                seat.setReady(true)
            } else {
                seat.setReady(false)
            }
            console.log(seat)
        }
    },

    ready: function (data) {
        console.log(data)
        var seat = this._seats[data.pinfo.onlyone - 1]
        if (data.pinfo.readystat == 1) {
            seat.setReady(true)
        } else {
            seat.setReady(false)
        }
    },

    onMJClicked: function (event) {
        console.log(event)
        console.log(this._handcards)
        if (this._selectmj == null) {
            this._selectmj = event.target;
        }
        if (this._selectmj != event.target) {
            this._selectmj.setPosition(this._selectmj.x, 0)
            this._selectmj = event.target
            this._selectmj.setPosition(this._selectmj.x, this._selectmj.y + 20)
            this._selectflag = true
            return
        }

        var sname = this._selectmj.getComponent(cc.Sprite).spriteFrame._name
        var selectid = this.getmjidbyframename(sname)
        if (this._isoutcard && this._selectmj.y > 0) {
            console.log("outcard", selectid, sname)
            console.log(this._seats2[0]._onlyone)
            console.log(this._myMJArr)
            this._myMJArr[selectid] = this._myMJArr[selectid] - 1
            console.log(this._myMJArr)
            this._handcards[0].active = false
            this.initmjs()
            this.shoot(selectid)
            this._isoutcard = false
        }

        if (!this._selectflag) {
            this._selectmj.setPosition(this._selectmj.x, this._selectmj.y + 20)
            this._selectflag = true
        } else {
            this._selectmj.setPosition(this._selectmj.x, 0)
            this._selectflag = false
        }




    },
    // update (dt) {},
    getmjidbyframename: function (name) {
        return this._globindex.indexOf(name)
    },

    showguicard: function (cuiid) {        
        var sprite =this.caisheng.getComponent(cc.Sprite);
        sprite.spriteFrame = this.holdsEmpty[cuiid]
        this.caisheng.active = true
    },

    initmjs: function () {
        var gameChild = cc.find("/Canvas/game");
        var myselfside = gameChild.getChildByName('myself');
        var holds = myselfside.getChildByName("holds");
        this._handcards = []
        for (var index = 0; index < holds.childrenCount; index++) {
            this._handcards.push(holds.children[index])
        }

        for (var i = 0; i < this._myMJArr.length; i++) {
            if (this._myMJArr[i] != 0) {
                for (var j = 0; j < this._myMJArr[i]; j++) {
                    var nc = this._handcards.shift()
                    var sprite = nc.getComponent(cc.Sprite);
                    sprite.spriteFrame = this.holdsEmpty[i]
                    nc.active = true
                }
            }
        }
    },

    shoot: function (mjid) {
        Network.send({
            "command": "outcard", "roomid": parseInt(cc.gameData.roomid),
            "pid": parseInt(cc.gameData.pid), "pre_p": this._seats2[0]._onlyone, "outcard": mjid
        })
    }
});
