var menuState = {preload: menuPreload, create: menuCreate, update: menuUpdate};

var selected;
var stageselected;
var stagebuttons = [];

function menuPreload () {
    game.load.image('button1', 'assets/button1.png');
    game.load.image('background', 'assets/sky.png');
    game.load.image('frame', 'assets/frame.jpg');
    game.load.text('stageslist', 'json/stages.json');

}

function menuCreate () {
    selected = 0;
    var background = game.add.sprite(boundsX/2, boundsY/2, 'background');
    var stagesJSON = JSON.parse(game.cache.getText('stageslist'));
    var play_button = new myButton(game, 'button1', boundsX/2, boundsY/4, 200, 200, 'Play Game');
    var description_window = new myButton(game, 'frame', boundsX/2, boundsY*3/4, boundsX*3/4, 200, 'Select a background.');

    for (i = 0; i < 4; i++) {
        stagebuttons[i] = new myButton(game, 'button1', boundsX*(2*i+1)/8,
            boundsY/2, 150, 150, stagesJSON.stages[i].name);
        stagebuttons[i].events.onInputDown.add(stageButtonClicked, i);
        stagebuttons[i].events.onInputOver.add
            (stageButtonHovered, {i: i, text: description_window.buttontext, stagesJSON: stagesJSON});
        stagebuttons[i].events.onInputOut.add(stageButtonCleared, description_window.buttontext);
    }
    play_button.events.onInputDown.add(playButtonClicked, {stagesJSON: stagesJSON});
    var titletext = game.add.text(boundsX/2, boundsY/9, 'Ancient Earth', {font: '70px Baskerville'});
    titletext.anchor.setTo(.5,.5);
    background.anchor.setTo(.5,.5);
    game.camera.follow(background);

}

function menuUpdate () {

}
