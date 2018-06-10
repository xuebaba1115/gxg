

cc.Class({
    extends: cc.Component,

    properties: {
        _sprIcon:null,
        _zhuang:null,
        _ready:null,
        _offline:null,
        _lblName:null,
        _lblScore:null,
        _scoreBg:null,
        _nddayingjia:null,
        _voicemsg:null,
        
        _chatBubble:null,
        _emoji:null,
        _lastChatTime:-1,
        
        _userName:"",
        _score:0,
        _dayingjia:false,
        _isOffline:false,
        _isReady:false,
        _isZhuang:false,
        _userId:null,    
        _onlyone:-1,    

    },

    onLoad: function () {
        if (!cc.vv) {
            cc.director.loadScene("helloworld");
            return
        }
        this._lblName = this.node.getChildByName("name").getComponent(cc.Label);    
        this._ready = this.node.getChildByName("ready"); 
        this.refresh();
    },

    refresh:function(){
        if(this._lblName != null){
            this._lblName.string = this._userName;    
        }

        if(this._ready){
            this._ready.active = this._isReady;
        }
        
        
        this.node.active = this._userName != null && this._userName != ""; 
    },

    setInfo(name,pid,onlyone){
        this._userName = name;
        this._userId=pid;
        this._onlyone=onlyone;
        this.refresh();    
    },    

    
    setReady:function(isReady){
        this._isReady = isReady;
        console.log(this._isReady)
        if(this._ready){
            this._ready.active = this._isReady;
        }
    },    
});
