/* global game */

var RemotePlayer = function (index, game, player, startX, startY) {
  var x = startX
  var y = startY

  this.game = game
  this.health = 3
  this.player = player
  this.alive = true
  this.player.speed = 3;
  this.player = game.add.sprite(x, y, 'dude');


  this.player.currAttack = 0;
  this.player.attackFrame = 0;
  this.player.hit = 0;
  this.player.queuedAttack = 0;
  this.player.attacks = new Array(10);
  this.player.health = 1000;
  this.player.previousPosition = new pair(this.player.x, this.player.y); 
  this.player.healthText = game.add.text(50, 50, 'Player health: ' + this.player.health, { fill: '#ffffff' });
  
  this.player.anchor.setTo(0.5, 0.5)

  this.lastPosition = { x: x, y: y }
}

RemotePlayer.prototype.update = function () {
console.log(player.x);
  this.lastPosition.x = this.player.x
  this.lastPosition.y = this.player.y
}

window.RemotePlayer = RemotePlayer
