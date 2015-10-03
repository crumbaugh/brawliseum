
var boundsX = 800, boundsY = 600;
var menu = new Phaser.Game(boundsX, boundsY, Phaser.CANVAS, "menu", {preload:preload, update:update, create:create});
var counter = 0;

function preload () {
    menu.load.image('button', 'assets/button1.png');
}

function create() {
    play_button = new Button(menu, boundsX/2, boundsY/4, 'Play Game');
}

function update() {
    
}


