
cc.Class({
    extends: cc.Component,

    properties: {
        other_flods: {
            default: null,
            type: cc.Node
        },
        other_holds: {
            default: null,
            type: cc.Node
        },
        myoutcard: {
            default: null,
            type: cc.Node
        },
        pgcrlu: {
            default: null,
            type: cc.Prefab,
        },
        other_chupai: {
            default: null,
            type: cc.Node
        },
        other_penggangs: {
            default: null,
            type: cc.Node
        },
        rEmpty: {
            default: [],
            type: [cc.SpriteFrame]
        },
        uEmpty: {
            default: [],
            type: [cc.SpriteFrame]
        },
        lEmpty: {
            default: [],
            type: [cc.SpriteFrame]
        },
    },


    onLoad() {
        this.initView()

    },
    initView: function () {
        this._foldchildid = 0
        this.other_chupai.active = false
        // this.myoutcard.active=false
        console.log("test")
    },

    // getcard: function () {
    //     this.myoutcard.active = this.myoutcard.active ? false : true
    // },

    chuPai: function (sframe) {
        this.other_chupai.getComponent(cc.Sprite).spriteFrame = sframe
        this.other_chupai.active = true
        console.log(this.other_chupai)
    },

    folds: function (id, p) {
        if (this.other_chupai.active) {
            var foldscard = this.other_flods.children[this._foldchildid]
            var tmpempty = this.getempty(p)
            foldscard.getComponent(cc.Sprite).spriteFrame = tmpempty[id]
            foldscard.active = true
            this._foldchildid += 1
        }
        this.other_chupai.active = false
    },

    action_chi: function (cardlist,p) {        
        for (var i = 0; i < 3; i++) {
            for (var j = 13; j > 0; j--) {
                var hidecard = this.other_holds.children[j]
                console.log(hidecard)
                if (hidecard.active) {                    
                    hidecard.active = false
                    break
                }
            }
        }        
        var cgpnode = cc.instantiate(this.pgcrlu);
        cgpnode.parent = this.other_penggangs
        var nodecards = cgpnode.children
        nodecards[3].active = false
        var tmpempty = this.getempty(p)
        for (var index = 0; index < cardlist.length; index++) {
            nodecards[index].getComponent(cc.Sprite).spriteFrame = tmpempty[cardlist[index]]            
        }
    },

    action_chi: function (cardlist,p) {  
        this.hideholds()            
        var cgpnode = cc.instantiate(this.pgcrlu);
        cgpnode.parent = this.other_penggangs
        var nodecards = cgpnode.children
        nodecards[3].active = false
        var tmpempty = this.getempty(p)
        for (var index = 0; index < cardlist.length; index++) {
            nodecards[index].getComponent(cc.Sprite).spriteFrame = tmpempty[cardlist[index]]            
        }
    },

    action_peng: function (indexcard,p) {  
        this.hideholds()            
        var cgpnode = cc.instantiate(this.pgcrlu);
        cgpnode.name = indexcard.toString()
        cgpnode.parent = this.other_penggangs
        var nodecards = cgpnode.children
        nodecards[3].active = false
        var tmpempty = this.getempty(p)
        for (var index = 0; index < 3; index++) {
            nodecards[index].getComponent(cc.Sprite).spriteFrame = tmpempty[indexcard]            
        }
    },

    action_gang: function (indexcard,action,p) {  
        this.hideholds()            
        var cgpnode = cc.instantiate(this.pgcrlu);
        cgpnode.parent = this.other_penggangs
        var nodecards = cgpnode.children
        var tmpempty = this.getempty(p)
        if (action=="angang") {
            for (var index = 0; index < 4; index++) {
                nodecards[index].getComponent(cc.Sprite).spriteFrame = tmpempty[34]            
            }
            return
        }
        if (action=="+gang") {
            for (var index = 0; index < 4; index++) {
                var gang1 = pgc.getChildByName(indexcard.toString())
                gang1.children[3].getComponent(cc.Sprite).spriteFrame = tmpempty[indexcard]
                gang1.children[3].active = true          
            }
            return
        }
        for (var index = 0; index < 4; index++) {
            nodecards[index].getComponent(cc.Sprite).spriteFrame = tmpempty[indexcard]            
        }
    },

    hideholds:function () {
        for (var i = 0; i < 3; i++) {
            for (var j = 13; j > 0; j--) {
                var hidecard = this.other_holds.children[j]
                if (hidecard.active) {                    
                    hidecard.active = false
                    break
                }
            }
        }  
    },

    getempty: function (p) {
        switch (p) {
            case "right":
                return this.rEmpty
                break;
            case "up":
                return this.uEmpty
                break;
            case "left":
                return this.lEmpty
                break;
        }

    }


});
