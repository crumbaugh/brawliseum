
Button.prototype = Object.create(Phaser.Sprite.prototype);

Button.prototype.constructor = Button;

Button.prototype.force = {x:0.0, y:0.0}; 

var Button;
var wasd;

function Button(game, x, y, text) {
    Phaser.Sprite.call(this, game, x, y, 'button');
    this.anchor.setTo(0.5, 0.5);
    this.buttontext = game.add.text(this.x, this.y, text, { font: "65px Arial", fill: "#ff0044", align: "center" });
    this.buttontext.anchor.setTo(0.5,0.5);
    game.add.existing(this);
}

Button.prototype.update = function() {

}