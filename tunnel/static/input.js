
$(document).ready(function () {
    s = new io.Socket(window.location.hostname, {port: 8001, rememberTransport: false, resource: 'input',});
    s.connect();

    s.addEvent('connect', function() {
        s.send('New participant joined');
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
		s.send('L');
		lDown = true;
	});
	$('#left').mouseup(function(){
		s.send('l');
		lDown = false;
	});
	$('#right').mousedown(function(){
		s.send('R')
		rDown = true;
	});
	$('#right').mouseup(function(){
		s.send('r')
		rDown = false;
	});
	$('#up').mousedown(function(){
		s.send('U')
		uDown = true;
	});
	$('#up').mouseup(function(){
		s.send('u')
		uDown = false;
	});
	$('#down').mousedown(function(){
		s.send('D')
		dDown = true;
	});
	$('#down').mouseup(function(){
		s.send('d')
		dDown = false;
	});
	
	//if the mouse moves off the button, count it as releasing it
	$('#left').mouseout(function(){
		if (lDown) {
			s.send('l');
			lDown = false;
		}
	});
	$('#right').mouseout(function(){
		if (rDown) {
			s.send('r');
			rDown = false;
		}
	});
	$('#up').mouseout(function(){
		if (uDown) {
			s.send('u');
			uDown = false;
		}
	});
	$('#down').mouseout(function(){
		if (dDown) {
			s.send('d');
			dDown = false;
		}
	});
	
	
	
	$(document).keydown(function(event){
	    switch (event.keyCode) {
	        case 37:
				if (!lDown) {
					s.send('L')
					lDown = true;
				}
	            break
	        case 38:
				if (!uDown) {
					s.send('U')
					uDown = true;
				}
	            break;
	        case 39:
				if (!rDown) {
					s.send('R')
					rDown = true;
				}
	            break;
	        case 40:
				if (!dDown) {
					s.send('D')
					dDown = true;
				}
	            break;
   }});
   $(document).keyup(function(event){
	    switch (event.keyCode) {
	        case 37:
	            s.send('l')
				lDown = false;
	            break
	        case 38:
	            s.send('u')
				dDown = false;
	            break;
	        case 39:
	            s.send('r')
				rDown = false;
	            break;
	        case 40:
	            s.send('d')
				dDown = false;
	            break;
   }});

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


