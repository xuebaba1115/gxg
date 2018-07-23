
cc.Class({
    extends: require('NetComponent'),

    properties: {
        _seats: [],
        _seats2: [],
        _myMJArr: [],
        _handcards: [],
        _globindex: [],
        _foldsindex: [],
        _selectmj: cc.Node,
        _selectflag: cc.Boolean,
        _isoutcard: cc.Boolean,
        _iscpcard: false,
        _cachedata: null,
        _cacheotherdata: null,
        _cplist: [],
        _penglist: [],
        _ganglist: [],
        roomlable: {
            default: null,
            type: cc.Label
        },
        caisheng: {
            default: null,
            type: cc.Node
        },
        myoutcard: {
            default: null,
            type: cc.Node
        },
        selfholds: {
            default: null,
            type: cc.Node
        },
        ops: {
            default: null,
            type: cc.Node
        },
        pgcmyself: {
            default: null,
            type: cc.Prefab,
        },
        pgclr: {
            default: null,
            type: cc.Prefab,
        },
        holdsEmpty: {
            default: [],
            type: [cc.SpriteFrame]
        },
        foldsEmpty: {
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
        this.roomlable.string = "房间号：" + cc.gameData.roomid
        this.initView()
    },

    initView: function () {
        var prepare = cc.find("/Canvas/prepare");
        this._chupai = cc.find("/Canvas/game/myself/ChuPai")
        this._chupai.active = false
        var seats = prepare.getChildByName("seats");
        for (var i = 0; i < seats.children.length; ++i) {
            this._seats.push(seats.children[i].getComponent("Seat"));
        }
        this._isoutcard = false
        this._selectflag = false
        this._foldchildid = 0
        this._myselffold = cc.find("/Canvas/game/myself/folds")
        this._globindex = ["M_character_1", 'M_character_2', 'M_character_3', 'M_character_4',
            'M_character_5', 'M_character_6', 'M_character_7', 'M_character_8', 'M_character_9',
            'M_dot_1', 'M_dot_2', 'M_dot_3', 'M_dot_4', 'M_dot_5', 'M_dot_6', 'M_dot_7', 'M_dot_8',
            'M_dot_9', 'M_bamboo_1', 'M_bamboo_2', 'M_bamboo_3', 'M_bamboo_4', 'M_bamboo_5',
            'M_bamboo_6', 'M_bamboo_7', 'M_bamboo_8', 'M_bamboo_9', 'M_wind_east', 'M_wind_north',
            'M_wind_south', 'M_wind_west', 'M_white', 'M_green', 'M_red']
        this._foldsindex = ["B_character_1", 'B_character_2', 'B_character_3', 'B_character_4',
            'B_character_5', 'B_character_6', 'B_character_7', 'B_character_8', 'B_character_9',
            'B_dot_1', 'B_dot_2', 'B_dot_3', 'B_dot_4', 'B_dot_5', 'B_dot_6', 'B_dot_7', 'B_dot_8',
            'B_dot_9', 'B_bamboo_1', 'B_bamboo_2', 'B_bamboo_3', 'B_bamboo_4', 'B_bamboo_5',
            'B_bamboo_6', 'B_bamboo_7', 'B_bamboo_8', 'B_bamboo_9', 'B_wind_east', 'B_wind_north',
            'B_wind_south', 'B_wind_west', 'B_white', 'B_green', 'B_red']
        console.log(this._seats)
    },

    netStart(event) {
        console.log('nestart')
        Network.send({ "command": cc.gameData.command, "roomid": parseInt(cc.gameData.roomid), "pid": parseInt(cc.gameData.pid) })
    },

    readygame: function () {
        console.log('ready')
        var seat = this._seats[cc.gameData.onlyone - 1]
        Network.send({ "command": "ready", "roomid": parseInt(cc.gameData.roomid), "pid": parseInt(cc.gameData.pid), "readystat": seat._ready.active ? -1 : 1 })
    },

    gameOver: function (data) {
        cc.log(data)
        Network.send({ "command": "overroom", "roomid": parseInt(cc.gameData.roomid), "pid": parseInt(cc.gameData.pid) })
        Network.close()
        cc.director.loadScene("hall");
    },

    getNetData(event) {
        var data = event.detail;
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
            case "gpch":
                this.mg_gpch(data)
                break;
            case "other":
                this.mg_other(data)
                break;
        }

    },

    mg_gaming: function (data) {
        console.log(data)
        var prepare = cc.find("/Canvas/prepare");
        var gameChild = cc.find("/Canvas/game");
        prepare.active = false;
        this._myMJArr = data.pinfo.handcard;
        this.showguicard(data.guicard)
        for (var index = 0; index < this.selfholds.childrenCount - 1; index++) {
            this._handcards.push(this.selfholds.children[index])
        }
        this.initmjs();
        gameChild.active = true
    },
    mg_other: function (data) {
        this._cacheotherdata = data
        if (data.c_action == 'outcard') {
            var allchupai = this.return_alltype(3)
            console.log(allchupai)
            for (var outpai in allchupai) {
                console.log(allchupai[outpai])
                if (allchupai[outpai].active) {
                    var folds = cc.find("folds", allchupai[outpai].parent)
                    for (var fcard in folds.children) {
                        if (!folds.children[fcard].active) {
                            console.log(folds.children[fcard], allchupai[outpai].parent.name)
                            var sname = allchupai[outpai].getComponent(cc.Sprite).spriteFrame._name
                            var selectid = this.getmjidbyframename(sname)
                            if (allchupai[outpai].parent.name == 'myself') {
                                folds.children[fcard].getComponent(cc.Sprite).spriteFrame = this.foldsEmpty[selectid]
                                folds.children[fcard].active = true
                            } else {
                                var hidefold = allchupai[outpai].parent.getComponent("Other_mj")
                                hidefold.folds(selectid, allchupai[outpai].parent.name)
                            }
                            allchupai[outpai].active = false
                            break
                        }
                    }
                }
            }
            var rlu = this.getweizhi_rul(data.onlyone)
            var rlu_mj = rlu[0].getComponent("Other_mj")
            rlu_mj.chuPai(this.holdsEmpty[this._cacheotherdata.indexcard])
            rlu_mj.myoutcard.active = false
        }
        if (data.c_action == 'getcard') {
            var rlu = this.getweizhi_rul(data.onlyone)
            var rlu_mj = rlu[0].getComponent("Other_mj")
            rlu_mj.myoutcard.active = true
        }
        if (data.c_action == 'chi') {
            var rlu = this.getweizhi_rul(data.onlyone)
            var rlu_mj = rlu[0].getComponent("Other_mj")
            rlu_mj.action_chi(data.indexcard, rlu[1])
            var allchupai = this.return_alltype(3)
            for (var outpai in allchupai) {
                if (allchupai[outpai].active) {
                    allchupai[outpai].active = false
                }
            }
        }
        if (data.c_action == 'peng') {
            var rlu = this.getweizhi_rul(data.onlyone)
            var rlu_mj = rlu[0].getComponent("Other_mj")
            rlu_mj.action_peng(data.indexcard, rlu[1])
            var allchupai = this.return_alltype(3)
            for (var outpai in allchupai) {
                if (allchupai[outpai].active) {
                    allchupai[outpai].active = false
                }
            }
        }
        if (data.c_action == '+gang' || data.c_action == 'angang' || data.c_action == 'minggang') {
            var rlu = this.getweizhi_rul(data.onlyone)
            var rlu_mj = rlu[0].getComponent("Other_mj")
            rlu_mj.action_peng(data.indexcard, data.c_action, rlu[1])
            var allchupai = this.return_alltype(3)
            for (var outpai in allchupai) {
                if (allchupai[outpai].active) {
                    allchupai[outpai].active = false
                }
            }
        }
    },

    mg_getcard: function (data) {
        var getcard_id = data.getcard
        this._isoutcard = true
        // if ( this._myMJArr[getcard_id]==3) {
        //     this.mg_gpch({"command": "gpch", "c_action":["angang"], "indexcard": getcard_id, "ppre": 1})
        // }
        this._myMJArr[getcard_id] = this._myMJArr[getcard_id] + 1
        var nc = this.myoutcard
        var sprite = nc.getComponent(cc.Sprite);
        sprite.spriteFrame = this.holdsEmpty[getcard_id]
        nc.active = true
    },

    mg_gpch: function (data) {
        this._cachedata = data
        this.isshow_gpch(data, true)
    },

    btm_sendchi: function (event) {
        var tmpchilist = []
        var pgc = cc.find("/Canvas/game/myself/penggangs")
        var cgpnode = cc.instantiate(this.pgcmyself);
        cgpnode.parent = pgc
        var nodecards = cgpnode.children
        nodecards[3].active = false
        for (var j in event.target._children) {
            var sname = event.target._children[j].getComponent(cc.Sprite).spriteFrame._name
            var chiid = this.getmjidbyframename(sname)
            this._myMJArr[chiid] -= j == 0 ? 0 : 1
            this._cplist.push(chiid)
            tmpchilist.push(chiid)
            if (j != 2) {
                var _mjid = this._handcards.shift()
                _mjid.active = false
            }
            var nodecards = cgpnode.children
            nodecards[j].getComponent(cc.Sprite).spriteFrame = this.foldsEmpty[chiid]
        }
        pgc.active = true
        console.log(this._myMJArr, this._cplist, tmpchilist, this._handcards)
        Network.send({
            "command": "gpch", "roomid": parseInt(cc.gameData.roomid), "c_action": "chi",
            "pid": parseInt(cc.gameData.pid), "indexcard": tmpchilist
        })
        this.initmjs()
        this._isoutcard = true
        this._iscpcard = true
        this.isshow_gpch(this._cachedata, false)
        var rlu = this.getweizhi_rul(this._cacheotherdata.onlyone)
        var rlu_mj = rlu[0].getComponent("Other_mj")
        rlu_mj.other_chupai.active = false
    },
    btm_sendpeng: function () {
        console.log('test,peng')
        var pgc = cc.find("/Canvas/game/myself/penggangs")
        var cgpnode = cc.instantiate(this.pgcmyself);
        cgpnode.parent = pgc
        cgpnode.name = this._cachedata.indexcard.toString()
        var nodecards = cgpnode.children
        nodecards[3].active = false
        this._myMJArr[this._cachedata.indexcard] -= 2
        for (var i = 0; i < 3; i++) {
            if (i != 2) {
                var _mjid = this._handcards.shift()
                _mjid.active = false
            }
            nodecards[i].getComponent(cc.Sprite).spriteFrame = this.foldsEmpty[this._cachedata.indexcard]
        }
        Network.send({
            "command": "gpch", "roomid": parseInt(cc.gameData.roomid), "c_action": "peng",
            "pid": parseInt(cc.gameData.pid), "indexcard": this._cachedata.indexcard
        })
        this.initmjs()
        this._isoutcard = true
        this._iscpcard = true
        this.isshow_gpch(this._cachedata, false)
        var rlu = this.getweizhi_rul(this._cacheotherdata.onlyone)
        var rlu_mj = rlu[0].getComponent("Other_mj")
        rlu_mj.other_chupai.active = false
    },
    btm_minggang: function () {
        console.log('test,minggang')
        var pgc = cc.find("/Canvas/game/myself/penggangs")
        if (this._cachedata.c_action.indexOf('minggang') != -1) {
            var cgpnode = cc.instantiate(this.pgcmyself);
            cgpnode.name = this._cachedata.indexcard.toString()
            cgpnode.parent = pgc
            var nodecards = cgpnode.children
            this._myMJArr[this._cachedata.indexcard] -= 3
            for (var i = 0; i < 4; i++) {
                if (i < 3) {
                    var _mjid = this._handcards.shift()
                    _mjid.active = false
                }
                nodecards[i].getComponent(cc.Sprite).spriteFrame = this.foldsEmpty[this._cachedata.indexcard]
            }
            var g_action = 'minggang'
        }
        if (this._cachedata.c_action.indexOf('angang') != -1) {
            var cgpnode = cc.instantiate(this.pgcmyself);
            cgpnode.name = this._cachedata.indexcard.toString()
            cgpnode.parent = pgc
            var nodecards = cgpnode.children
            this._myMJArr[this._cachedata.indexcard] -= 4
            for (var i = 0; i < 4; i++) {
                if (i < 3) {
                    var _mjid = this._handcards.shift()
                    _mjid.active = false
                    nodecards[i].getComponent(cc.Sprite).spriteFrame = this.foldsEmpty[34]
                } else {
                    nodecards[i].getComponent(cc.Sprite).spriteFrame = this.foldsEmpty[this._cachedata.indexcard]
                }
            }
            var g_action = 'angang'
        }
        if (this._cachedata.c_action.indexOf('+gang') != -1) {
            var gang1 = pgc.getChildByName(this._cachedata.indexcard.toString())
            gang1.children[3].getComponent(cc.Sprite).spriteFrame = this.foldsEmpty[this._cachedata.indexcard]
            gang1.children[3].active = true
            var g_action = '+gang'
        }
        Network.send({
            "command": "gpch", "roomid": parseInt(cc.gameData.roomid), "c_action": g_action,
            "pid": parseInt(cc.gameData.pid), "indexcard": this._cachedata.indexcard
        })
        this.initmjs()
        this.isshow_gpch(this._cachedata, false)
        var rlu = this.getweizhi_rul(this._cacheotherdata.onlyone)
        var rlu_mj = rlu[0].getComponent("Other_mj")
        rlu_mj.other_chupai.active = false
    },

    btm_hu: function () {
        console.log('test,hu')

    },

    isshow_gpch: function (data, isshow) {
        var ly = cc.find("/Canvas/New Layout")
        ly.active = isshow
        for (var i = 0; i < data.c_action.length; i++) {
            var caction = data.c_action[i];
            if (caction == "+gang" || caction == "angang" || caction == "minggang") {
                caction = "gang"
            }
            let op = this.ops.children[i]
            let op_action = op.getChildByName(caction)
            let guo = this.ops.getChildByName("guo")
            op_action.active = isshow
            guo.active = isshow
            if (caction == "chi") {
                for (var j = 0; j < data.chicard.length; j++) {
                    var blist = cc.find("ly/" + i, op_action);
                    for (var k = 0; k < data.chicard[j].length; k++) {
                        var childs = blist.children[k];
                        var sprite = childs.getComponent(cc.Sprite)
                        sprite.spriteFrame = this.holdsEmpty[data.chicard[j][k]]
                        childs.active = isshow
                        blist.active = isshow
                    }
                }

            } else {
                console.log(op_action)
                op.getChildByName("pai_bottom").active = isshow
                var optarg = op.getChildByName("opTarget")
                let sprite = optarg.getComponent(cc.Sprite)
                sprite.spriteFrame = this.holdsEmpty[data.indexcard]
                optarg.active = isshow
            }
        }
    },


    init_room: function (data) {
        // var self=this;
        console.log(data.pinfo)

        for (var i = 0; i < data.pinfo.length; i++) {
            console.log(data.pinfo[i])
            var seat = this._seats[data.pinfo[i].onlyone - 1]
            seat.setInfo("youke" + data.pinfo[i].pid, data.pinfo[i].pid, data.pinfo[i].onlyone)
            if (data.pinfo[i].pid == cc.gameData.pid) {
                cc.gameData.onlyone = data.pinfo[i].onlyone
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
            console.log("outcard", selectid, sname, this._chupai)
            console.log(cc.gameData.onlyone)
            console.log(this._myMJArr)
            this._myMJArr[selectid] = this._myMJArr[selectid] - 1
            console.log(this._myMJArr)
            if (this._iscpcard) {
                var _mjid = this._handcards.shift()
                _mjid.active = false
                this._iscpcard = false
                this._isoutcard = false
            } else {
                this.myoutcard.active = false
                this._isoutcard = false
            }
            this.initmjs()
            this.shoot(selectid)
            this._chupai.getComponent(cc.Sprite).spriteFrame = this.holdsEmpty[selectid]
            this._chupai.active = true
            this.hide_other()
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
        var sprite = this.caisheng.getComponent(cc.Sprite);
        sprite.spriteFrame = this.holdsEmpty[cuiid]
        this.caisheng.active = true
    },

    initmjs: function () {
        var tmpid = -1
        console.log(this._myMJArr, this._handcards)
        for (var i = 0; i < this._myMJArr.length; i++) {
            if (this._myMJArr[i] > 0) {
                for (var j = 0; j < this._myMJArr[i]; j++) {
                    tmpid += 1
                    var nc = this._handcards[tmpid]
                    var sprite = nc.getComponent(cc.Sprite);
                    sprite.spriteFrame = this.holdsEmpty[i]
                    nc.active = true
                }
            }
            this.myoutcard.active = this._isoutcard ? true : false
        }
    },


    //
    playguo: function () {
        this.isshow_gpch(this._cachedata, false)
        Network.send({
            "command": "guo", "roomid": parseInt(cc.gameData.roomid),
            "pid": parseInt(cc.gameData.pid), "ppre": this._cachedata.ppre
        })
    },

    return_alltype: function (id) {
        var tpyte = ["penggans", "holds", "folds", "ChuPai"]
        var r = cc.find("/Canvas/game/right/" + tpyte[id])
        var l = cc.find("/Canvas/game/left/" + tpyte[id])
        var u = cc.find("/Canvas/game/up/" + tpyte[id])
        var m = cc.find("/Canvas/game/myself/" + tpyte[id])
        return [r, l, u, m]
    },

    hide_other: function () {
        var rlu = this.getweizhi_rul(this._cacheotherdata.onlyone)
        var rlu_mj = rlu[0].getComponent("Other_mj")
        rlu_mj.folds(this._cacheotherdata.indexcard, rlu[1])
    },

    getweizhi_rul: function (onlyoneid) {
        var rightone = cc.gameData.onlyone % 4 + 1
        var upone = rightone % 4 + 1
        var leftone = upone % 4 + 1  //fix max.players
        console.log(rightone,upone,rightone)
        if (rightone == onlyoneid) {
            console.log(rightone,upone,rightone)
            var right = cc.find("/Canvas/game/right")
            return [right, "right"]
        } else if (upone == onlyoneid) {
            console.log(rightone,upone,rightone)
            var up = cc.find("/Canvas/game/up")
            return [up, "up"]
        } else if (leftone == onlyoneid) {
            console.log(rightone,upone,rightone)
            var left = cc.find("/Canvas/game/left")
            return [left, "left"]
        }
    },

    shoot: function (mjid) {
        Network.send({
            "command": "outcard", "roomid": parseInt(cc.gameData.roomid),
            "pid": parseInt(cc.gameData.pid), "pre_p": cc.gameData.onlyone, "outcard": mjid
        })
    }
});
