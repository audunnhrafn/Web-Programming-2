function Shape(position) { // Constructor for all shapes
    this.posX = position.x;
    this.posY = position.y;
};

Shape.prototype.render = function() { // General render function
}

Shape.prototype.move = function(position, off) { // General move function for shapes, called in other shapes
    this.posX = position.x - off.x;
    this.posY = position.y - off.y;
}

Shape.prototype.resize = function() { // General resize function

}

Shape.prototype.select = function(pos){ // General select function 
}

/*-----------RECTANGLE-------------*/

function Rectangle(position, width, height, linewidth, color, name) { //constructor
    Shape.call(this, position);
    this.linewidth = linewidth;
    this.color = color;
    this.width = width;
    this.height = height;
    this.name = name;
    drawio.shapes.push(this);
}

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;


Rectangle.prototype.render = function() { //actually drawing the element
    drawio.ctx.lineWidth = this.linewidth;
    drawio.ctx.strokeStyle = this.color;
    drawio.ctx.beginPath();
    drawio.ctx.globalCompositeOperation="source-over"; //for the eraser
    drawio.ctx.rect(this.posX, this.posY, this.width, this.height);
    drawio.ctx.stroke();
    drawio.ctx.closePath();
}

Rectangle.prototype.resize = function(x, y) { //changing width and height while drawing
    this.width = x - this.posX;
    this.height = y - this.posY;
}

Rectangle.prototype.select = function(pos){ //See if user is selecting the rectangle
    var check = false; //flag to see if mouse is inside the rect
    var wid = this.posX + this.width; //width of the rectangle
    var hei = this.posY + this.height; //height of the rectangle

    if(pos.x > this.posX){
        if(pos.x < wid){
            if(pos.y > this.posY){
                if(pos.y < hei){
                    check = true; //drawn upper left to bottom right rect
                }
            }
            else if(pos.y > hei){
                check = true; //drawn bottom left to top right rect
            }
        }
    }
    else if(pos.x > wid){
        if(pos.y > this.posY){
            if(pos.y < hei){
                check = true; //drawn top right to bottom left 
            }
        }
        else if(pos.y > hei){
            check = true; //drawn bottom right to top left rect
        }
    }

    if (check){
        return {x: pos.x - this.posX, y: pos.y - this.posY}; // Returning where the mouse is located at the rectangle
    }
    return null; 
}


/*-----------CIRCLE-------------*/

function Circle(position, radius, linewidth, color, name) { // Constructor
    Shape.call(this, position);
    this.radius = radius;
    this.linewidth = linewidth;
    this.color = color;
    this.name = name;
    drawio.shapes.push(this);

}
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.resize = function(x, y) { //changing the radius when drawing
    var a = x - this.posX;
    var b = y - this.posY;
    this.radius = Math.sqrt(a*a + b*b);
}

Circle.prototype.render = function() { //actually drawing the element
    drawio.ctx.lineWidth = this.linewidth;
    drawio.ctx.strokeStyle = this.color;
    drawio.ctx.beginPath();
    drawio.ctx.globalCompositeOperation="source-over"; //for the eraser
    drawio.ctx.arc(this.posX, this.posY, this.radius, 0, 2*Math.PI);
    drawio.ctx.stroke();
}

Circle.prototype.select = function(pos){ //Seeing if mouse is within the radius of the circle
    if(Math.sqrt(Math.pow(this.posX - pos.x, 2) + Math.pow(this.posY - pos.y, 2)) < this.radius)
        return {x: pos.x - this.posX, y: pos.y - this.posY}; //returning where the mouse is inside the circle
    return null;
}

/*-----------lINE-------------*/


function Line(position, linewidth, color, name) { //constructor
    Shape.call(this, position);
    this.endPos = position;
    this.linewidth = linewidth;   
    this.color = color;
    this.name = name;
    drawio.shapes.push(this);
}

Line.prototype = Object.create(Shape.prototype);
Line.prototype.constructor = Line;

Line.prototype.resize = function(x, y) { //chaning the end position when drawing
    this.endPos.x = x;
    this.endPos.y = y;
}

Line.prototype.render = function() { // actually drawing the line
    drawio.ctx.lineWidth = this.linewidth;
    drawio.ctx.strokeStyle = this.color;
    drawio.ctx.beginPath();
    drawio.ctx.globalCompositeOperation="source-over"; //for the eraser 
    drawio.ctx.moveTo(this.posX, this.posY);
    drawio.ctx.lineTo(this.endPos.x, this.endPos.y);
    drawio.ctx.stroke();
    drawio.ctx.closePath();
}

Line.prototype.move = function(pos, off){ //moving the line 
    var lineCenter = { //finding the middle of the line
        x: (this.posX + this.endPos.x) / 2,
        y: (this.posY + this.endPos.y) / 2
    };
    
    var moveLine = { //finding move pos
        x: pos.x - lineCenter.x,
        y: pos.y - lineCenter.y 
    };

    this.posX += moveLine.x; //moving it by the move pos 
    this.posY += moveLine.y;
    this.endPos.x += moveLine.x;
    this.endPos.y += moveLine.y;
}

