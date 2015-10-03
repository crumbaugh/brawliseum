var STARTING_HEALTH = 1000;


function pair(x,y) { this.x = x; this.y = y}


User = function(myId, game, player) {
    // this.cursor?

    var x = 0;
    var y = 0;

    this.game = game;
    this.health = STARTING_HEALTH;
    this.user = player;

    this.player = game.add.sprite(150, game.world.height - 150, 'dude');
    this.player.id = myId;
    game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.anchor.setTo(.5,.5);
    this.player.body.collideWorldBounds = true;

    this.player.speed = 3;
    this.player.maxDistance = 20;
    this.player.minDistance = 10;

    upkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    downkey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    leftkey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightkey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    
    this.formerMouse = -1;
    
    this.alive = true;
    this.player.currAttack = 0;
    this.player.attackFrame = 0;
    this.player.hit = 0;
    this.player.queuedAttack = 0;
    this.player.attacks = new Array(10);
    this.player.health = 1000;
    this.player.healthText = game.add.text(50, 50, 'Player health: ' + this.player.health, { fill: '#ffffff' });
    
    // sword
    this.player.sword = game.add.sprite(150, game.world.height - 160, 'platform');
    this.player.sword.anchor.setTo(0.5, 0.5);
    this.player.sword.weight = 10;
    this.player.sword.previousPosition = new pair(this.player.sword.position.x, this.player.sword.position.y); 
    this.player.sword.scale.setTo(.4, 1.6);
}


User.prototype.update = function() {
	if (leftkey.isDown || rightkey.isDown
		|| upkey.isDown || downkey.isDown) {
		this.move(this.player, this.player.sword);
	}
};

User.prototype.move = function(player, sword) {
if (player.id == myId) {
	var speed = player.speed;
	var currAttack = player.currAttack;
	var attackFrame = player.attackFrame;

	var x = player.position.x;
	var y = player.position.y;
	var sx = sword.position.x;
	var sy = sword.position.y;

    // if (currAttack == 0) { //attack lock
        if (leftkey.isDown){
        	x -= speed;
        	sx -= speed;
        }
        if (rightkey.isDown){
        	x += speed;
        	sx += speed;
        }
        if (upkey.isDown){
        	y -= speed;
        	sy -= speed;
        }
        if (downkey.isDown){
        	y += speed;
        	sy += speed;
        }

    var inputkeys = {
		speed:player.speed,
		currAttack:player.currAttack,
		attackFrame:player.attackFrame,
		x:x,
		y:y,
		sx:sx,
		sy:sy
	}
    // } else if (player.currAttack == -1) { //regain speed during player.sword.return
    //     if (leftkey.isDown){
    //         player.position.x += -speed*(.2+(player.attackFrame/returnTime));
    //         sword.position.x += -speed*(.2+(player.attackFrame/returnTime));
    //     }
    //     if (rightkey.isDown){
    //         player.position.x += speed*(.2+(player.attackFrame/returnTime));
    //         sword.position.x += speed*(.2+(player.attackFrame/returnTime));
    //     }
    //     if (upkey.isDown){
    //         player.position.y += -speed*(.2+(player.attackFrame/returnTime));
    //         sword.position.y += -speed*(.2+(player.attackFrame/returnTime));
    //     }
    //     if (downkey.isDown){
    //         player.position.y += speed*(.2+(player.attackFrame/returnTime));
    //         sword.position.y += speed*(.2+(player.attackFrame/returnTime));
    //     }    
    // } else { 
    //     var oldPlayerRotation = player.rotation;    
    //     player.rotation += (-game.math.angleBetween(game.input.activePointer.x, game.input.activePointer.y, player.x, player.y)
    //                         -oldPlayerRotation)*.02; 
    //     // player.sword.rotation += player.rotation - oldPlayerRotation;
        
    //     if (leftkey.isDown){
    //         player.position.x += -speed*.2;
    //         sword.position.x += -speed*.2;
    //     }
    //     if (rightkey.isDown){
    //         player.position.x += speed*.2;
    //         sword.position.x += speed*.2;
    //     }
    //     if (upkey.isDown){
    //         player.position.y += -speed*.2;
    //         sword.position.y += -speed*.2;
    //     }
    //     if (downkey.isDown){
    //         player.position.y += speed*.2;
    //         sword.position.y += speed*.2;
    //     }
	eurecaServer.handleKeys(inputkeys);
	}
}

User.prototype.kill = function() {
	this.alive = false;
	this.player.kill();
}