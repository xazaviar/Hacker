$(document).ready(function() {
	var socket = io();
  	var canvas = document.getElementById('canvas');

  	var game = Game.create(socket, canvas);

  	game.init();
});