/* global Phaser RemotePlayer io */

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render })

function preload () {
  game.load.image('earth', 'assets/light_sand.png')
  game.load.image('dude', 'assets/dude.png')
  game.load.image('enemy', 'assets/dude.png')
  game.load.image('sword', 'assets/sword.png')

  game.load.audio('theme', '../theme.mp3');
  game.load.audio('swing', '../swordswing.mp3');
}

var socket; // Socket connection

var land;

var music; // audio
var swing_effect;

var returnTime = 8;
var blockTime = 8;

var player;

var enemies;

var currentSpeed = 0;
var upkey, downkey, leftkey, rightkey, spacekey;

var maxDistance = 50;
var minDistance = 35;

var preferredAttack = 1;

function create () {
  socket = io.connect()

  music = game.add.audio('theme');
  swing_effect = game.add.audio('swing');

  music.play();

  // Resize our game world to be a 2000 x 2000 square
  game.world.setBounds(-500, -500, 1000, 1000)

  // Our tiled scrolling background
  land = game.add.tileSprite(0, 0, 800, 600, 'earth')
  land.fixedToCamera = true

  //Scoreboard stuff
  scoreBoard = game.add.text(0, 0, 'Top Players:');
  leaderboard = [['',0], ['',0], ['',0]];
  
  // The base of our player
  var startX = Math.round(Math.random() * (1000) - 500)
  var startY = Math.round(Math.random() * (1000) - 500)
  player = game.add.sprite(startX, startY, 'dude')
  player.anchor.setTo(0.5, 0.5)
  player.currAttack = 0;
  player.attackFrame = 0;
  player.speed = 3;
  player.sword = game.add.sprite(startX + minDistance, startY, 'sword')
  player.sword.scale.setTo(.33,.33);
  player.sword.anchor.setTo(0.5, 0.9);
  player.hit = 0;
  player.queuedAttack = 0;
  player.attacks = new Array(10);
  player.attacks[0] = createAttack(0, 0, [0,0],0,0);

  player.attacks[1] = createAttack(1, 17, 
  [[-2,.5],[-3,.5],[-2,.5],[-1,.5],[-.5,0],[-.5,0],[-.5,0], //windup
   [0,0],[1,-.5],[2,-.5],[2,-.5],[3,0],[3,0],[3,0],[3,0],[3,0],[3,0],[3,0],[2,.5],[2,.5],[1,.5],[1,.5],[.5,.5],[0,.5]], //swing 
  [-.05,-.1,-.15,-.2,-.15,-.15,.1,0,.05,.75,.1,.125,.15,.175,.2,.175,.15,.1],//rotations
  [0,0,0,0,0,0,0,15,25,40,100,100,40,25,20,15,10]); //hitboxes

  player.attacks[2] = generateAttack(2, 68, [[-20,2,20,1],[60,10,28,2],[5,20,20,0]],[[-1.5,20, 1],[3,28,1],[.2,20,0]],[[0,20],[90,28],[0,20]]);
  player.attacks[3] = generateAttack(3, blockTime, [[-20,-20,blockTime-3,0],[0,0,3,0]],[[3.14/2,blockTime - 2,1],[0,2,0]],[[0,blockTime - 2],[0,2]]);

  // This will force it to decelerate and limit its speed
  // player.body.drag.setTo(200, 200)
  player.body.maxVelocity.setTo(400, 400)
  player.body.collideWorldBounds = true

  // Create some baddies to waste :)
  enemies = []

  player.bringToTop()

  game.camera.follow(player)
  game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300)
  game.camera.focusOnXY(0, 0)

  upkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
  downkey = game.input.keyboard.addKey(Phaser.Keyboard.S);
  leftkey = game.input.keyboard.addKey(Phaser.Keyboard.A);
  rightkey = game.input.keyboard.addKey(Phaser.Keyboard.D);
  onekey = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
  twokey = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
  threekey = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
  spacekey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  // var barConfig = {x: 200, y: 100};
  // var myHealthBar = new HealthBar(game, barConfig);

  // Start listening for events
  setEventHandlers()
}

var setEventHandlers = function () {
  // Socket connection successful
  socket.on('connect', onSocketConnected)

  // Socket disconnection
  socket.on('disconnect', onSocketDisconnect)

  // New player message received
  socket.on('new player', onNewPlayer)

  // Player move message received
  socket.on('move player', onMovePlayer)

  // Player removed message received
  socket.on('remove player', onRemovePlayer)
}

