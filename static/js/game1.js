var Imgs = ["Img1.jpg","Img2.jpg","Img3.jpg","Img4.jpg"];
var idx = 0;
var blank = "http://img02.deviantart.net/5f01/i/2010/023/1/8/blank_paper_by_montroytana.jpg";
var iniPos;
var finalPos;
var iniMouse = true;
var currImg = function() {
		return "../static/imgs/" + Imgs[idx%4];
	};
var img = new Image();

$(document).ready(function(){
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	playImage();
	$('#btnNext').click(function(){
		idx = idx+1;
		playImage();
	});
	$('canvas').mousedown(function(){
		mouseHandler(window.event);
	})

	function showImage(imgSource){
		$('canvas').clearCanvas();
		$('canvas').drawImage({
			source: imgSource,
			sx: 0,
			sy: 0,
			sWidth: 1390,
			sHeight:800,
			cropFromCenter: false
	});
	}

	function hideImage(){
		showImage(blank);
	}

	function playImage(){
		showImage(currImg());
		setTimeout(hideImage,3000);
	}

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

	function iniRect(event){
		iniPos = getMousePos(window.event);
		finalPos = iniPos;
		$('canvas').on("mousemove",drawRect);
	}

	var drawRect = function(){
		ctx.clearRect(0,0,ctx.width,ctx.height);
		showImage(blank);

		finalPos = getMousePos(window.event);
		w = finalPos.x - iniPos.x;
		h = finalPos.y - iniPos.y;	
		ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
		ctx.fillRect(iniPos.x,iniPos.y,w,h);
	}

	function finishRect(){
		ctx.clearRect(0,0,ctx.width,ctx.height);
		$('canvas').off("mousemove",drawRect);
		showImage(currImg());
		w = finalPos.x - iniPos.x;
		h = finalPos.y - iniPos.y;
		ctx.beginPath();	
		ctx.rect(iniPos.x,iniPos.y,w,h);
		ctx.stroke();
		ctx.closePath();
	}
	function getMousePos(evt) {
		var rect = canvas.getBoundingClientRect();
	    return {
	      x: evt.clientX - rect.left,
	      y: evt.clientY - rect.top
		}
	}
});


