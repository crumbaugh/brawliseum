
myButton.prototype = Object.create(Phaser.Sprite.prototype);
//myPanel.prototype = Object.create(Phaser.Sprite.prototype);

myButton.prototype.constructor = myButton;
//myPanel.prototype.constructor = myPanel;

myButton.prototype.force = {x:0.0, y:0.0}; 
//myPanel.prototype.force = {x:0.0, y:0.0}; 

var myButton;
var wasd;

function myButton(game, image, x, y, width, height, text) {
    Phaser.Sprite.call(this, game, x, y, image);
    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(width/this.width, height/this.height);
    game.add.existing(this);
    this.buttontext = game.add.text(this.x, this.y, text);
    this.buttontext.anchor.setTo(0.5,0.5);
    this.inputEnabled = true;
}

function weaponButtonClicked () {
    selected = this;
}

function playButtonClicked () {
    game.state.start('play');
}

myButton.prototype.update = function() {
    if (this == selected) {
        this.buttontext.setStyle({fill: 'white'});
    }
    else {
        this.buttontext.setStyle({fill: 'black'});
    }
}