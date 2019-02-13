const Player = require('./Player');
const HashMap = require('hashmap');

function Game() {
    this.clients = new HashMap();
    this.players = new HashMap();

    this.changes = [];
}

Game.create = function() {
    
    return new Game();
}

Game.prototype.addNewPlayer = function(socket) {
	console.log("["+socket.id+"] has connected.");
    this.clients.set(socket.id, socket);
    this.players.set(socket.id, Player.create(socket.id, generateToken(20)));


    this.clients.get(socket.id).emit('init', {
        id: this.players.get(socket.id).getID(),
        auth: this.players.get(socket.id).getAuth()
    });
}

Game.prototype.disconnectPlayer = function(id) {
    if(typeof this.players.get(id) !== "undefined"){
	    console.log("["+id+"] has disconnected.");
    	this.clients.remove(id);
    }

}

Game.prototype.getPlayers = function() {
    return this.players.values();
}

Game.prototype.updatePlayerOnInput = function(id, data) {
	var player = this.players.get(id);
    if (player) player.updateOnInput(data);   
}


Game.prototype.update = function(){
	var players = this.getPlayers();

}

Game.prototype.constUpdate = function() {
	var players = this.getPlayers();
    
}

Game.prototype.sendState = function() {
    var ids = this.clients.keys();
    // for (var i = 0; i < ids.length; i++) {
    //     this.clients.get(ids[i]).emit('update', {
    //         updates: sendChanges
    //     });
    // }

    this.changes = [];
    
}

function generateToken(n){
	const chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
				   'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
				   '0','1','2','3','4','5','6','7','8','9']
	var token = '';
	for(var i = 0; i < n; i++){
		token += chars[parseInt(Math.random()*chars.length)];
	}
	return token;
}

module.exports = Game;