// Socket connected
function onSocketConnected () {
  console.log('Connected to socket server')

  // Send local player data to the game server
  socket.emit('new player', { x: player.x, y: player.y, r: player.rotation, sx: player.sword.x, sy: player.sword.y, sr: player.sword.rotation })
}

// Socket disconnected
function onSocketDisconnect () {
  console.log('Disconnected from socket server')
}

// New player
function onNewPlayer (data) {
  console.log('New player connected:', data.id)

  // Add new player to the remote players array
  enemies.push(new RemotePlayer(data.id, game, player, data.x, data.y))
}

// Move player
function onMovePlayer (data) {
  var movePlayer = playerById(data.id)

  // Player not found
  if (!movePlayer) {
    console.log('Player not found: ', data.id)
    return
  }

  // Update player position
  movePlayer.player.x = data.x
  movePlayer.player.y = data.y
  movePlayer.player.rotation = data.r
  movePlayer.player.sword.x = data.sx
  movePlayer.player.sword.y = data.sy
  movePlayer.player.sword.rotation = data.sr

}

function generateAttack(num, totalFrames, movements, rotations, hitboxes){
    var currFrame = 0;
    var i, j;
    var tempMovements = new Array();
    var tempRotations = new Array();
    var tempHitboxes  = new Array();
    for (i = 0; i < movements.length; i++) {
        var frames = movements[i][2];
        for (j = 1; j <= frames; j++) {
            tempMovements[currFrame] = new Array(2);
            if (movements[i][3] == 1) { //accelerated
                var factor = j < frames - j + 1 ? j : frames - j + 1;
                tempMovements[currFrame][0] = (factor)*(movements[i][0] / (2*triangleNumber(frames/2)));
                tempMovements[currFrame][1] = (factor)*(movements[i][1] / (2*triangleNumber(frames/2)));
            } else if (movements[i][3] == 0) { //standard 
                tempMovements[currFrame][0] = movements[i][0] / frames;
                tempMovements[currFrame][1] = movements[i][1] / frames;
            } else if (movements[i][3] == 2) { //decelerated 
                tempMovements[currFrame][0] = (frames - j + 1)*(movements[i][0] / (triangleNumber(frames)));
                tempMovements[currFrame][1] = (frames - j + 1)*(movements[i][1] / (triangleNumber(frames)));
            }
            currFrame++;
        }
    }
    currFrame = 0;
    for (i = 0; i < rotations.length; i++) {
        var frames = rotations[i][1];
        for (j = 0; j < frames; j++) {
            if (rotations[i][2]) { //accelerated
                 var factor = j < frames - j + 1 ? j : frames - j + 1;
                 tempRotations[currFrame] = (factor)*(rotations[i][0] / (2*triangleNumber(frames/2)));
            } else {
                tempRotations[currFrame] = rotations[i][0] / frames;
            }    
            currFrame++;
        }
    }
    currFrame = 0;
    for (i = 0; i < hitboxes.length; i++) {
        var frames = hitboxes[i][1];
        for (j = 0; j < frames; j++) {
            tempHitboxes[currFrame] = hitboxes[i][0];
            currFrame++;
        }
    }
    
    return createAttack(num, totalFrames, tempMovements, tempRotations, tempHitboxes);
}

function triangleNumber(n)
{
    return (n*n+n)/2;
}

