const FPS = 60;

function Game(socket, drawing){
    this.socket = socket;
    this.drawing = drawing;

    this.user = {id:"", auth:""};

    console.log(this);
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


Game.prototype.draw = function() {

    //Resize the canvas
    this.drawing.resize();

    // Clear the canvas
    this.drawing.clear();

    //Set scale
    // this.drawing.setScale($("#gameArea").width());
}
