var iniPos;
var finalPos;
var interval;
var img1 = new Image();
var img2 = new Image();
var Imgs = ["Img1.jpg","Img2.jpg","Img3.jpg","Img4.jpg","Img5.jpg","Img6.jpg","Img7.jpg","Img8.jpg"];
var src2 = "http://img02.deviantart.net/5f01/i/2010/023/1/8/blank_paper_by_montroytana.jpg";
var idx = 0;
var iniMouse = true;

// Event Utility for handling cross-browser
var EventUtil = {
	addHandler: function(element, type, handler) {
		if (element.addEventListener){
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		} else {
			element ["on" + type] = handler;
		}
	},

	removeHandler: function(element, type, handler) {
		if (element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		} else if (element.detachEvent) {
			element.detachEvent("on" + type, handler);
		} else {
			element["on" + type] = null;
		}
	}
};


// Play button
var btnPlayHandler = function(){
		showImage();
		document.getElementById("btnPlay").disabled = true;
}

var btnPlay = document.getElementById("btnPlay");

EventUtil.addHandler(btnPlay,"click",btnPlayHandler);

// Handler for Next button
var btnNextHandler = function(){
	idx = idx+1;
	showImage();
	console.log(idx);
}

var btnNext = document.getElementById("btnNext");

EventUtil.addHandler(btnNext,"click",btnNextHandler);

function showImage(){
	//var canvas = document.getElementById("myCanvas");
	//var ctx = canvas.getContext("2d");
	//ctx.clearRect(0,0,ctx.width,ctx.height);
	img1.src = "../static/imgs/" + Imgs[idx%4];
	console.log(img1.src);
	drawImage(img1);
	setTimeout(hideImage,3000);
}
function hideImage(){
	img2.src = src2;
	drawImage(img2);
}
function drawImage(img){
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img,0,0,canvas.width,canvas.height);
}

// Handler for start drawing rectangle
var mouseHandler = function(event){
	if (iniMouse){
		iniRect(event);
		iniMouse = false;
	}
	else{
		finishRect();
		iniMouse = true;
	}
}

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

EventUtil.addHandler(canvas,"mousedown",mouseHandler);

function iniRect(event){
	iniPos = getMousePos(canvas, event);
	finalPos = iniPos;
	EventUtil.addHandler(canvas,"mousemove",drawRect);
	//ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
	//ctx.fillRect(iniPos.x, iniPos.y,0,0);
}

var drawRect = function(){
	ctx.clearRect(0,0,ctx.width,ctx.height);
	finalPos = getMousePos(canvas,window.event);
	w = finalPos.x - iniPos.x;
	h = finalPos.y - iniPos.y;	
	drawImage(img2);
	ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
	ctx.fillRect(iniPos.x,iniPos.y,w,h);
}

function finishRect(){
	EventUtil.removeHandler(canvas,"mousemove",drawRect);
	ctx.clearRect(0,0,ctx.width,ctx.height);
	//img1.src = "Imgs/" + Imgs[idx];
	drawImage(img1);
	w = finalPos.x - iniPos.x;
	h = finalPos.y - iniPos.y;
	ctx.beginPath();	
	ctx.rect(iniPos.x,iniPos.y,w,h);
	ctx.stroke();
	ctx.closePath();
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
	}
}