const Player = require('./Player');
const Command = require('./Command');
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
	// console.log("["+socket.id+"] has connected.");
    this.clients.set(socket.id, socket);
    this.players.set(socket.id, Player.create(socket.id, generateToken(20), generateIP(this)));


    this.clients.get(socket.id).emit('init', {
        id: this.players.get(socket.id).getID(),
        auth: this.players.get(socket.id).getAuth(),
        cmd: this.players.get(socket.id).getCommands()
    });
}

Game.prototype.disconnectPlayer = function(id) {
    if(typeof this.players.get(id) !== "undefined"){
	    // console.log("["+id+"] has disconnected.");
    	this.clients.remove(id);
    	this.players.remove(id);
    }
}

Game.prototype.getPlayers = function() {
    return this.players.values();
}

Game.prototype.updatePlayerOnInput = function(id, data) {
	var player = this.players.get(id);
    if (player){
    	player.updateOnInput(data);
    	executeCommand(this, player, data);
    }    
}


Game.prototype.update = function(){
	var players = this.getPlayers();
	// for(var p in players){
	// 	if(players[p].getIP() == ip){
	// 		unique = false;
	// 		break;
	// 	}
	// }

}

Game.prototype.constUpdate = function() {
	var players = this.getPlayers();
    
}

Game.prototype.sendState = function() {
    var ids = this.clients.keys();
    for (var i = 0; i < ids.length; i++) {
    	var resp = this.players.get(ids[i]).response();
    	if(resp){
	        this.clients.get(ids[i]).emit('response', {
	            entry: resp
	        });
	        if(this.players.get(ids[i]).endOfOutput())
		        this.clients.get(ids[i]).emit('end-output');
    	}
    }

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

function generateIP(context){
	//TODO: this will need to optimized

	var players = context.players.values();
	while(true){
		var ip = ""+parseInt(Math.random()*255)+"."+parseInt(Math.random()*255)+"."+parseInt(Math.random()*255)+"."+parseInt(Math.random()*255);

		var unique = true;
		for(var p in players){
			if(players[p].getIP() == ip){
				unique = false;
				break;
			}
		}

		if(unique) return ip;
	}
}

function executeCommand(context, user, cmd){
	if(cmd.name=="ping") user.newResponses(Command.ping(context.players.values(), cmd.args[0]));
	else if(cmd.name=="sys") user.newResponses(Command.sys(user, cmd.vars));
}

module.exports = Game;