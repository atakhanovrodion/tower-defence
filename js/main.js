
window.addEventListener("load",()=>{
    game.init();
    
})


//UPDATE
setInterval(()=>{
    
    game.ctx.clearRect(0,0,game.canvas.width,game.canvas.height);
    game.ctx.save();
    game.ctx.translate(player.x,player.y);
    game.ctx.rotate((Math.atan2(playerControll.userY - player.y, playerControll.userX - player.x) + Math.PI/2));
    game.ctx.drawImage(player.img,-60,-60);
    game.ctx.translate(-player.x,-player.y);
    game.ctx.restore();
   //TOWERS RENDER
    for (let i=1;i<=playerControll.twrCount;i++){
        game.ctx.translate(towers[i].x,towers[i].y);
        game.ctx.drawImage(towers[i].img,-50,-50);
        game.ctx.translate(-towers[i].x,-towers[i].y);
    }
    
},20);


var game = {
    //get canvas load sound(in the futher)
    //main menu screen
    init: function(){
        game.canvas = document.getElementById("gamecanvas");
        game.ctx = game.canvas.getContext("2d");
        player.init();
        
        console.log('flag1');
        game.hideScreens();
        game.showScreen('gamestartscreen');
    },
    //game interface screen
   
    start: function(){
        game.hideScreens();
        game.showScreen('gameinterface');
        //ADD eventListener on mouse and keyboard
        playerControll.init();
        
    },
    hideScreens: function(){
        var screens = document.getElementsByClassName('gamelayer');
        for (let i = screens.length-1; i>=0; i--){
            let screen = screens[i];
            screen.style.display = "none";
        }
    },
    hideScreen: function(id){
        var screen = document.getElementById(id);
        screen.style.display = 'none';
    },
    showScreen: function(id){
        var screen = document.getElementById(id);
        screen.style.display = 'block';
    },
    
};


var levels = {
    load:function(){
    
    }
};


var playerControll = {
    //mouse x, y
    userX:0,
    userY:0,
    //count of towers
    twrCount:0,
   //ADD eventListener on mouse and keyboard
    init: function(){
        game.canvas.onmousemove = function(e){
            var k = [];
	        for (var i in e.target) k.push(i);
           
            playerControll.userX = e.pageX - e.target.offsetLeft;
            playerControll.userY = e.pageY - e.target.offsetTop;
            console.log(playerControll.userX);

        }
        //FIX ME
        window.addEventListener("keypress",playerControll.weventHandler,false);
        window.addEventListener("keypress",playerControll.aeventHandler,false);
        window.addEventListener("keypress",playerControll.seventHandler,false);
        window.addEventListener("keypress",playerControll.deventHandler,false);
        window.addEventListener("keypress",playerControll.reventHandler,false);
    },
   
    //FIX ME
    //EVENT LISTENER FOR KEYBOARD
    weventHandler: function(e){
        var keyCode = e.keyCode;
        if(keyCode == 87 || keyCode == 119){
            console.log("W");
            player.y-=5;
        }
    },
    aeventHandler: function(e){
        var keyCode = e.keyCode;
        if(keyCode == 65 || keyCode == 97){
            console.log("a");
            player.x-=5;
        }
    },
    seventHandler: function(e){
        var keyCode = e.keyCode;
        if(keyCode == 83 || keyCode == 115){
            console.log("s");
            player.y+=5;
        }
    },
    deventHandler: function(e){
        var keyCode = e.keyCode;
        if(keyCode == 68 || keyCode == 100){
            console.log("d");
            player.x+=5;
        }
    },
    //CREATE TOWER
    reventHandler: function(e){
        var keyCode = e.keyCode;
        if(keyCode == 82 || keyCode == 114){
            console.log("r");
            
            console.log(Math.sqrt((playerControll.userX-player.x)*(playerControll.userX-player.x)+
            (playerControll.userY-player.y)*(playerControll.userY-player.y)));
            if(Math.sqrt((playerControll.userX-player.x)*(playerControll.userX-player.x)+
            (playerControll.userY-player.y)*(playerControll.userY-player.y))<200){
            playerControll.twrCount++;
            towers[playerControll.twrCount] = new 
            Tower(playerControll.userX,playerControll.userY,'assets/images/tower.png');}
        }
    },
    
    

};


//list of towers
towers = {};
var loader = {
    loaded:true,
    loadCount: 0,
    totalCount: 0,
    //Sound Load
    loadImage: function(url){
        this.loaded = false;
        this.totalCount++;
        //Loadded screen

        var image = new Image;
        image.addEventListener("load",loader.itemLoaded,false);
        image.src = url;
        return image;
    },
    itemLoaded: function(ev){
        ev.target.removeEventListener(ev.type, loader.itemLoaded, false);
        loader.loadCount++;
        if (loader.itemLoaded == loader.totalCount){
            loader.loaded = true;
            loader.totalCount = 0;
            loader.loadCount = 0;
            //hide the loading screen
            if (loader.onload){
                loader.onload();
                loader.onload = undefined;
            }
        }
    }
};


var player = {
    x: 100,
    y: 100,
    health:100,
    money:0,

    init: function(){
        player.img = loader.loadImage('assets/images/transform.png');
        
    },
   


};


class Tower{
    constructor(x,y,img){
        this.x = x;
        this.y = y;
        this.img = loader.loadImage(img);

    }
}


