//**********************************************************************
//INIT
//**********************************************************************
function Drawing(context) {
    this.context = context;
    this.scale = 3;

    this.loadImages();

    //Blinking cursor
    //this.cursorSymbol = "█"; //https://coolsymbol.com/square-rectangle-symbols.html
    this.tick = 0;
    var cont = this;
    setInterval(function(){cont.tick++},500);
}

Drawing.create = function(context){
    return new Drawing(context);
}


//**********************************************************************
//DRAWING
//**********************************************************************
Drawing.prototype.background = function(status){
    var canvas = this.context.canvas;

    //Draw cyber backing
    this.context.beginPath();
    this.context.drawImage(this.backImg,0,0,canvas.width,canvas.height);

    //Draw main background cover (visibility)
    this.context.fillStyle = 'rgba(0,0,25,.98)';
    this.context.fillRect(0, 0, canvas.width, canvas.height);
    this.context.fill();
}

Drawing.prototype.status = function(status){
    
}

Drawing.prototype.terminal = function(status, log, command, cursorIndex, waiting){
    var scale = 1920/this.context.canvas.width;
    var offset = 15/scale, viewWid = this.context.canvas.width * .70;
    var color = 'rgb(0,255,255,.95)';
    var fontSize = (14/scale), fontWid = fontSize*.6;
    this.context.font = ""+fontSize+"px Courier New";
    this.context.fillStyle = color;
    this.context.strokeStyle = color;

    //Draw Border
    this.context.strokeRect(offset, offset, viewWid, canvas.height - offset*2);
    this.context.fill();

    if(!waiting){
        //Draw entry text
        this.context.fillText("> "+command /*+ (this.cursorVis?this.cursorSymbol:"")*/, offset*2, canvas.height - offset*2); 

        //Draw cursor
        if(this.tick%2==0)
            this.context.fillRect(offset*2+(cursorIndex+2)*fontWid,canvas.height - offset*2-fontSize*.8,fontWid/2,fontSize);
    }
    else{
        var dots = "";

        if(this.tick%4==1) dots = ".";
        else if(this.tick%4==2) dots = ". .";
        else if(this.tick%4==3) dots = ". . .";

        //Draw waiting text
        this.context.fillText("  "+dots, offset*2, canvas.height - offset*2); 
    }


    //Draw terminal text
    var count = 1, max_len = 156, max_line = 74;
    for(var l = log.length-1; l > -1 && count < max_line; l--){
        if(log[l].length > max_len){
            var split = log[l];
            for(var split = parseInt(log[l].length/max_len); split > -1; split--){
                this.context.fillText(log[l].substring(split*max_len,Math.min(log[l].length-1,split*max_len+max_len)),offset*2, canvas.height - offset*2 - count*fontSize);
                count++;
            }
        }
        else{
            this.context.fillText(log[l],offset*2, canvas.height - offset*2 - count*fontSize);
            count++;
        }
    }

}

Drawing.prototype.chat = function(status, log){
    
}



//**********************************************************************
//UTIL
//**********************************************************************
Drawing.prototype.clear = function() {
    var canvas = this.context.canvas;
    this.context.clearRect(0, 0, canvas.width, canvas.height);
}

Drawing.prototype.resize = function(){
    const widthToHeight = 1920 / 1080;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;

    var newWidthToHeight = newWidth / newHeight;

    if(newWidthToHeight > widthToHeight)
        newWidth = newHeight * widthToHeight;
    else
        newHeight = newWidth / widthToHeight;
    

    $("#gameArea").css({
        "height":newHeight+"px",
        "width":newWidth+"px",
        "margin-top": (-newHeight / 2) + "px",
        "margin-left": (-newWidth / 2) + "px"
    });

    $("#canvas").attr("width",newWidth+"px");
    $("#canvas").attr("height",newHeight+"px");


    this.scale = newWidth;
}

Drawing.prototype.setScale = function(s) {
    this.scale = s;
}

Drawing.prototype.loadImages = function(){
    this.backImg = new Image;
    this.backImg.src = "/images/backdrop.png";
}