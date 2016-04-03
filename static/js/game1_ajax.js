var Imgs = ["Img1.jpg","Img2.jpg","Img3.jpg","Img4.jpg"];
var idx = 0;
var blank = "http://img02.deviantart.net/5f01/i/2010/023/1/8/blank_paper_by_montroytana.jpg";
var iniPos;
var finalPos;
var iniMouse = true;
var offRange = 5; // allow 5 pixel around rectangle edges for adjustRect
var adjustDirection;

var img = new Image();
img.addEventListener("load", function() {
	var canvas = document.getElementById("myCanvas");
	canvas.width = img.width;
	canvas.height = img.height;
	fillCanvas(true,false); // draw image only
});

function fillCanvas(hasImg,hasRect){ // the only function that actually draw things
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	if (hasImg){ // draw image
		ctx.drawImage(img,0,0,canvas.width,canvas.height);
	}
	if (hasRect){ // draw rectangle
		w = finalPos.x - iniPos.x;
		h = finalPos.y - iniPos.y;	
		ctx.beginPath();	
		ctx.rect(iniPos.x,iniPos.y,w,h);
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#ff0000';;
		ctx.stroke();
		ctx.closePath();
	}
}

function hideImage(){
	$('canvas').clearCanvas();
	$('canvas').on("mousedown",mouseHandler);
}

function playImage(){
	$.ajax({
	    url: '/getImg',
	    type: 'GET',
	    data: {ID:(idx%5)+1},
	    success: function(res) {
	        console.log(res);
	        var imgObj = JSON.parse(res);
	        img.src = imgObj.URL; // changing img.src will trigger img load event which in turn will call function fillCanvas to draw the image
	    },
	    error: function(error) {
	        console.log(error);
	    }
	});
	setTimeout(hideImage,3000);
}

var mouseHandler = function(event){
	if (iniMouse){
		iniRect(event);
		iniMouse = !iniMouse;
	} else {
		iniAdjustRect();
	}
}

function iniRect(event){
	iniPos = getMousePos(window.event);
	finalPos = iniPos;
	$('canvas').on("mousemove",drawRect);
	$('canvas').on("mouseup",finishRect);
}

var drawRect = function(){
	finalPos = getMousePos(window.event);
	fillCanvas(false,true); // draw rectangle only (hiding image)
}

function iniAdjustRect() {
	var clickPos = getMousePos(window.event);
	adjustDirection = '';
	var nearLeft = clickPos.y >= iniPos.y &&
					clickPos.y <= finalPos.y &&
					 (Math.abs(clickPos.x-iniPos.x) <= offRange);
	var nearUp = clickPos.x >= iniPos.x &&
					clickPos.x <= finalPos.x &&
					Math.abs(clickPos.y-iniPos.y) <= offRange;
	var nearRight = clickPos.y >= iniPos.y &&
					clickPos.y <= finalPos.y &&
					Math.abs(clickPos.x-finalPos.x) <= offRange;
	var nearDown = clickPos.x >= iniPos.x &&
					clickPos.x <= finalPos.x &&
					Math.abs(clickPos.y-finalPos.y) <= offRange;


	if (nearUp){
		adjustDirection += 'U';
		iniPos.y = clickPos.y;
	} else if (nearDown){
		adjustDirection += 'D';
		finalPos.y = clickPos.y;
	}

	if (nearLeft){
		adjustDirection += 'L';
		iniPos.x = clickPos.x;
	} else if (nearRight){
		adjustDirection += 'R';
		finalPos.x = clickPos.x;
	}

	fillCanvas(true,true); // show both image and rectangle
	$('canvas').on("mousemove",adjustRect);
	$('canvas').on("mouseup",finishAdjustRect);
}

var adjustRect = function() {
	var clickPos = getMousePos(window.event);
	for(i=0; i<adjustDirection.length; i++){
		switch (adjustDirection.charAt(i)){
			case 'L':
				iniPos.x = clickPos.x;
				break;
			case 'U':
				iniPos.y = clickPos.y;
				break;
			case 'R':
				finalPos.x = clickPos.x;
				break;
			case 'D':
				finalPos.y = clickPos.y;
				break;
			default: 
				return;
		}	
	}
	
	fillCanvas(true,true); // draw both image and rectangle
}

var finishAdjustRect = function(){
	$('canvas').off("mousemove",adjustRect);
}

function finishRect(){
	var x_left = Math.min(iniPos.x, finalPos.x);
	var x_right = Math.max(iniPos.x,finalPos.x);
	var y_up = Math.min(iniPos.y, finalPos.y);
	var y_down = Math.max(iniPos.y, finalPos.y);

	iniPos.x = x_left;
	iniPos.y = y_up;
	finalPos.x = x_right;
	finalPos.y = y_down;

	console.log(iniPos.x, iniPos.y, finalPos.x, finalPos.y);

	fillCanvas(true,true); // draw both image and rectangle
	$('canvas').off("mousemove",drawRect);
	$('canvas').off("mouseup",finishRect);
}
function getMousePos(evt) {
	var canvas = document.getElementById("myCanvas");
	var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
	}
}

// catch events
$(document).ready(function(){
	playImage();
	$('#btnNext').click(function(){
		idx = idx+1;
		iniMouse = true;
		$('canvas').off("mousedown",mouseHandler);
		$('canvas').off("mouseup",finishAdjustRect);
		$('canvas').off("mouseup",finishRect);
		playImage();
	});
});


