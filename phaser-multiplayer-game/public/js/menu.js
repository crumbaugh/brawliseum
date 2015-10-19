var menuState = {preload: menuPreload, create: menuCreate, update: menuUpdate};

var selected;
var stagebuttons = [];

function menuPreload () {
    game.load.image('button1', 'assets/button1.png');
    game.load.image('background', 'assets/sky.png');
    game.load.image('frame', 'assets/frame.jpg');
    game.load.text('stageslist', 'json/stages.json');

}

function menuCreate () {
    selected = 0;
    var background = game.add.sprite(0,0,'background');
    var stagesJSON = JSON.parse(game.cache.getText('stageslist'));
    var play_button = new myButton(game, 'button1', boundsX/2, boundsY/4, 200, 200, 'Play Game');
    var description_window = new myButton(game, 'frame', boundsX/2, boundsY*3/4, boundsX*3/4, 200, 'Select a background.');
    play_button.events.onInputDown.add(playButtonClicked, stagesJSON.stages[selected]);
  //  var stagebuttons = [];
    for (i = 0; i < 4; i++) {
        stagebuttons[i] = new myButton(game, 'button1', boundsX*(2*i+1)/8,
            boundsY/2, 150, 150, stagesJSON.stages[i].name);
        console.log(stagesJSON.stages[i].name);
        stagebuttons[i].events.onInputDown.add(stageButtonClicked, i);
        stagebuttons[i].events.onInputOver.add
            (stageButtonHovered, {i: i, text: description_window.buttontext, stagesJSON: stagesJSON});
        stagebuttons[i].events.onInputOut.add(stageButtonCleared, description_window.buttontext);
    }
}

function menuUpdate () {

}