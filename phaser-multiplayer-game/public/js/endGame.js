var endState = {preload: endPreload, create: endCreate, update: endUpdate};

function endPreload () {
    game.load.image('background', 'assets/sky.png');
}

function endCreate () {
    var background = game.add.sprite(boundsX/2, boundsY/2, 'background');

    var titletext = game.add.text(boundsX/2, boundsY/9, '\n\n\n\n\n\t\t\t\t\t\tGAME OVER\nRefresh to play again!', {font: '70px Baskerville'});
    titletext.anchor.setTo(.5,.5);
    background.anchor.setTo(.5,.5);
    game.world.setBounds(0, 0, 0, 0)
    game.camera.x = 0;
    game.camera.y = 0;

}

function endUpdate () {

}
