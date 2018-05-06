var TankData = require("TankData");
var TankType = TankData.tankType;
var PlayerType = TankData.playerType;

cc.Class({
    extends: require('NetComponent'),

    properties: {
        //地图
        curMap: cc.TiledMap,
        //摇杆

        maxCount: 10,
        tank: {
            default: null,
            type: cc.Prefab,

        },
    },

    onLoad: function () {
        this._tiledMap = this.curMap.getComponent('cc.TiledMap');
    },

    start: function (err) {
        if (err) {
            return;
        }
        this.tankNode = cc.find("/Canvas/Map/tank");
        this.tankPool = new cc.NodePool("tank1");
        for (var i = 0; i < 5; ++i) {
            var tank = cc.instantiate(this.tank);
            this.tankPool.put(tank);
        }
        this.addPlayerTank()

    },


    addPlayerTank: function () {
        
        if (this.tankPool.size() > 0) {
            var tank = this.tankPool.get();

            cc.log("addplayer")

            tank.position = cc.v2(300, 20);

            //获取坦克控制组件
            var tankCtrl = tank.getComponent("tank1");


            tank.parent = this.tankNode;
            //加到列表
            cc.log(tank)

        }
        return null;
    },

                    
        

    



    // update (dt) {},
});