Line.prototype.select = function(pos){ //selecting the line
    currPos = {x: this.posX, y: this.posY};
    var left = currPos.x < this.endPos.x ? currPos: this.endPos; 
    var right = currPos == left ? this.endPos : currPos;
    var top = currPos.y < this.endPos.y ? currPos : this.endPos;
    var bottom = currPos == top ? this.endPos : currPos;
    
    if(pos.x >= left.x - 5 && pos.x <= right.x + 5  && pos.y + 5 >= top.y && pos.y <= bottom.y + 5) // + 5 for larger frame to click on when horizontal or vertical
        return true; //if the mouse hits the line
    return null;
}

/*-------PENCIL-----------*/

function Pencil(position, linewidth, color, name) { //constructor
    Shape.call(this, position);
    this.color = color;
    this.linewidth = linewidth;
    this.points = new Array;
    this.name = name;
    drawio.shapes.push(this);
}

Pencil.prototype = Object.create(Shape.prototype);
Pencil.prototype.constructor = Pencil;

Pencil.prototype.resize = function(x, y) {  //when drawing push the points into the points array
    point = {x: x, y: y}
    this.points.push(point)
}

Pencil.prototype.render = function() { //drawing all the points
    drawio.ctx.strokeStyle = this.color;
    drawio.ctx.lineWidth = this.linewidth;
    drawio.ctx.lineJoin = "round";
    for(var i=0; i < this.points.length -1 ; i++) {
        point = this.points[i];
        nextPoint = this.points[i+1]
        drawio.ctx.beginPath();
        drawio.ctx.globalCompositeOperation="source-over"; //for the eraser
        drawio.ctx.moveTo(point.x, point.y);
        drawio.ctx.lineTo(nextPoint.x, nextPoint.y);
        drawio.ctx.closePath();
        drawio.ctx.stroke();
    }
}

Pencil.prototype.move = function(pos, off){ //move function
    var newPoints = new Array;

    for(var i = 0; i < this.points.length; i++){ //moves every point with the mouse offset arrays
        newX = pos.x - drawio.offsetX[i];
        newY = pos.y - drawio.offsetY[i];
        newPoints.push({x: newX, y: newY})
    }
    this.points = newPoints;    
}

Pencil.prototype.select = function(pos){ //selecting 
    lineWidth = this.linewidth;
    drawio.offsetX = new Array;
    drawio.offsetY = new Array;
    if(this.points.some(function(point){ // check if any point within the points array is within range of the mouse
            return (pos.x <= (point.x + 20) && // add 20 for easier grabbing of the line
                    pos.x >= (point.x - 20) &&
                    pos.y <= (point.y + 20) && 
                    pos.y >= (point.y - 20))
            })){
        for(var i = 0; i < this.points.length; i++){ //going through every point in the array and setting an offset from the mouse
            point = this.points[i];
            drawio.offsetX.push(pos.x - point.x);
            drawio.offsetY.push(pos.y - point.y);
        }
        return true; //mouse is within the range of points
    }
    return null 

}

/*----------TEXT---------*/

function Text(position, text, name, linewidth, fontFamily, color) { //constructor
    Shape.call(this, position);
    this.text = text;
    this.name = name;
    this.height = parseInt(linewidth) / 2; 
    this.width = this.text.length * (parseInt(linewidth)/2); 
    this.fontFamily = fontFamily;
    this.linewidth = linewidth;
    this.color = color;
    drawio.shapes.push(this);
}

Text.prototype = Object.create(Shape.prototype);
Text.prototype.constructor = Text;

Text.prototype.resize = function(x, y) {  //repositions elements when drawing
    this.posX = x;
    this.posY = y;
}

Text.prototype.render = function() { //Creating the text
    font = this.linewidth + "px " + this.fontFamily; //Creates string that .font accepts
    drawio.ctx.font = font; 
    drawio.ctx.fillStyle = this.color;
    drawio.ctx.globalCompositeOperation="source-over"; //used for eraser
    drawio.ctx.fillText(this.text, this.posX, this.posY);
}

Text.prototype.select = function(pos){ //Selecting the box with the text    
    if (pos.x > this.posX && 
        pos.x < this.width + this.posX && 
        pos.y < this.posY && 
        pos.y > this.posY - this.height){
            return {x: pos.x - this.posX, y: pos.y - this.posY}; // Returning where the mouse is located at the rectangle
    }
    return null; // Mouse not inside
}

/*---------ERASER-----------*/

function Eraser(position, linewidth, name) { //constructor 
    Shape.call(this, position);
    this.linewidth = linewidth;
    this.points = new Array;
    this.name = name;
    drawio.shapes.push(this)
}

Eraser.prototype = Object.create(Shape.prototype);
Eraser.prototype.constructor = Eraser;

Eraser.prototype.resize = function(x, y) { //erasing elements
    point = {x:x,y:y}
    this.points.push(point)
}

Eraser.prototype.render = function() { //drawing the eraser over the objects
    drawio.ctx.lineWidth = this.linewidth;
    drawio.ctx.strokeStyle = "rgba(255,255,255)"; //white color 
    for(var i=0; i < this.points.length -1 ; i++) {
        point = this.points[i];
        nextPoint = this.points[i+1]
        drawio.ctx.beginPath();
        drawio.ctx.globalCompositeOperation="source-over"; //only draw white if it's over other object
        drawio.ctx.moveTo(point.x, point.y);
        drawio.ctx.lineTo(nextPoint.x, nextPoint.y);
        drawio.ctx.closePath();
        drawio.ctx.stroke();
    }
}
