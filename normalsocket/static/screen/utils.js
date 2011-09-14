// @format (hex|rgb|null) : Format to return, default is integer
function random_color(format) {
	var rint = Math.round(0xffffff * Math.random());
	switch(format)
	{
		case 'hex':
			return ('#0' + rint.toString(16)).replace(/^#0([0-9a-f]{6})$/i, '#$1');
			break;
		
		case 'rgb':
			return 'rgb(' + (rint >> 16) + ',' + (rint >> 8 & 255) + ',' + (rint & 255) + ')';
		break;
		
		default:
			return rint;
			break;
	}
}

function colSprites(sprite1, sprite2){
	var rect1 = sprite1.getRect();
	var rect2 = sprite2.getRect();
	return colRect(rect1.x, rect1.y, rect1.width, rect1.height, rect2.x, rect2.y, rect2.width, rect2.height);
}

function colRect(x1,y1,w1,h1,x2,y2,w2,h2){
	if ((x2 > x1 + w1) ||
		(x2 + w2 < x1) ||
		(y2 > y1 + h1) ||
		(y2 + h1 < y1))	{
    		return false;
	} else {
    	return true;
	}
}

var canvas = 0
function getCanvas() {
	if (canvas == 0) {
		var drawingCanvas = document.getElementById('screen');
		canvas = drawingCanvas.getContext('2d');
	}
	return canvas;
}

//canvas arcs start from the center of the circle, not the top left like a rect
//so convert a rect to a centre point
function getArcRect(x, y, width, height){
	return {
		x : x + width / 2,
		y : y + height / 2,
		width : width / 2,
		height : height /2
	}
}
function sinDeg(angle) {
	return Math.sin(angle * Math.PI/180);
}

function cosDeg(angle) {
	return Math.cos(angle * Math.PI/180);
}

function getPointOnCircle(angle) {
	return {
		x: cosDeg(angle),
		y: sinDeg(angle)
	}
}
