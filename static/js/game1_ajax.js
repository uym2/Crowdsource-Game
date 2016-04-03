var Imgs = ["Img1.jpg","Img2.jpg","Img3.jpg","Img4.jpg"];
var idx = 0;
var blank = "http://img02.deviantart.net/5f01/i/2010/023/1/8/blank_paper_by_montroytana.jpg";
var iniPos;
var finalPos;
var iniMouse = true;
var offRange = 5; // allow 5 pixel around rectangle edges for adjustRect
var adjustPlace;

var scoreText = "Score: 50";
var scorePos = {x:300,y:60};
var imgPos = {x:0,y:0};

var img = new Image();
img.addEventListener("load", function() {
	var canvas = document.getElementById("imgCanvas");
	imgPos.x = Math.floor((canvas.width-img.width)/2);
	imgPos.y = 100;
	fillCanvas(true,false,true); // draw image only
});

function fillCanvas(hasImg,hasRect,hasScore){ // the only function that actually draw things
	var canvas = document.getElementById("imgCanvas");
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#ff0000';
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	if (hasImg){ // draw image
		ctx.drawImage(img,imgPos.x, imgPos.y,img.width,img.height);
	}
	if (hasRect){ // draw rectangle
		w = finalPos.x - iniPos.x;
		h = finalPos.y - iniPos.y;	
		ctx.beginPath();	
		ctx.rect(iniPos.x,iniPos.y,w,h);
		ctx.stroke();
		ctx.closePath();
	}
	if (hasScore){
		ctx.font = "30px Arial";
		ctx.strokeText(scoreText,scorePos.x,scorePos.y);
	}
}

function hideImage(){
	fillCanvas(false,false,true);
	$('#imgCanvas').on("mousedown",mouseHandler);
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
		//iniMouse = !iniMouse;
	} else {
		iniAdjustRect();
	}
}

function iniRect(event){
	var clickPos = getMousePos(window.event);
	if (validImgPos(clickPos)){
		iniPos = clickPos;
		iniMouse = false;
		$('#imgCanvas').on("mousemove",drawRect);
		$('#imgCanvas').on("mouseup",finishRect);
	}
}

var drawRect = function(){
	var clickPos = getMousePos(window.event);
	if (validImgPos(clickPos)){
		finalPos = clickPos;
	}
	else{
		if (clickPos.x<imgPos.x){
			finalPos.x = imgPos.x;
		} else if (clickPos.x>imgPos.x+img.width){
			finalPos.x = imgPos.x+img.width;
		}
		if (clickPos.y<imgPos.y){
			finalPos.y = imgPos.y;
		} else if (clickPos.y>imgPos.y+img.height){
			finalPos.y = imgPos.y+img.height;
		}
	}
	fillCanvas(false,true,true); // draw rectangle only (hiding image)
}

function iniAdjustRect() {
	var clickPos = getMousePos(window.event);
	if (validImgPos(clickPos)){
		adjustPlace = '';
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
			adjustPlace += 'U';
			iniPos.y = clickPos.y;
		} else if (nearDown){
			adjustPlace += 'D';
			finalPos.y = clickPos.y;
		}

		if (nearLeft){
			adjustPlace += 'L';
			iniPos.x = clickPos.x;
		} else if (nearRight){
			adjustPlace += 'R';
			finalPos.x = clickPos.x;
		}

		fillCanvas(true,true,true); // show both image and rectangle
		$('#imgCanvas').on("mousemove",adjustRect);
		$('#imgCanvas').on("mouseup",finishAdjustRect);
	}
}

var adjustRect = function() {
	var clickPos = getMousePos(window.event);
	for(i=0; i<adjustPlace.length; i++){
		switch (adjustPlace.charAt(i)){
			case 'L':
				if (clickPos.x<imgPos.x){
					iniPos.x = imgPos.x;
				} else if (clickPos.x>finalPos.x){
					iniPos.x = finalPos.x;
				} else{
					iniPos.x = clickPos.x;
				}
				break;
			case 'U':
				if (clickPos.y<imgPos.y){
					iniPos.y = imgPos.y;
				} else if (clickPos.y>finalPos.y){
					iniPos.y = finalPos.y;
				} else {
					iniPos.y = clickPos.y;
				}
				break;
			case 'R':
				if (clickPos.x>imgPos.x+img.width){
					finalPos.x = imgPos.x+img.width;
				} else if (clickPos.x<iniPos.x){
					finalPos.x = iniPos.x;
				} else {
					finalPos.x = clickPos.x;
				}
				break;
			case 'D':
				if (clickPos.y>imgPos.y+img.height){
					finalPos.y = imgPos.y+img.height;
				} else if (clickPos.y<iniPos.y){
					finalPos.y = iniPos.y;
				} else {
					finalPos.y = clickPos.y;
				}
				break;
			default: 
				return;
		}	
	}
	
	fillCanvas(true,true,true); // draw both image and rectangle
}

var finishAdjustRect = function(){
	$('#imgCanvas').off("mousemove",adjustRect);
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

	fillCanvas(true,true,true); // draw both image and rectangle
	$('#imgCanvas').off("mousemove",drawRect);
	$('#imgCanvas').off("mouseup",finishRect);
}
function getMousePos(evt) {
	var canvas = document.getElementById("imgCanvas");
	var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
	}
}

function canv2imgPos(canvPos){ // canvPos can be iniPos, finalPos, or any point in canvas
	return {
		x: canvPos.x - imgPos.x,
		y: canvPos.y - imgPos.y
	}
}

function validImgPos(canvPos){
	return (canvPos.x>imgPos.x && canvPos.x<(imgPos.x+img.width) &&
			canvPos.y>imgPos.y && canvPos.y<(imgPos.y+img.height));
}

// catch events
$(document).ready(function(){
	playImage();
	$('#btnNext').click(function(){
		var iniPos_img = canv2imgPos(iniPos);
		var finalPos_img = canv2imgPos(finalPos);
		console.log(iniPos_img.x, finalPos_img.x, iniPos_img.y, finalPos_img.y);
		idx = idx+1;
		iniMouse = true;
		$('#imgCanvas').off("mousedown",mouseHandler);
		$('#imgCanvas').off("mouseup",finishAdjustRect);
		$('#imgCanvas').off("mouseup",finishRect);
		playImage();
	});
});


