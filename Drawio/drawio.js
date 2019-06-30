var saved = true;
var loaded = false;
var deleted = false;
var selectedDrawing = "";

window.drawio = {
    drawingName: "",
    linewidth: 5, //Default linewidth
    color: '#000000', //Default color (black)
    textInput: "",
    shapes: [],    //array of all shapes
    removedShapes: [], //For redo function
    selectedShape: 'pencil',   //Default selected shape
    canvas: document.getElementById('my-canvas'), 
    ctx: document.getElementById('my-canvas').getContext('2d'),   //Basic drawing tool to draw on canvas
    selectedElement: null, //Element you are working with
    availableShapes: { //available opperations
        PENCIL: 'pencil',
        RECTANGLE: 'rectangle',
        CIRCLE: 'circle',
        LINE: 'line',
        TEXT: 'text',
        ERASER: 'eraser',
        MOVE: 'move',
        DELETE: 'delete'
    },
    dragging: false, //see if you are dragging the element
    offsets: null, //mouse offset on item for moving
    offsetX: [], //offsetX array for moving pencil
    offsetY: [], //offsetY array for moving pencil
    fontFamily: 'Arial', //default font family            
};


$(function () {
    function drawCanvas() { //drawing the canvas
        drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
        if(drawio.selectedElement) {
            drawio.selectedElement.render(); 
        }
        for(i = 0; i < drawio.shapes.length; i++) {
            drawio.shapes[i].render();
        }
    };

    $(document).ready(function(){
        for(i = 0; i < localStorage.length; i++) {
            $("#saved-drawings").append('<div>' + '<a href="#">' + localStorage.key(i)  + '<i class="far fa-trash-alt list-icons"></i>' + '</a>' + '</div>');
        }
    })
    
    $('#save-button').on('click', function(){                   //Save the drawio in local storage
        if(drawio.shapes.length > 0) {
            drawio.drawingName = prompt("Name your drawing!");
        }
        if(!drawio.drawingName) {
            drawio.drawingName = "Untitled drawing"
        }
        localStorage.setItem(drawio.drawingName, JSON.stringify(drawio));
        $("#saved-drawings").append('<div>' + '<a href="#">' + drawio.drawingName + '<i class="far fa-trash-alt list-icons"></i>' + '</a>' + '</div>'); 
        saved = true;
    });

    $('#saved-drawings').on('click', 'i', function(){               //Delete item from saved drawings
        if(confirm("Delete this drawing?")) {
            var itemForDeletion =  $(this).parent().text();
            $('#saved-drawings a').filter(function() { 
                return $.text([this]) === itemForDeletion; 
            }).remove();
            localStorage.removeItem(itemForDeletion);
        }
        deleted = true;
    });

    
    $('#saved-drawings').on('click', 'a', function(){ //selects saved drawing from list
        selectedDrawing = $(this).text();
    });


    $('#saved-drawings').on('click', 'a', function(){                           //Creating objects on load
        if(!deleted) {                                  //so the page wont prompt a confirm after i delete, rather refresh and delete item.
            if(confirm("Are you sure you want to load? Un-saved progress will be lost")) {
                var oldShapes = []
                storedObjects = JSON.parse(localStorage.getItem(selectedDrawing));
                for(i = 0; i < storedObjects.shapes.length; i++) {
                        switch(storedObjects.shapes[i].name) {
                            case 'rectangle':
                                oldShapes[i] = new Rectangle({x: storedObjects.shapes[i].posX, y: storedObjects.shapes[i].posY}, storedObjects.shapes[i].width, storedObjects.shapes[i].height, storedObjects.shapes[i].linewidth, storedObjects.shapes[i].color, storedObjects.shapes[i].name);
                                break;
                            case 'pencil':
                                oldShapes[i] = new Pencil({x: storedObjects.shapes[i].posX, y: storedObjects.shapes[i].posY}, storedObjects.shapes[i].linewidth, storedObjects.shapes[i].color, storedObjects.shapes[i].name);
                                oldShapes[i].points = storedObjects.shapes[i].points;
                                break;
                            case 'text':
                                oldShapes[i] = new Text({x: storedObjects.shapes[i].posX, y: storedObjects.shapes[i].posY}, storedObjects.shapes[i].text, storedObjects.shapes[i].name, storedObjects.shapes[i].linewidth, storedObjects.shapes[i].fontFamily, storedObjects.shapes[i].color);
                                oldShapes[i].posX = storedObjects.shapes[i].posX;
                                oldShapes[i].posY = storedObjects.shapes[i].posY;
                                break;
                            case 'circle':
                                oldShapes[i] = new Circle({x: storedObjects.shapes[i].posX, y: storedObjects.shapes[i].posY}, storedObjects.shapes[i].radius, storedObjects.shapes[i].linewidth, storedObjects.shapes[i].color, storedObjects.shapes[i].name);
                                break;
                            case 'line':
                                oldShapes[i] = new Line({x:storedObjects.shapes[i].posX, y: storedObjects.shapes[i].posY}, storedObjects.shapes[i].linewidth, storedObjects.shapes[i].color, storedObjects.shapes[i].selectedShape);
                                oldShapes[i].endPos = storedObjects.shapes[i].endPos;
                                break;
                            case 'eraser':
                                oldShapes[i] = new Eraser({x: storedObjects.shapes[i].posX, y: storedObjects.shapes[i].posY}, storedObjects.shapes[i].linewidth, storedObjects.shapes[i].selectedShape);
                                oldShapes[i].points = storedObjects.shapes[i].points;
                                break;
                        }
                }
                drawio.shapes = oldShapes;
                drawCanvas();
            }  
        }
        deleted = false;
    });

    window.onbeforeunload = function (e) {          //Prompt user if he has added an object and hasn't saved
            e = e || window.event;
        
            if(!saved){
                return 'Sure?';
            }
        };

    $(document).keydown(function(event) {                   //ctrl+z/ctrl+y for undo/redo
        if(event.which == 90 && event.ctrlKey) {
            if(drawio.shapes.length > 0) {           
                drawio.removedShapes.push(drawio.shapes[drawio.shapes.length-1]); 
                drawio.shapes.pop();
                drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
                drawCanvas();
            }
        }
        else if(event.which == 89 && event.ctrlKey) {
            if(drawio.removedShapes.length > 0) {   
                drawio.shapes.push(drawio.removedShapes[drawio.removedShapes.length-1]);    
                drawio.removedShapes.pop();
                drawio.ctx.clearRect(0, 0, drawio.canvas.width, drawio.canvas.height);
                drawCanvas();
                drawio.selectedElement = null;
            }
        }
    });

    $('#line-width-slider').on('change',function(){ //Changes linewidth with a slider
        drawio.linewidth = $(this).val();
    });

    $('#color').on('click', function(){      //Display color when clicked on color palette
        $('#color-picker').trigger('click');
    });

    $('#color-picker').on('change', function(){ //Get color value of the color function
        drawio.color = $(this).val();     
    });
    $('#font-picker').on('change', function(){ //Get font user picks for text
        drawio.fontFamily = $(this).val(); 
    });
   
    $('#text-input').on('input', function(){ //text input for text tool
        drawio.textInput = $(this).val();
    })

    $('.icons').on('click', function(){ //When user clicks on icons we make that the seleceted shape
        if(($(this).data('shape') != 'color')) {
            $('.icons').removeClass('selected');
            $(this).addClass('selected');
            drawio.selectedShape = $(this).data('shape');
        }
    });

$('#my-canvas').on('mousedown', function(mouseEvent){ //user clicking down on the canvas we make something happend depending on what tool he is using
    switch (drawio.selectedShape) {
        case drawio.availableShapes.RECTANGLE:
            drawio.selectedElement = new Rectangle({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, 0, 0, drawio.linewidth, drawio.color, drawio.selectedShape);
            break;
        case drawio.availableShapes.CIRCLE:
            drawio.selectedElement = new Circle({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, 0, drawio.linewidth, drawio.color, drawio.selectedShape);
            break;
        case drawio.availableShapes.LINE:
            drawio.selectedElement = new Line({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, drawio.linewidth, drawio.color, drawio.selectedShape);
            break;
        case drawio.availableShapes.PENCIL:
            drawio.selectedElement = new Pencil({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, drawio.linewidth, drawio.color, drawio.selectedShape);
            break;
        case drawio.availableShapes.TEXT:
            drawio.selectedElement = new Text({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, drawio.textInput, drawio.selectedShape, drawio.linewidth, drawio.fontFamily, drawio.color);    
            drawCanvas(); // Drawing so when clicked the text appears
            break;
        case drawio.availableShapes.ERASER:
            drawio.selectedElement = new Eraser({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, drawio.linewidth, drawio.selectedShape);
            break;
        case drawio.availableShapes.MOVE:
            for(var i = drawio.shapes.length - 1; i >= 0 ; --i){ //in reverse order so you can most recent is on top
                drawio.offsets = drawio.shapes[i].select({x: mouseEvent.offsetX, y: mouseEvent.offsetY}); 
                if(drawio.offsets){ // checks if it found the mouse offset 
                    drawio.selectedElement = drawio.shapes[i]; 
                    drawio.dragging = true;
                    break;
                }
            }
            break;
        case drawio.availableShapes.DELETE:
            for(var i = drawio.shapes.length - 1; i >= 0 ; --i){ //in reverse order so you can most recent is on top
                if(drawio.shapes[i].select({x: mouseEvent.offsetX, y:mouseEvent.offsetY})){
                    drawio.removedShapes.push(drawio.shapes[i]);
                    drawio.shapes.splice(i, 1);
                    drawCanvas();
                    break;
                }
            }
            break;
    }
})

$('#my-canvas').on('mouseup', function(){ //user stopps clicking, used for resetting variables
    paint = false;
    saved = false;
    drawio.dragging = false;
    drawio.selectedElement = null;
    drawio.offsets = null; 
})

$('#undo-button').on('click', function(){       //Pops an object from the shapes list and adds it to removed shapes
    if(drawio.shapes.length > 0) {              //So i can redo easily
        drawio.removedShapes.push(drawio.shapes[drawio.shapes.length-1]); 
        drawio.shapes.pop();
        drawCanvas();
    }
});

$('#redo-button').on('click', function(){   //Pops an element from the removed shapes list and returns it to the shapes list
    if(drawio.removedShapes.length > 0) {   
        drawio.shapes.push(drawio.removedShapes[drawio.removedShapes.length-1]);    
        drawio.removedShapes.pop();
        drawCanvas();
        drawio.selectedElement = null;
    }
});

$('#my-canvas').on('mousemove', function(mouseEvent){ //when the mouse is moving on canvas
    if(drawio.selectedElement && drawio.dragging && drawio.offsets){ //if mouse is inside element, dragging it and element is selected
        drawio.selectedElement.move({x: mouseEvent.offsetX, y: mouseEvent.offsetY}, drawio.offsets); //moving by mouse pos where the mouse is inside element
    }
    else if(drawio.selectedElement){
        drawio.selectedElement.resize(mouseEvent.offsetX, mouseEvent.offsetY); //when drawing element, moves positions
    }
    drawCanvas(); 
});

});
