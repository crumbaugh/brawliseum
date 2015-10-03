var myId = 0;

var ready = false;
var player;
var userList = {};

var eurecaServer;

//this function will handle client communication with the server
var eurecaClientSetup = function() {
    //create an instance of eureca.io client
    var eurecaClient = new Eureca.Client();
    
    eurecaClient.ready(function (proxy) {       
        eurecaServer = proxy;
    }); 

        
        //we temporary put create function here so we make sure to launch the game once the client is ready
    eurecaClient.exports.setId = function(id) 
    {
        //create() is moved here to make sure nothing is created before uniq id assignation
        myId = id;
        create();
        eurecaServer.handshake();
        ready = true;
    }   

    eurecaClient.exports.kill = function(id)
    {   
        if (userList[id]) {
            userList[id].kill();
        }
    }   

    eurecaClient.exports.spawnEnemy = function(i, x, y)
    {
        
        if (i == myId) return; //this is me
        
        var enemy = new User(i, game, player);
        userList[i] = enemy;
    }

    eurecaClient.exports.updateState = function(id, state)
    {
        if (userList[id])  {
            userList[id].player.x = state.x;
            userList[id].player.y = state.y;
            // TODO: add more stuff
            userList[id].update();
        }
    }
}

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: eurecaClientSetup, update: update });

var returnTime = 8;
var blockTime = 8;
function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png'); 
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

function update() {
    for (var i in userList)
    {
        if (!userList[i]) continue;
        for (var j in userList)
        {
            if (!userList[j]) continue;
            if (j!=i) 
            {
                userList[j].update();           
            }       
        }
    }
}

var platforms;
var score = 0;
var scoreText;

function create() {            
    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    userList = {};
    user = new User(myId, game, player);
    userList[myId] = user;
    player = user.player;
}