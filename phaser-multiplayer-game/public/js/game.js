/* global Phaser RemotePlayer io */
var boundsX = 800;
var boundsY = 600;

var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('menu', menuState);
game.state.add('play', playState);

game.state.start('menu');
