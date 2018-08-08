
window.addEventListener("load",()=>{
    game.init();
    
})



//UPDATE

setInterval(()=>{
    
    game.ctx.clearRect(0,0,game.canvas.width,game.canvas.height);
    game.ctx.save();
    //map rendering
    for (let i = 0; i<game.canvas.width/map.x; i++){
        for(let j=0; j<game.canvas.height/map.y;j++){
            
                game.ctx.translate(map.arr[i][j].x,map.arr[i][j].y);
                game.ctx.drawImage(map.arr[i][j].img,0,0);
                game.ctx.translate(-map.arr[i][j].x,-map.arr[i][j].y);
            
        }    
    } 
    
    
    //PLAYER rendering
    game.ctx.translate(player.x,player.y);
    game.ctx.rotate((Math.atan2(playerControll.userY - player.y, playerControll.userX - player.x) + Math.PI/2));
    game.ctx.drawImage(player.img,-32,-32);
    game.ctx.translate(-player.x,-player.y);
    
    game.ctx.restore();
   //TOWERS RENDER
    for (let i=1;i<=playerControll.twrCount;i++){
        game.ctx.translate(towers[i].x,towers[i].y);
        game.ctx.drawImage(towers[i].img,0,0);
        game.ctx.translate(-towers[i].x,-towers[i].y);
        
        if (Math.sqrt((enm.x-towers[i].x)*(enm.x-towers[i].x)+
        (enm.y-towers[i].y)*(enm.y-towers[i].y))<200){
            towers[i].isShooting = true;
        }
        if (towers[i].isShooting){
            
            
            bullets[playerControll.bltCount] = new Bullet(towers[i].x,towers[i].y,'assets/images/bullet.png',5,
            Math.atan2(enm.y - towers[i].y, enm.x - towers[i].x),playerControll.bltCount);
            playerControll.bltCount++;
        }
    }
    //ENEMY RENDER
    if (enm){
    game.ctx.translate(enm.x,enm.y);
    game.ctx.drawImage(enm.img,-32,-32);
    game.ctx.translate(-enm.x,-enm.y);
    }
    //BACKGROUND RENDER 
    
    //BULLETS RENDER 
    
    if (bullets!=false){
    bullets.forEach(item => {
        //console.log(item);
      //  game.ctx.save();
        item.x+=item.speed*Math.cos(item.angle);
        item.y+=item.speed*Math.sin(item.angle);
       
        game.ctx.translate(item.x,item.y);
        game.ctx.rotate(item.angle);
        game.ctx.drawImage(item.img,-25,-25);
        game.ctx.rotate(-item.angle);
        
       // console.log(item.angle);
        game.ctx.translate(-item.x,-item.y);
        game.ctx.restore();
        if (item.x>game.canvas.width){
             delete bullets[item.id];
            
            
        }
        if (enm &&((enm.x-item.x)*(enm.x-item.x)+
        (enm.y-item.y)*(enm.y-item.y)<64)){
            console.log("SHOOT");
            enm.health-=10;
            delete bullets[item.id];
            //playerControll.bltCount--;
            if(enm.health<0){
                enm = undefined;
            }
        }
        
    });
    }
    
},20);


