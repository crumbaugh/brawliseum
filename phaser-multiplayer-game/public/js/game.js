/* global Phaser RemotePlayer io */

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render })

function preload () {
  game.load.image('earth', 'assets/light_sand.png')
  game.load.image('dude', 'assets/dude.png')
  game.load.image('enemy', 'assets/dude.png')
  game.load.image('sword', 'assets/sword.png')
}

var socket // Socket connection

var land

var player

var enemies

var currentSpeed = 0
var upkey, downkey, leftkey, rightkey;

function create () {
  socket = io.connect()

  // Resize our game world to be a 2000 x 2000 square
  game.world.setBounds(-500, -500, 1000, 1000)

  // Our tiled scrolling background
  land = game.add.tileSprite(0, 0, 800, 600, 'earth')
  land.fixedToCamera = true

  // The base of our player
  var startX = Math.round(Math.random() * (1000) - 500)
  var startY = Math.round(Math.random() * (1000) - 500)
  player = game.add.sprite(startX, startY, 'dude')
  player.anchor.setTo(0.5, 0.5)



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
  socket.emit('new player', { x: player.x, y: player.y, r: player.rotation })
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
  movePlayer.player.sword.position.x = data.sx
  movePlayer.player.sword.position.y = data.sy

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

  // Remove player from array
  enemies.splice(enemies.indexOf(removePlayer), 1)
}

function update () {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].alive) {
      enemies[i].update()
      game.physics.collide(player, enemies[i].player)
    }
  }
    if (leftkey.isDown){
      player.x -= player.speed;
      player.sword.position.x -= player.speed;
    }
    if (rightkey.isDown){
      player.x += player.speed;
      player.sword.position.x += player.speed;
    }
    if (upkey.isDown){
      player.y -= player.speed;
      player.sword.position.y -= player.speed;
    }
    if (downkey.isDown){
      player.y += player.speed;
      player.sword.position.y += player.speed;
    }

  land.tilePosition.x = -game.camera.x
  land.tilePosition.y = -game.camera.y

  player.rotation = game.physics.angleToPointer(player);

  socket.emit('move player', { x: player.x, y: player.y, r: player.rotation, sx: player.sword.position.x, sy: player.sword.position.y })
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
