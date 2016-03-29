Imgs = ["Img1.jpg","Img2.jpg","Img3.jpg","Img4.jpg"];
idx = 0;

// onload
/*
$(window).load(function(){
	showImage();
});
*/
function showImage(){
	$('canvas').clearCanvas();
	$('canvas').drawImage({
		source: "../static/imgs/" + Imgs[idx%4],
		sx: 0,
		sy: 0,
		sWidth: 1390,
		sHeight:800,
		cropFromCenter: false
	});
}

$(document).ready(function(){
	showImage();
	$('#btnNext').click(function(){
		idx = idx+1;
		showImage();
		console.log(idx);
	});
});
