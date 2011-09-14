var keyDownColor = "#ccc";
var keyUpColor = "#fff";

$(document).ready(function () {
    s = new io.Socket(window.location.hostname, {port: 8001, rememberTransport: false, resource: 'input',});
    s.connect();

    s.addEvent('connect', function() {
        s.send('New participant joined');
    });
	
	s.addEvent('message', function(data) {
		if (data) {
			console.log("message: " + data);
			
			var message = data.split("_");
			if (message[0] == "color") {
				$("#indicator").css("background-color",message[1]);
			} 
		}
	});
	configureKeypad();
	
	configureForMobiles();
	
});

function configureKeypad(){
	//check if a keydown is real is just a repeated key
	lDown = false;
	rDown = false;
	uDown = false;
	dDown = false;
	
	$('#left').mousedown(function(){
		lKeyDown();
	});
	$('#left').mouseup(function(){
		lKeyUp();
	});
	$('#right').mousedown(function(){
		rKeyDown();
	});
	$('#right').mouseup(function(){
		rKeyUp();
	});
	$('#up').mousedown(function(){
		uKeyDown();
	});
	$('#up').mouseup(function(){
		uKeyUp();
	});
	$('#down').mousedown(function(){
		dKeyDown();
	});
	$('#down').mouseup(function(){
		dKeyUp();
	});
	
	//if the mouse moves off the button, count it as releasing it
	$('#left').mouseout(function(){
		lKeyUp();
	});
	$('#right').mouseout(function(){
		rKeyUp();
	});
	$('#up').mouseout(function(){
		uKeyUp();
	});
	$('#down').mouseout(function(){
		dKeyUp();
	});
	
	
	
	$(document).keydown(function(event){
	    switch (event.keyCode) {
	        case 37:
				lKeyDown();
	            break
	        case 38:
				uKeyDown();
	            break;
	        case 39:
				rKeyDown();
	            break;
	        case 40:
				dKeyDown();
	            break;
   }});
   $(document).keyup(function(event){
	    switch (event.keyCode) {
	       	case 37:
				lKeyUp();
	            break
	        case 38:
				uKeyUp();
	            break;
	        case 39:
				rKeyUp();
	            break;
	        case 40:
				dKeyUp();
	            break;
   }});

}

function lKeyDown() {
	if (!lDown) {
		$('#left').addClass("down");
		s.send('L');
		lDown = true;
	}
}
function lKeyUp() {
	if (lDown) {
		$('#left').removeClass("down");
		s.send('l');
		lDown = false;
	}
}


function rKeyDown() {
	if (!rDown) {
		$('#right').addClass("down");
		s.send('R');
		rDown = true;
	}
}
function rKeyUp() {
	if (rDown) {
		$('#right').removeClass("down");
		s.send('r');
		rDown = false;
	}
}

function uKeyDown() {
	if (!uDown) {
		$('#up').addClass("down");
		s.send('U');
		uDown = true;
	}
}
function uKeyUp() {
	if (uDown) {
		$('#up').removeClass("down");
		s.send('u');
		uDown = false;
	}
}

function dKeyDown() {
	if (!dDown) {
		$('#down').addClass("down");
		s.send('D');
		dDown = true;
	}
}
function dKeyUp() {
	if (dDown) {
		$('#down').removeClass("down");
		s.send('d');
		dDown = false;
	}
}






// pinched from http://ross.posterous.com/2008/08/19/iphone-touch-events-in-javascript/
// iphone doesn't do mouseUp/down in a sensible way, so fake them from touch events
function touchHandler(event){
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
         switch(event.type)
    {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type="mousemove"; break;        
        case "touchend":   type="mouseup"; break;
        default: return;
    }

    //initMouseEvent(type, canBubble, cancelable, view, clickCount, 
    //           screenX, screenY, clientX, clientY, ctrlKey, 
    //           altKey, shiftKey, metaKey, button, relatedTarget);
    
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                              first.screenX, first.screenY, 
                              first.clientX, first.clientY, false, 
                              false, false, false, 0/*left*/, null);
    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function configureForMobiles(){
	document.body.style.webkitTouchCallout='none';
	document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);   
}


