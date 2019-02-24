function Player(id, auth){
	this.id 		= id;
	this.authToken	= auth;
}

Player.create = function(id, auth) {
  	
  	return new Player(id, auth);
}

Player.prototype.updateOnInput = function(data){
	console.log(this.id,":",data);
}

Player.prototype.update = function(){

}

Player.prototype.getAuth = function(){
	return this.authToken;
}

Player.prototype.getID = function(){
	return this.id;
}

Player.prototype.setID = function(id){
	this.id = id;
}

module.exports = Player;