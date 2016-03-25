var iniPos;
		var finalPos;
		var interval;
		var img1 = new Image();
		var img2 = new Image();
		var Imgs = ["Img1.jpg","Img2.jpg","Img3.jpg","Img4.jpg","Img5.jpg","Img6.jpg","Img7.jpg","Img8.jpg"];
		var src2 = "http://img02.deviantart.net/5f01/i/2010/023/1/8/blank_paper_by_montroytana.jpg";
		var idx = 0;
		var iniMouse = true;
		function keyHandler(event){
			if (event.keyCode == 13) {
				showImage();
			}
		}
		function nextImage(){
			idx = idx + 1;
			showImage();
		}
		function showImage(){
			var canvas = document.getElementById("myCanvas");
			img1.src = "../static/imgs/" + Imgs[idx%8];
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
		
		function drawRect(){
			var canvas = document.getElementById("myCanvas");
			var ctx = canvas.getContext("2d");
			ctx.clearRect(0,0,ctx.width,ctx.height);
			finalPos = getMousePos(canvas,window.event);
			w = finalPos.x - iniPos.x;
			h = finalPos.y - iniPos.y;	
			drawImage(img2);
			ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
			ctx.fillRect(iniPos.x,iniPos.y,w,h);
		}
		function mouseHandler(event){
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
			var canvas = document.getElementById("myCanvas");
			var ctx = canvas.getContext("2d");
			iniPos = getMousePos(canvas, event);
			finalPos = iniPos;
			canvas.onmousemove=drawRect;
			//ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
			//ctx.fillRect(iniPos.x, iniPos.y,0,0);
		}
		function finishRect(){
			var canvas = document.getElementById("myCanvas");
			canvas.onmousemove=null;
			var ctx = canvas.getContext("2d");
			ctx.clearRect(0,0,ctx.width,ctx.height);
			//img1.src = "Imgs/" + Imgs[idx];
			drawImage(img1);
			w = finalPos.x - iniPos.x;
			h = finalPos.y - iniPos.y;
			ctx.beginPath();	
			ctx.rect(iniPos.x,iniPos.y,w,h);
			ctx.stroke();
			ctx.closePath();
			idx = idx+1;
		}
		function getMousePos(canvas, evt) {
	        var rect = canvas.getBoundingClientRect();
	        return {
	          x: evt.clientX - rect.left,
	          y: evt.clientY - rect.top
        	}
      }