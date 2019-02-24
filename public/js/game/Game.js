const FPS = 20;

function Game(socket, drawing){
    this.socket = socket;
    this.drawing = drawing;

    this.user = {id:"", auth:""};

    //Terminal Data
    this.status = "clear";
    this.validCommands = ["clear", "sys",""];
    this.command = "";
    this.prevEntries = [];
    this.prevEntIndex = this.prevEntries.length;
    this.terminal = [];
    this.cursorIndex = 0;


    //Keyboard listener
    var context = this;
    $(document).on('keyup keydown', function(e){this.shifted = e.shiftKey} );
    window.addEventListener('keydown',function(e){
        switch(true){
            case e.keyCode == 8: //backspace
                context.command = context.command.substring(0,context.cursorIndex-1)+context.command.substring(context.cursorIndex,context.command.length);
                context.cursorIndex>0?context.cursorIndex--:context.cursorIndex=0;
                break; 
            case e.keyCode == 13: //Enter
                context.commandEntry(); 
                break; 
            case e.keyCode < 32: break;
            case e.keyCode == 37: //Left Arrow
                context.cursorIndex>0?context.cursorIndex--:context.cursorIndex=0;
                break;
            case e.keyCode == 38: //Up Arrow
                context.prevEntIndex>0?context.prevEntIndex--:context.prevEntIndex=0; 
                var i = context.prevEntIndex;
                if(context.prevEntries.length > 0)
                context.command = context.prevEntries[i]; 
                context.cursorIndex = context.command.length;
                break;
            case e.keyCode == 39: //Right Arrow
                context.cursorIndex<context.command.length?context.cursorIndex++:context.cursorIndex=context.command.length;
                break;
            case e.keyCode == 40: //Down Arrow
                context.prevEntIndex<context.prevEntries.length?context.prevEntIndex++:context.prevEntIndex=context.prevEntries.length;
                if(context.prevEntIndex == context.prevEntries.length) context.command = "";
                else{
                    var i = context.prevEntIndex;
                    context.command = context.prevEntries[i];
                }  
                context.cursorIndex = context.command.length;
                break;
            case e.keyCode == 46: //Delete
                context.command = context.command.substring(0,context.cursorIndex)+context.command.substring(context.cursorIndex+1,context.command.length);
                break; 
            default: //Other keys
                var max_len = 153;
                var key = (context.shifted && e.keyCode > 96 && e.keyCode < 123?toUpper(e.key):e.key);
                if(context.command.length < max_len){
                    context.command = context.command.substring(0,context.cursorIndex)+key+context.command.substring(context.cursorIndex,context.command.length);
                    context.cursorIndex++;
                }
        }
    },false);
}

Game.create = function(socket, canvasElement) {
    var canvasContext = canvasElement.getContext('2d');

    var drawing = Drawing.create(canvasContext);
    return new Game(socket, drawing);
}

Game.prototype.init = function(name, auth) {
    var context = this;

    this.socket.on('update', function(data) {
        context.receiveGameState(data);
    });
    this.socket.on('init', function(data) {
        context.user.id = data.id;
        context.user.auth = data.auth;

        console.log("received:",context.user.id,context.user.auth);
    });
    this.socket.emit('player-connect', {
        name: name,
        auth: auth
    });
    
    setInterval(function(){context.draw();}, 1000/FPS);
}

Game.prototype.commandEntry = function(){
    //New entry
    this.terminal.push("> "+this.command); 
    if(this.command!="") this.prevEntries.push(this.command);
    this.prevEntIndex = this.prevEntries.length;
    this.cursorIndex = 0;

    //Command validation
    var valid = false;
    for(var c in this.validCommands){
        if(this.validCommands[c] == this.command){
            //send command to server, unless...
            if(this.command == "clear"){
                this.terminal = [];
                this.terminal.push("> "+this.command);
            }
            else{
                //send command
            }

            valid = true;
            break;
        }
    }

    if(!valid){
        this.terminal.push("Command not recognized as valid command.");
        // this.terminal.push("The command '"+this.command+"' is not recognized as the name of a valid command, function, file or operable program. Check the spelling of the name or, if a path was included, verify the that the path is correct and try again.");
        this.terminal.push("");
    }

    //Clear command line
    this.command = "";
}


Game.prototype.draw = function() {
    //Resize the canvas
    this.drawing.resize();

    // Clear the canvas
    this.drawing.clear();

    // Draw background
    this.drawing.background(this.status);

    //Draw status
    this.drawing.status(this.status);

    //Draw terminal
    this.drawing.terminal(this.status,this.terminal,this.command, this.cursorIndex);

    //Draw chat
    this.drawing.chat(this.status,[]);
}
