function Command() {
    throw new Error('Commands should not be instantiated!');
}


Command.ping = function(userList, ip){
	//Check for valid IP
	var ipSplit = ip.split(".");
	if(ipSplit.length != 4){
		return ["INVALID IP ADDRESS."];
	}
	for(var i in ipSplit){
		if(isNaN(ipSplit[i])){
			return ["INVALID IP ADDRESS."];
			break;
		}
	}

	//Has valid IP
	if(ip=="127.0.0.1"){ //ping self
		return [" ",
				"Pinging 127.0.0.1 with 32 bytes of data:",
				" ",
				"Reply from 127.0.0.1: bytes=32 time<1ms TTL=128",
				"Reply from 127.0.0.1: bytes=32 time<1ms TTL=128",
				"Reply from 127.0.0.1: bytes=32 time<1ms TTL=128",
				"Reply from 127.0.0.1: bytes=32 time<1ms TTL=128",
				" ",
				"Ping statistics for 127.0.0.1:",
				"    Packets: Sent = 4, Received = 4, Loss = 0 (0% loss),",
				"Approximate round trip times in milli-seconds:",
				"    Minimum = 0ms, Maximum = 0ms, Average = 0ms",
				" "];
	}
	else {
		for(var u in userList){
			if(userList[u].sys.ip == ip){
				//TODO: simulate delayed response time. 
				//IDEA: Player stats/progs affect bytes and succssful returns

				return [" ",
						"Pinging "+ip+" with 32 bytes of data:",
						" ",
						"Reply from "+ip+": bytes=32 time<1ms TTL=128",
						"Reply from "+ip+": bytes=32 time<1ms TTL=128",
						"Reply from "+ip+": bytes=32 time<1ms TTL=128",
						"Reply from "+ip+": bytes=32 time<1ms TTL=128",
						" ",
						"Ping statistics for "+ip+":",
						"    Packets: Sent = 4, Received = 4, Loss = 0 (0% loss)",
						"Approximate round trip times in milli-seconds:",
						"    Minimum = 0ms, Maximum = 0ms, Average = 0ms",
						" "];
			}
		}
			
	}

	return [" ",
			"Pinging "+ip+" with 32 bytes of data:",
			" ",
			"Request timed out.",
			"Request timed out.",
			"Request timed out.",
			"Request timed out.",
			" ",
			"Ping statistics for "+ip+":",
			"    Packets: Sent = 4, Received = 0, Loss = 4 (100% loss)",
			" "];
}

Command.sys = function(user, variable){
	//Print variable options
	if(variable==""){
		var resp = ["The properties associated with sys:"];
		for(var prop in user.sys)
			resp.push(" - "+prop);
		
		return resp;
	}
	else return [""+user.sys[variable]];
}

module.exports = Command;