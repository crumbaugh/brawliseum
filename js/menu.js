var menuState = {preload: menuPreload, create: menuCreate, update: menuUpdate};

var selected;

function menuPreload () {
    game.load.image('button1', 'assets/button1.png');
    game.load.image('background', 'assets/sky.png');
    game.load.image('frame', 'assets/frame.jpg');
    game.load.json('weaponslist', 'json/weapons.json');
}

function menuCreate () {
    var background = game.add.sprite(0,0,'background');
    var weaponsJSON = game.cache.getJSON('weaponslist');
    var play_button = new myButton(game, 'button1', boundsX/2, boundsY/4, 200, 200, 'Play Game');
    play_button.events.onInputDown.add(playButtonClicked, play_button);
    var weaponbuttons = [];
    for (i = 0; i < 4; i++) {
        weaponbuttons[i] = new myButton(game, 'button1', boundsX*(2*i+1)/8,
            boundsY/2, 150, 150, weaponsJSON.weapons[i].name);
        console.log(weaponsJSON.weapons[i].name);
        weaponbuttons[i].events.onInputDown.add(weaponButtonClicked, weaponbuttons[i]);
    }
    selected = weaponbuttons[0];
    var description_window = new myButton(game, 'frame', boundsX/2, boundsY*3/4, boundsX*3/4, 200, 'Select a weapon.')
    // add in description display code
}

function menuUpdate () {

}
