var playState = {preload: playPreload, create: playCreate, update: playUpdate};
var returnTime = 8;
var blockTime = 8;
function playPreload () {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png'); 
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.image('boring-arena', 'assets/boring-arena.jpg');
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

function pair(x,y) { this.x = x; this.y = y}

function playCreate () {
    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    // the ground

    ground = game.add.sprite(game.world.width/2, game.world.height/2, 'boring-arena');
    ground.anchor.setTo(.5, .5);
    ground.width = .5 * game.world.width;
    ground.height = .5 * game.world.height;

    // The player and its settings
    
    player = game.add.sprite(game.world.width/3, game.world.height/2, 'dude');
    player.anchor.setTo(.5,.5);
    player.sword = game.add.sprite(player.x, player.y, 'platform');
    player.sword.scale.setTo(.4,1.6);
    player.sword.anchor.setTo(0.5, 0.9);
    player.sword.previousPosition = new pair(player.sword.position.x, player.sword.position.y);  
    player.sword.weight = 10;

    enemy = game.add.sprite(game.world.width*2/3, game.world.height/2, 'star');
    enemy.anchor.setTo(.5,.5);
    enemy.sword = game.add.sprite(enemy.x, enemy.y, 'platform');
    enemy.sword.scale.setTo(.4,1.6);
    enemy.sword.anchor.setTo(0.5, 0.9);   
    enemy.sword.previousPosition = new pair(enemy.sword.position.x, enemy.sword.position.y);  
    enemy.sword.weight = 10;

    //set some various constants 
    speed = 3;
    maxDistance = 20;
    minDistance = 10;

    upkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    downkey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    leftkey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightkey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    
    this.formerMouse = -1;
    
    player.currAttack = 0;
    player.attackFrame = 0;
    player.hit = 0;
    player.queuedAttack = 0;
    player.attacks = new Array(10);
    player.health = 1000;
    player.healthText = game.add.text(50, 50, 'Player health: ' + player.health, { fill: '#ffffff' });
    player.falling = false;
    player.fallingrate = 0;
    
    enemy.currAttack = 0;
    enemy.attackFrame = 0;
    enemy.hit = 0;
    enemy.queuedAttack = 0;
    enemy.attacks = new Array(10); 
    enemy.health  = 1000;
    enemy.healthText = game.add.text(game.world.width - 300, 50, 'Enemy health: ' + enemy.health, { fill: '#ffffff' });
    enemy.falling = false;
    enemy.fallingrate = 0;

    jab1  = 2;
    jab2  = 1;
    jab3  = 2;
    block = 3;

    player.attacks[0] = createAttack(0, 0, [0,0],0,0);

    player.attacks[1] = createAttack(1, 17, 
    [[-2,.5],[-3,.5],[-2,.5],[-1,.5],[-.5,0],[-.5,0],[-.5,0], //windup
     [0,0],[1,-.5],[2,-.5],[2,-.5],[3,0],[3,0],[3,0],[3,0],[3,0],[3,0],[3,0],[2,.5],[2,.5],[1,.5],[1,.5],[.5,.5],[0,.5]], //swing 
    [-.05,-.1,-.15,-.2,-.15,-.15,.1,0,.05,.75,.1,.125,.15,.175,.2,.175,.15,.1],//rotations
    [0,0,0,0,0,0,0,15,25,40,100,100,40,25,20,15,10]); //hitboxes

    player.attacks[2] = generateAttack(2, 68, [[-20,2,20,1],[60,10,28,2],[5,20,20,0]],[[-1.5,20, 1],[3,28,1],[.2,20,0]],[[0,20],[90,28],[0,20]]);
    player.attacks[3] = generateAttack(3, blockTime, [[-20,-20,blockTime-3,0],[0,0,3,0]],[[3.14/2,blockTime - 2,1],[0,2,0]],[[0,blockTime - 2],[0,2]]);
}

function playUpdate () {
    move();
    if (game.input.mouse.button == 0 && this.formerMouse == -1 && player.currAttack != -1){ 
        if (player.currAttack == 0) {
            player.currAttack = jab1;
            player.attackString = "jab1";
        } else if (player.attackString == "jab1" && player.attacks[player.currAttack].hitboxes[player.attackFrame] != 0) {
            player.attackFrame = 0;
            player.currAttack = -1;
            player.queuedAttack = jab2;
            player.queuedString = "jab2";
        } else if (player.attackString == "jab2" && player.attacks[player.currAttack].hitboxes[player.attackFrame] != 0) {
            player.attackFrame = 0;
            player.currAttack = -1;
            player.queuedAttack = jab3;
            player.queuedString = "jab3";
        }
    } else if (game.input.mouse.button == 2 &&  player.currAttack != -1) {
        if ( player.currAttack == 0 && this.formerMouse == -1) {
             player.currAttack = block;
        } else if (this.formerMouse == -1 && player.attacks[player.currAttack].hitboxes[player.attackFrame] == 0) {
            player.attackFrame = 0;
            player.currAttack = -1;
            player.queuedAttack = block;
            player.queuedString = "block";
        } else if (player.currAttack == block && player.attackFrame == blockTime - 1) {
            player.attackFrame--;
        }
    }
    
    if (player.currAttack != 0)
        attack(player);
    if (enemy.currAttack  != 0)
        attack(enemy);

    checkCollisions();
    checkFalling();
    if (player.falling) {
        fall(player);
    }
    if (enemy.falling) {
        fall(enemy);
    }

    player.healthText.text = 'Player health: ' + player.health;
    enemy.healthText.text = 'Enemy health: ' + enemy.health;
    
    this.formerMouse = game.input.mouse.button;
    player.sword.previousPosition.x = player.sword.position.x;
    player.sword.previousPosition.y = player.sword.position.y;
    enemy.sword.previousPosition.x  = enemy.sword.position.x; 
    enemy.sword.previousPosition.y  = enemy.sword.position.y; 
}

function move() {
    if (player.currAttack == 0) { //attack lock
        oldPlayerRotation = player.rotation;    
        player.rotation = -game.math.angleBetween(game.input.activePointer.x, game.input.activePointer.y, player.x, player.y); 
        //player.sword.rotation   += player.rotation - oldPlayerRotation;

        if (leftkey.isDown){
            player.position.x += -speed;
            player.sword.position.x += -speed;
        }
        if (rightkey.isDown){
            player.position.x += speed;
            player.sword.position.x += speed;
        }
        if (upkey.isDown){
            player.position.y += -speed;
            player.sword.position.y += -speed;
        }
        if (downkey.isDown){
            player.position.y += speed;
            player.sword.position.y += speed;
        }
    } else if (player.currAttack == -1) { //regain speed during player.sword.return
        
        var oldPlayerRotation = player.rotation;    
        player.rotation += (-game.math.angleBetween(game.input.activePointer.x, game.input.activePointer.y, player.x, player.y)
                            -oldPlayerRotation)*(.02 + (player.attackFrame/returnTime)); 
        player.sword.rotation += player.rotation - oldPlayerRotation;
        
        if (leftkey.isDown){
            player.position.x += -speed*(.2+(player.attackFrame/returnTime));
            player.sword.position.x += -speed*(.2+(player.attackFrame/returnTime));
        }
        if (rightkey.isDown){
            player.position.x += speed*(.2+(player.attackFrame/returnTime));
            player.sword.position.x += speed*(.2+(player.attackFrame/returnTime));
        }
        if (upkey.isDown){
            player.position.y += -speed*(.2+(player.attackFrame/returnTime));
            player.sword.position.y += -speed*(.2+(player.attackFrame/returnTime));
        }
        if (downkey.isDown){
            player.position.y += speed*(.2+(player.attackFrame/returnTime));
            player.sword.position.y += speed*(.2+(player.attackFrame/returnTime));
        }    
    } else { 
        var oldPlayerRotation = player.rotation;    
        player.rotation += (-game.math.angleBetween(game.input.activePointer.x, game.input.activePointer.y, player.x, player.y)
                            -oldPlayerRotation)*.02; 
        player.sword.rotation += player.rotation - oldPlayerRotation;
        
        if (leftkey.isDown){
            player.position.x += -speed*.2;
            player.sword.position.x += -speed*.2;
        }
        if (rightkey.isDown){
            player.position.x += speed*.2;
            player.sword.position.x += speed*.2;
        }
        if (upkey.isDown){
            player.position.y += -speed*.2;
            player.sword.position.y += -speed*.2;
        }
        if (downkey.isDown){
            player.position.y += speed*.2;
            player.sword.position.y += speed*.2;
        }
    }
    //point sword forward
    player.sword.position.x -= (Math.sin(oldPlayerRotation) - Math.sin(player.rotation)) * minDistance; 
    player.sword.position.y += (Math.cos(oldPlayerRotation) - Math.cos(player.rotation)) * minDistance;  
    player.sword.rotation = -game.math.angleBetween(player.sword.x, player.sword.y, player.x, player.y);  
    enemy.sword.rotation = -game.math.angleBetween(enemy.sword.x, enemy.sword.y, enemy.x, enemy.y);  
}

function checkCollisions(){
    if ((player.currAttack > 0 || enemy.currAttack > 0) //if someone is attacking 
         && player.currAttack != 6 && enemy.currAttack != 6 && player.currAttack != -1 && enemy.currAttack != -1 //and neither is already in knockback
         && checkOverlap(player.sword, enemy.sword)) { //and the swords are touching
            collide(player.sword, enemy.sword);    
    }
    if (player.currAttack > 0 && checkOverlap(player.sword, enemy) && player.attacks[player.currAttack].hitboxes[player.attackFrame] != 0 && !enemy.hit) {
        enemy.hit = 1;
        var damage = game.add.text(enemy.position.x + 30*(Math.random()-.5), enemy.position.y + 30*(Math.random()-.5),
                                   player.attacks[player.currAttack].hitboxes[player.attackFrame]);
        game.add.tween(damage).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
        enemy.health -= player.attacks[player.currAttack].hitboxes[player.attackFrame];
        enemy.healthText.text = 'Enemy health: ' + enemy.health;
    } 
}
function collide(sword1, sword2) {
    var velocity1 = {}; //new sword1 velocity
    var velocity2 = {}; //new sword2 velocity
    velocity1.x = (sword1.position.x - sword1.previousPosition.x) + (sword2.position.x - sword2.previousPosition.x);
    velocity1.y = (sword1.position.y - sword1.previousPosition.y) + (sword2.position.y - sword2.previousPosition.y);
    velocity2.x = (sword2.position.x - sword2.previousPosition.x) + (sword1.position.x - sword1.previousPosition.x);
    velocity2.y = (sword2.position.y - sword2.previousPosition.y) + (sword1.position.y - sword1.previousPosition.y);

    var frames = Math.sqrt(velocity2.x * velocity2.x + velocity2.y * velocity2.y) * sword2.weight; //magnitude of velocity vector * weight
    frames = Math.floor(frames);
    enemy.attacks[6] = generateAttack(6, frames, [[velocity2.x * 50, velocity2.y * 50, frames, 2]], [[0,frames,0]], [[0,frames]]);  

    enemy.currAttack  = 6;
    enemy.attackFrame = 0;
}

function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA, boundsB);
}