var game = {
    //get canvas load sound(in the futher)
    //main menu screen
    init: function(){
        game.canvas = document.getElementById("gamecanvas");
        game.ctx = game.canvas.getContext("2d");
        player.init();
        
       // console.log('flag1');
        game.hideScreens();
        game.showScreen('gamestartscreen');
        
        map.initArr();
        map.arr[2][3].type = 1;
        map.arr[5][4].type = 1;
         //FIX ME
    for (let i = 0; i<game.canvas.width/map.x; i++){
        for(let j=0; j<game.canvas.height/map.y;j++){
            if (map.arr[i][j].type==1){
                
                playerControll.twrCount++;
                towers[playerControll.twrCount] = new 
                Tower(map.arr[i][j].x,map.arr[i][j].y,'assets/images/tower1.png',false);
            }
            
        }    
    } 
        
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




var map = {
    x:64,
    y:64,
    //img: 'assets/images/bg1',
    initArr: function(){
        arr = {};
        map.arr = new Array(game.canvas.width/map.x);
        for (let i = 0; i<game.canvas.width/map.x; i++){
            map.arr[i] = new Array(game.canvas.height/map.y);
            for(let j=0; j<game.canvas.height/map.y;j++){
                map.arr[i][j]={
                    x: i*map.x,
                    y: j*map.y,
                    type: 0,
                    bg: 0,
                    img: loader.loadImage('assets/images/bg2.png'),
                }
            }    
        } 
        
    }
    
};


var playerControll = {
    //mouse x, y
    userX:0,
    userY:0,
    //count of towers
    twrCount:0,
    bltCount:0,
   //ADD eventListener on mouse and keyboard
    init: function(){
        game.canvas.onmousemove = function(e){
            var k = [];
	        for (var i in e.target) k.push(i);
           
            playerControll.userX = e.pageX - e.target.offsetLeft;
            playerControll.userY = e.pageY - e.target.offsetTop;
           // console.log(playerControll.userX);

        }
        //FIX ME
        window.addEventListener("keypress",playerControll.weventHandler,false);
        window.addEventListener("keypress",playerControll.aeventHandler,false);
        window.addEventListener("keypress",playerControll.seventHandler,false);
        window.addEventListener("keypress",playerControll.deventHandler,false);
        window.addEventListener("keypress",playerControll.reventHandler,false);
        game.canvas.addEventListener("mousedown",playerControll.mouseDownHandler,false);
    },
   
    //FIX ME
    //EVENT LISTENER FOR KEYBOARD
    weventHandler: function(e){
        var keyCode = e.keyCode;
        if((keyCode == 87 || keyCode == 119) && map.arr[Math.floor((player.x)/map.x)][Math.floor((player.y-5)/map.y)].type==0){
            console.log("W");
            player.y-=5;
        }
    },
    aeventHandler: function(e){
        var keyCode = e.keyCode;
        if((keyCode == 65 || keyCode == 97) && map.arr[Math.floor((player.x-5)/map.x)][Math.floor(player.y/map.y)].type==0){
            console.log("a");
            
            
            player.x-=5;
        }
    },
    seventHandler: function(e){
        var keyCode = e.keyCode;
        if((keyCode == 83 || keyCode == 115) && map.arr[Math.floor(player.x/map.x)][Math.floor((player.y+5)/map.y)].type==0){
            console.log("s");
            player.y+=5;
        }
    },
    deventHandler: function(e){
        var keyCode = e.keyCode;
        if((keyCode == 68 || keyCode == 100) && map.arr[Math.floor((player.x+5)/map.x)][Math.floor(player.y/map.y)].type==0){
            console.log("d");
            player.x+=5;
        }
    },
    //CREATE TOWER
    reventHandler: function(e){
        var keyCode = e.keyCode;
        if(keyCode == 82 || keyCode == 114){
            console.log("r");
            //FIXME
            
            if(Math.sqrt((playerControll.userX-player.x)*(playerControll.userX-player.x)+
            (playerControll.userY-player.y)*(playerControll.userY-player.y))<300
            && map.arr[Math.floor(playerControll.userX/map.x)][Math.floor(playerControll.userY/map.y)].type==0 && 
            map.arr[Math.floor((player.x)/map.x)][Math.floor(player.y/map.y)]!=map.arr[Math.floor(playerControll.userX/map.x)][Math.floor(playerControll.userY/map.y)]){
            playerControll.twrCount++;
            towers[playerControll.twrCount] = new 
            Tower(Math.floor(playerControll.userX/map.x)*map.x,Math.floor(playerControll.userY/map.y)*map.y,'assets/images/tower1.png',false);
            map.arr[Math.floor(playerControll.userX/map.x)][Math.floor(playerControll.userY/map.y)].type=1;
        }
        }
    },
    mouseDownHandler: function(e){
        
        bullets[playerControll.bltCount]= new Bullet(player.x,player.y,'assets/images/bullet.png',10,
        Math.atan2(playerControll.userY - player.y, playerControll.userX - player.x), playerControll.bltCount);
        playerControll.bltCount++;

    },
    
    

};


//list of towers
towers = [];
enemys = [];
bullets = [];
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
    x: 64,
    y: 64,
    health:100,
    money:0,
    bulletCount:10,

    init: function(){
        player.img = loader.loadImage('assets/images/tower2.png');
        
    },
    
   


};


class Tower{
    constructor(x,y,img,isShooting){
        this.x = x;
        this.y = y;
        this.img = loader.loadImage(img);
        this.isShooting = isShooting;

    }
}


class Enemy{
    constructor(x,y,img,health){
        this.x = x;
        this.y = y;
        this.img = loader.loadImage(img);
        this.health = health;
    }
}
class Bullet{
    constructor(x,y,img,speed,angle,id){
        this.x = x;
        this.y = y;
        this.img = loader.loadImage(img);
        this.speed = speed;
        this.angle = angle;
        this.id = id;
    }
}

enm = new Enemy(600,500,'assets/images/tower3.png',100);
enemys[0] = enm;
