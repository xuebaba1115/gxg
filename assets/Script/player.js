var TankData = require("TankData");
var TankType = TankData.tankType;
var PlayerType = TankData.playerType;

cc.Class({
    extends: require('NetComponent'),

    properties: {
        //地图
        curMap: cc.TiledMap,
        //摇杆
        yaogan: cc.Node,
        maxCount: 10,
        tank: {
            default: null,
            type: cc.Prefab,
        },
        bullet: cc.Prefab,
        tankFireTimes: {
            default: [],
            type: cc.Float,
        },
        spriteFrames: {
            default: [],
            type: cc.SpriteFrame,
        },
        tankSpeeds: {
            default: [],
            type: cc.Float,
        },
    },

    onLoad: function () {
        cc.playData = {}
        //获取摇杆控制组件
        this._joystickCtrl = this.yaogan.getComponent("JoystickCtrl");
        //获取地图 TiledMap 组件
        this._tiledMap = this.curMap.getComponent('cc.TiledMap');
    },

    start: function (err) {
        if (err) {
            return;
        }
        cc.log("start ############3")
        var self = this;
        //获取地图尺寸
        this.registerInputEvent();
        this._curMapTileSize = this._tiledMap.getTileSize();
        this._curMapSize = cc.v2(this._tiledMap.node.width, this._tiledMap.node.height);
        cc.playData.playerNodes = {};


        cc.playData.bulletPool = new cc.NodePool("BulletScript");
        var initBulletCount = 20;
        for (var i = 0; i < initBulletCount; ++i) {
            var bullet = cc.instantiate(this.bullet);
            cc.playData.bulletPool.put(bullet);
        }

        cc.playData.tankPool = new cc.NodePool("tank");
        cc.log(cc.playData.tankPool)
        for (var i = 0; i < this.maxCount; ++i) {
            var tank = cc.instantiate(this.tank);
            cc.playData.tankPool.put(tank);
        }
        Network.initNetwork(cc.gameData.token);
        // Network.send({ "command": "init", "name": cc.gameData.nickname, "x": 300, "y": 150, "playerType": 1, "angle": 90 })
        // this.init({ "players": [{ "playerType": 1, "playerID": 1, "connid": 5, "pos": { "y": 150, "x": 300 }, "tankType": 1, "team": 0, "name": "xlc" }], "command": "init" })
        // this.init(cc.vv.initdata)
    },

    netStart(event) {
        Network.send({ "command": "init", "name": cc.gameData.nickname, "x": 300, "y": 150, "playerType": 1, "angle": 90 })
    },


    getNetData(event) {
        let data = event.detail;
        // cc.vv.hall.say.string=data.connid;
        cc.log(data);
        switch (data.command) {
            case "init":
                this.init(data)
                break;
            case "move":
                this.tankMove(data.player)
                break;
            case "attack":
                this.tankAttack(data.player)
                break;
            case "rotation":
                this.tankRotation(data.player)
                break;
            case "kill":
                this.tankRotation(data.player)
                break;
            case "gameover":
                this.gameOver(data.player)
                break;
        }

    },

    init: function (data) {
        //地图内坦克列表
        cc.playData.tankList = [];
        cc.gameData.bulletList = [];
        //获取组件
        this.tankNode = cc.find("/Canvas/Map/tank");

        // data = cc.globalObj.parseStringToJson(data); //----fix

        var players = data.players;

        for (var key in players) {
            var player = players[key];
            var node = this.addPlayerTank(player);
            cc.playData.playerNodes[player.playerID] = node;
        }

    },


    addPlayerTank: function (player) {
        if (cc.playData.tankPool.size() > 0) {
            var tank = cc.playData.tankPool.get();
            console.log(player.tankType)
            switch(player.tankType){
                case TankType.normal:
                    tank.getComponent(cc.Sprite).spriteFrame = this.spriteFrames[0];
                break;

                case TankType.speed:
                    tank.getComponent(cc.Sprite).spriteFrame = this.spriteFrames[1];
                break;

                case TankType.big:
                    tank.getComponent(cc.Sprite).spriteFrame = this.spriteFrames[2];
                break;
            }

            tank.position = cc.v2(player.pos.x, player.pos.y);

            //获取坦克控制组件
            var tankCtrl = tank.getComponent("tank1");
            tankCtrl.tankType = player.tankType;
            //设置坦克属性
            tankCtrl.speed = this.tankSpeeds[this.tankSpeeds.length-1];
            tankCtrl.fireTime = this.tankFireTimes[this.tankFireTimes.length-1]
            tankCtrl.die = false;
            tankCtrl.team = player.team;
            tankCtrl.playerID = player.playerID;

            if (player.playerType == PlayerType.self) {
                this.playerTank = tank;
                this._playerTankCtrl = tankCtrl;
                this._playerID = player.playerID;
                // cc.gameData.player.tankType = player.tankType;
                // cc.gameData.player.team = player.team;

            }
            tank.parent = this.tankNode;
            //加到列表
            cc.playData.tankList.push(tank);
            return tank;
        }
        return null;
    },

    //坦克转向
    tankRotation: function (data) {

        var angle = data.angle;
        var playerNode = cc.playData.playerNodes[data.playerID];
        playerNode.rotation = angle;
    },

    //坦克移动
    tankMove: function (data) {
        // data = cc.globalObj.parseStringToJson(data);
        var pos = data.pos;
        var playerNode = cc.playData.playerNodes[data.playerID];
        playerNode.x = pos.x;
        playerNode.y = pos.y;

    },

    tankAttack: function (data) {
        var playerID = data.playerID;
        var playerNode = cc.playData.playerNodes[data.playerID];
        var tankCtrl = playerNode.getComponent("tank1");
        if (tankCtrl.startFire(cc.playData.bulletPool)) {
            //播放射击音效
        }

    },

    //开火按钮点击
    fireBtnClick: function () {
        cc.log("fire")
        if (this._playerTankCtrl.die) {
            return;
        }
        Network.send({ "command": "attack", "player": { "connid": this._playerID } });
    },

    registerInputEvent: function () {

        var self = this;
        this._joystickCtrl.addJoyStickTouchChangeListener(function (angle) {
            if (angle == self.curAngle &&
                !self._playerTankCtrl.stopMove) {
                return;
            }
            self.curAngle = angle;

            if (angle != null) {
                //开始前进
                self._playerTankCtrl.tankMoveStart(angle);
            } else {
                //停止前进
                self._playerTankCtrl.tankMoveStop();
            }

        });
        //按键按下
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,
            function (event) {
                var angle = null;
                switch (event.keyCode) {
                    case cc.KEY.w:
                        angle = 90;
                        break;
                    case cc.KEY.s:
                        angle = 270;
                        break;
                    case cc.KEY.a:
                        angle = 180;
                        break;
                    case cc.KEY.d:
                        angle = 0;
                        break;
                }
                if (event.keyCode == cc.KEY.k) {
                    this.fireBtnClick();
                } else {
                    self._playerTankCtrl.tankMoveStop();
                }
                if (angle != null) {
                    //开始前进
                    self._playerTankCtrl.tankMoveStart(angle);
                }
            }, this);
        //按键抬起
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,
            function (event) {
                //停止前进
                if (event.keyCode != cc.KEY.k) {
                    self._playerTankCtrl.tankMoveStop();
                }
            }, this);
    },

    gameOver: function (data) {
        cc.log(data)
        if ( typeof data.playerID === 'undefined') {
            Network.send({ "command": "gameover", "player": { "connid": this._playerID } })
            Network.close()
            cc.playData = null;
            cc.gameData.bulletList = null;
            cc.director.loadScene("hall");
        } else {
            cc.playData.playerNodes[data.playerID].destroy()
        }
    },
    //销毁时调用
    onDestroy: function () {

    },
    // update (dt) {},
});
