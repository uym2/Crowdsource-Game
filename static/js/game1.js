var Imgs = ["Img1.jpg","Img2.jpg","Img3.jpg","Img4.jpg"];
var idx = 0;
var blank = "http://img02.deviantart.net/5f01/i/2010/023/1/8/blank_paper_by_montroytana.jpg";
var iniPos;
var finalPos;
var iniMouse = 0;
var offRange = 5; // allow 5 pixel around rectangle edges for adjustRect
var adjustDirection;
var currImg = function() {
		return "../static/imgs/" + Imgs[idx%4];
	};
var img = new Image();
img.addEventListener("load", function() {
	var canvas = document.getElementById("myCanvas");
	canvas.width = img.width;
	canvas.height = img.height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img,0,0,canvas.width,canvas.height);
});
var imgCurrent = '';

	function showImage(imgSource){
		$('canvas').clearCanvas();
		if (imgCurrent === imgSource) {
			var canvas = document.getElementById("myCanvas");
			canvas.width = img.width;
			canvas.height = img.height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img,0,0,canvas.width,canvas.height);
		} else {
			img.src = imgSource;
		}
		imgCurrent = imgSource;
	}

	function hideImage(){
		$('canvas').clearCanvas();
		$('canvas').on("mousedown",mouseHandler);
	}

	function playImage(){
		showImage(currImg());
		setTimeout(hideImage,3000);
	}

	var mouseHandler = function(event){
		if (iniMouse == 0){
			iniRect(event);
		} else if (iniMouse == 1) {
			finishRect();
		} else if (iniMouse%2 == 0){
			iniAdjustRect();
		} else {
			$('canvas').off("mousemove",adjustRect);
			iniMouse = iniMouse + 1;
		}
	}

	function iniRect(event){
		iniPos = getMousePos(window.event);
		finalPos = iniPos;
		$('canvas').on("mousemove",drawRect);
		iniMouse = iniMouse + 1;
	}

	var drawRect = function(){
		$('canvas').clearCanvas();
		finalPos = getMousePos(window.event);
		w = finalPos.x - iniPos.x;
		h = finalPos.y - iniPos.y;	
		
		var canvas = document.getElementById("myCanvas");
		var ctx = canvas.getContext("2d");
		ctx.beginPath();	
		ctx.rect(iniPos.x,iniPos.y,w,h);
		ctx.stroke();
		ctx.closePath();
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

		iniMouse = iniMouse + 1;

		w = finalPos.x - iniPos.x;
		h = finalPos.y - iniPos.y;	

		$('canvas').clearCanvas();
		showImage(currImg());
		var canvas = document.getElementById("myCanvas");
		var ctx = canvas.getContext("2d");
		ctx.beginPath();	
		ctx.rect(iniPos.x,iniPos.y,w,h);
		ctx.stroke();
		ctx.closePath();
		$('canvas').on("mousemove",adjustRect);
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
		
		w = finalPos.x - iniPos.x;
		h = finalPos.y - iniPos.y;	

		$('canvas').clearCanvas();
		showImage(currImg());
		var canvas = document.getElementById("myCanvas");
		var ctx = canvas.getContext("2d");
		ctx.beginPath();	
		ctx.rect(iniPos.x,iniPos.y,w,h);
		ctx.stroke();
		ctx.closePath();
	}

	function finishRect(){
		$('canvas').clearCanvas();
		$('canvas').off("mousemove",drawRect);
		showImage(currImg());
	
		var x_left = Math.min(iniPos.x, finalPos.x);
		var x_right = Math.max(iniPos.x,finalPos.x);
		var y_up = Math.min(iniPos.y, finalPos.y);
		var y_down = Math.max(iniPos.y, finalPos.y);

		iniPos.x = x_left;
		iniPos.y = y_up;
		finalPos.x = x_right;
		finalPos.y = y_down;

		console.log(iniPos.x, iniPos.y, finalPos.x, finalPos.y);

		w = finalPos.x - iniPos.x;
		h = finalPos.y - iniPos.y;
		var canvas = document.getElementById("myCanvas");
		var ctx = canvas.getContext("2d");
		ctx.beginPath();	
		ctx.rect(iniPos.x,iniPos.y,w,h);
		ctx.stroke();
		ctx.closePath();
		iniMouse = iniMouse + 1;
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
	//setTimeout(playImage,0.1);
	playImage();
	$('#btnNext').click(function(){
		idx = idx+1;
		iniMouse = 0;
		$('canvas').off("mousedown",mouseHandler);
		playImage();
	});
});