// Attack function
function attack(thisPlayer) {
    //return sword
    if (thisPlayer.currAttack == -1) {
        if (thisPlayer.attackFrame == 0) {
            //thisPlayer.sword.rotation %= 6.283;
            //startingRotationDifference  = thisPlayer.sword.rotation   - thisPlayer.rotation;
            startingPositionDifferenceX = (thisPlayer.x + Math.sin(thisPlayer.rotation - 30)*minDistance) - thisPlayer.sword.x;
            startingPositionDifferenceY = (thisPlayer.y - Math.cos(thisPlayer.rotation - 30)*minDistance) - thisPlayer.sword.y;
        }    
        if (thisPlayer.attackFrame == returnTime) {
            thisPlayer.currAttack = thisPlayer.queuedAttack;
            thisPlayer.attackString = thisPlayer.queuedString;
            thisPlayer.attackFrame = 0;
            for (var i = 0; i < enemies.length; i++) {
              if (enemies[i].alive) {
                enemies[i].hit = 0;
              }
            }
            return;
        } else { //actually move the sword
            //thisPlayer.sword.rotation   -= startingRotationDifference /returnTime;
            thisPlayer.sword.x += startingPositionDifferenceX/returnTime;
            thisPlayer.sword.y += startingPositionDifferenceY/returnTime;
        }
    } else {
        if (thisPlayer.attackFrame == 0) {
          swing_effect.play();
        }
        if (thisPlayer.attackFrame >= thisPlayer.attacks[thisPlayer.currAttack].frames) { //end of attack
            thisPlayer.queuedAttack = 0;
            thisPlayer.attackString = "";
            thisPlayer.queuedString = "";
            thisPlayer.attackFrame = 0;
            thisPlayer.currAttack = -1;
            return;
        }
        var movementFrameData = thisPlayer.attacks[thisPlayer.currAttack].movements[thisPlayer.attackFrame];
        thisPlayer.sword.x += Math.cos(thisPlayer.rotation - 30)*movementFrameData[0] + Math.sin(thisPlayer.rotation)*movementFrameData[1];
        thisPlayer.sword.y += Math.sin(thisPlayer.rotation - 30)*movementFrameData[0] + Math.cos(thisPlayer.rotation)*movementFrameData[1];
        // thisPlayer.sword.rotation   += thisPlayer.attacks[ thisPlayer.currAttack].rotations[thisPlayer.attackFrame];

        var distance = Math.sqrt(Math.pow(thisPlayer.sword.x - thisPlayer.x, 2) 
                               + Math.pow(thisPlayer.sword.y - thisPlayer.y, 2));
        if (distance > maxDistance) { //if the sword is too far away from its owner, move it to the max distance
            thisPlayer.sword.x = thisPlayer.x + ((thisPlayer.sword.x - thisPlayer.x) / distance * maxDistance);   
            thisPlayer.sword.y = thisPlayer.y + ((thisPlayer.sword.y - thisPlayer.y) / distance * maxDistance); 
        }
    }
    thisPlayer.attackFrame++;
}

// Remove player
function onRemovePlayer (data) {
  var removePlayer = playerById(data.id)

  // Player not found
  if (!removePlayer) {
    console.log('Player not found: ', data.id)
    return
  }

  removePlayer.player.kill()
  removePlayer.player.sword.kill()

  // Remove player from array
  enemies.splice(enemies.indexOf(removePlayer), 1)
}

function update () {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].alive) {
      enemies[i].update()
    }
  }
    if (leftkey.isDown){
      player.x -= player.speed;
      player.sword.x -= player.speed;
    }
    if (rightkey.isDown){
      player.x += player.speed;
      player.sword.x += player.speed;
    }
    if (upkey.isDown){
      player.y -= player.speed;
      player.sword.y -= player.speed;
    }
    if (downkey.isDown){
      player.y += player.speed;
      player.sword.y += player.speed;
    }
    if (onekey.isDown){
      preferredAttack = 1;
    }
    if (twokey.isDown){
      preferredAttack = 2;
    }
    if (threekey.isDown){
      preferredAttack = 3;
    }
    if (spacekey.isDown && player.currAttack != -1){ 
      if (player.currAttack == 0) {
          player.currAttack = preferredAttack;
      }
    }
    if (player.currAttack != 0) {
      attack(player);
    }

  land.tilePosition.x = -game.camera.x
  land.tilePosition.y = -game.camera.y
  
  scoreBoard.x = game.camera.x + 10;
  scoreBoard.y = game.camera.y + 10;
  scoreBoard.setText('Top Players:\n1. ' + leaderboard[0][0] + '\n2.' + leaderboard[1][0] + '\n3.' + leaderboard[2][0]);

  oldPlayerRotation = player.rotation;

  player.rotation = game.physics.angleToPointer(player);

  player.sword.y -= (Math.sin(oldPlayerRotation) - Math.sin(player.rotation)) * minDistance; 
  player.sword.x -= (Math.cos(oldPlayerRotation) - Math.cos(player.rotation)) * minDistance;

  player.sword.rotation = -3.14/2 + game.math.angleBetween(player.sword.x, player.sword.y, player.x, player.y);

  socket.emit('move player', { x: player.x, y: player.y, r: player.rotation, sx: player.sword.x, sy: player.sword.y, sr: player.sword.rotation })
}

function render () {

}

// Find player by ID
function playerById (id) {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].player.name === id) {
      return enemies[i]
    }
  }

  return false
}