function attack(thisPlayer) {
    //return sword
    if (thisPlayer.currAttack == -1) {
        if (thisPlayer.attackFrame == 0) {
            //thisPlayer.sword.rotation %= 6.283;
            //startingRotationDifference  = thisPlayer.sword.rotation   - thisPlayer.rotation;
            startingPositionDifferenceX = (thisPlayer.position.x + Math.sin(thisPlayer.rotation)*minDistance) - thisPlayer.sword.position.x;
            startingPositionDifferenceY = (thisPlayer.position.y - Math.cos(thisPlayer.rotation)*minDistance) - thisPlayer.sword.position.y;
        }    
        if (thisPlayer.attackFrame == returnTime) {
            thisPlayer.currAttack = thisPlayer.queuedAttack;
            thisPlayer.attackString = thisPlayer.queuedString;
            thisPlayer.attackFrame = 0;
            enemy.hit = 0;
            return;
        } else { //actually move the sword
            //thisPlayer.sword.rotation   -= startingRotationDifference /returnTime;
            thisPlayer.sword.position.x += startingPositionDifferenceX/returnTime;
            thisPlayer.sword.position.y += startingPositionDifferenceY/returnTime;
        }
    } else {
        if (thisPlayer.attackFrame >= thisPlayer.attacks[thisPlayer.currAttack].frames) { //end of attack
            thisPlayer.queuedAttack = 0;
            thisPlayer.attackString = "";
            thisPlayer.queuedString = "";
            thisPlayer.attackFrame = 0;
            thisPlayer.currAttack = -1;
            return;
        }
        var movementFrameData = thisPlayer.attacks[thisPlayer.currAttack].movements[thisPlayer.attackFrame];
        thisPlayer.sword.position.x += Math.cos(thisPlayer.rotation)*movementFrameData[0] + Math.sin(thisPlayer.rotation)*movementFrameData[1];
        thisPlayer.sword.position.y += Math.sin(thisPlayer.rotation)*movementFrameData[0] + Math.cos(thisPlayer.rotation)*movementFrameData[1];
        //thisPlayer.sword.rotation   += thisPlayer.attacks[ thisPlayer.currAttack].rotations[thisPlayer.attackFrame];
        
        var distance = Math.sqrt(Math.pow(thisPlayer.sword.position.x - thisPlayer.position.x, 2) 
                               + Math.pow(thisPlayer.sword.position.y - thisPlayer.position.y, 2));
        if (distance > maxDistance) { //if the sword is too far away from its owner, move it to the max distance
            thisPlayer.sword.position.x = thisPlayer.position.x + ((thisPlayer.sword.position.x - thisPlayer.position.x) / distance * maxDistance);   
            thisPlayer.sword.position.y = thisPlayer.position.y + ((thisPlayer.sword.position.y - thisPlayer.position.y) / distance * maxDistance); 
        }
    }
    thisPlayer.attackFrame++;
}

function checkFalling() {
    if (!checkOverlap(player, ground)) {
        player.falling = true;
    }
    if (!checkOverlap(enemy, ground)) {
        player.falling = true;
    }
}


function fall (faller){
    var rate = faller.fallingrate;
    faller.rotation = 0;
    faller.width -= rate;
    faller.height -= rate;
    faller.sword.kill();
    if (faller.width <= 20 || faller.height <= 20) {
        faller.health = 0;
        faller.kill();
    }
    faller.fallingrate += .01;
}

var platforms;
var score = 0;
var scoreText;


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
