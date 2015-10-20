/* global game */

var RemotePlayer = function (index, game, player, startX, startY) {
  var x = startX
  var y = startY

  this.game = game
  this.health = 3
  this.player = player
  this.alive = true
  this.player.speed = 3;
  this.player = game.add.sprite(x, y, 'enemy');

  this.player.name = index.toString()
  this.player.currAttack = 0;
  this.player.attackFrame = 0;
  this.player.hitcount = 0;
  this.player.queuedAttack = 0;
  this.player.attacks = new Array(10);
  this.player.health = 1000;
  this.player.maxHealth = 1000;
  this.player.previousPosition = { x: x, y: y }; 
  
  this.player.anchor.setTo(0.5, 0.5)

  this.lastPosition = { x: x, y: y }
  this.player.rotation = 0;

  this.player.sword = game.add.sprite(x + 35, y, 'sword');
  this.player.sword.rotation = -45;
  this.player.sword.scale.setTo(.33,.33);
  this.player.sword.anchor.setTo(0.5, 0.9);
  this.player.sword.previousPosition = {x: x, y: y + 35};  
  this.player.sword.weight = 10;
  

  this.player.healthbar = game.add.sprite(x - 35, y - 50,'healthbar');
  this.player.healthbar.cropEnabled = true;
  this.player.healthbar.scale.setTo(.75,.75);

  player.attacks[0] = createAttack(0, 0, [0,0],0,0);

  player.attacks[1] = generateAttack(1, 30, [[-20,0,10,0],[40,0,20,0]],[[0,30,0]],[[25,30]]);
  player.attacks[2] = generateAttack(2, 60, [[-20,-10,20,1],[60,-20,40,2]],[[-1.5,20, 1],[3,40,1]],[[0,20],[90,40]]);
  player.attacks[3] = generateAttack(3, 45, [[0,-10,30,0],[0,75,15,2]],[[0,45,0]],[[0,30],[25,10],[70,5]]);
}

var Attack;

function createAttack(num, frames, movements, rotations, hitboxes) {
    Attack = {};
    Attack.attackNumber = num;
    Attack.frames = frames;       //number of frames long the attack is
    Attack.movements = movements; //2d array of length [frames] where each element is the x and y movements per frame
    Attack.rotations = rotations; //array of length [frames] where each element is the number of radians it rotates that frame 
    Attack.hitboxes = hitboxes;   //array of length [frames] where each element is the damage dealt on that frame 
    return Attack;
}

RemotePlayer.prototype.update = function () {
  // this.lastPosition.x = this.player.x
  // this.lastPosition.y = this.player.y
}

window.RemotePlayer = RemotePlayer
