function Player(id, auth, ip){
	this.id 		= id;
	this.authToken	= auth;

	//Testing
	this.sys = {
		name:"EXAMPLE_SYSTEM",
		port:6565,
		ip: ip,
		status:"CLEAR",
		os:"DoorOS"
	}

	//Commands
	this.commands = [
		{	name: "clear",
		 	args: 0,
		 	vars: [],
		 	err: "Too many args."
		},
		{	name: "sys",
		 	args: 0,
		 	vars: ["status","os","port","ip"],
		 	err: "Incorrect usage of sys. Type sys for list of variables"
		},
		{	name: "ping",
		 	args: 1,
		 	vars: [],
		 	err: "Invalid number of args. Usuage: ping [ipv4_address] Example: ping 127.0.0.1"
		}
	];


	this.responses = [];
}

Player.create = function(id, auth, ip) {
  	
  	return new Player(id, auth, ip);
}

Player.prototype.updateOnInput = function(data){
	// console.log(this.id,":",data);



}

Player.prototype.update = function(){

}

Player.prototype.getAuth = function(){
	return this.authToken;
}

Player.prototype.getID = function(){
	return this.id;
}

Player.prototype.getCommands = function(){
	return this.commands;
}

Player.prototype.getIP = function(){
	return this.ip;
}

Player.prototype.newResponses = function(resp){
	if(this.responses.length == 0)
		this.responses = resp;
	else for(var r in resp)
		this.responses.push(resp[r]);
}

Player.prototype.response = function(){
	if(this.responses.length > 0){
		var resp = this.responses[0];
		this.responses.splice(0,1);
		return resp;//return first response
	}
	else return null;
}

Player.prototype.endOfOutput = function(){
	return this.responses.length == 0;
}

module.exports = Player;