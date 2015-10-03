var STARTING_HEALTH = 1000;


function pair(x,y) { this.x = x; this.y = y}


User = function(myId, game, player) {
    // this.cursor?

    var x = 0;
    var y = 0;

    this.game = game;
    this.health = STARTING_HEALTH;
    this.user = player;

    this.speed = 3;
    this.maxDistance = 20;
    this.minDistance = 10;

    this.player = game.add.sprite(150, game.world.height - 150, 'dude');
    this.player.id = myId;
    game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.anchor.setTo(.5,.5);
    this.player.body.collideWorldBounds = true;

    upkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    downkey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    leftkey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightkey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    
    this.formerMouse = -1;
    
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
	this.move(this.player, this.player.sword);
};

User.prototype.move = function(player, sword) {
	var speed = this.speed
if (player.currAttack == 0) { //attack lock
        oldPlayerRotation = player.rotation;    
        player.rotation = -game.math.angleBetween(game.input.activePointer.x, game.input.activePointer.y, player.x, player.y); 

        if (leftkey.isDown){
            player.position.x += -speed;
            sword.position.x += -speed;
        }
        if (rightkey.isDown){
            player.position.x += speed;
            sword.position.x += speed;
        }
        if (upkey.isDown){
            player.position.y += -speed;
            sword.position.y += -speed;
        }
        if (downkey.isDown){
            player.position.y += speed;
            sword.position.y += speed;
        }
    } else if (player.currAttack == -1) { //regain speed during player.sword.return
        
        var oldPlayerRotation = player.rotation;    
        player.rotation += (-game.math.angleBetween(game.input.activePointer.x, game.input.activePointer.y, player.x, player.y)
                            -oldPlayerRotation)*(.02 + (player.attackFrame/returnTime)); 
        // player.sword.rotation += player.rotation - oldPlayerRotation;
        
        if (leftkey.isDown){
            player.position.x += -speed*(.2+(player.attackFrame/returnTime));
            sword.position.x += -speed*(.2+(player.attackFrame/returnTime));
        }
        if (rightkey.isDown){
            player.position.x += speed*(.2+(player.attackFrame/returnTime));
            sword.position.x += speed*(.2+(player.attackFrame/returnTime));
        }
        if (upkey.isDown){
            player.position.y += -speed*(.2+(player.attackFrame/returnTime));
            sword.position.y += -speed*(.2+(player.attackFrame/returnTime));
        }
        if (downkey.isDown){
            player.position.y += speed*(.2+(player.attackFrame/returnTime));
            sword.position.y += speed*(.2+(player.attackFrame/returnTime));
        }    
    } else { 
        var oldPlayerRotation = player.rotation;    
        player.rotation += (-game.math.angleBetween(game.input.activePointer.x, game.input.activePointer.y, player.x, player.y)
                            -oldPlayerRotation)*.02; 
        // player.sword.rotation += player.rotation - oldPlayerRotation;
        
        if (leftkey.isDown){
            player.position.x += -speed*.2;
            sword.position.x += -speed*.2;
        }
        if (rightkey.isDown){
            player.position.x += speed*.2;
            sword.position.x += speed*.2;
        }
        if (upkey.isDown){
            player.position.y += -speed*.2;
            sword.position.y += -speed*.2;
        }
        if (downkey.isDown){
            player.position.y += speed*.2;
            sword.position.y += speed*.2;
        }
    }
	// send latest valid state to the server
	eurecaServer.handleKeys(player.position);
}