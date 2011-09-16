var keyDownColor = "#ccc";
var keyUpColor = "#fff";

$(document).ready(function () {
	startSocket();
	
	configureKeypad();
	configureForMobiles();	
	
	$("#joinbutton").mousedown(joinGame);
	
	showState("joingame");
});

function showState(state) {
	$("#joingame").css("display", "none");
	$("#waiting").css("display", "none");
	$("#controller").css("display", "none");
	$("#prepare").css("display", "none");

	if (state == "joingame") {
		$("#joingame").css("display", "block");
	} else if (state == "queued") {
		$("#waiting").css("display", "block");
	} else if (state == "prepare") {
		$("#prepare").css("display", "block");
	} else if (state == "controller") {
		$("#controller").css("display", "block");
	}
	
}
 function joinGame() {
 	var name = $('#playername').val()
	console.log(name);
 	s.send("name_" + name);
	showState("queued");
 }



function startSocket() {
	s = new io.Socket(window.location.hostname, {port: 8001, rememberTransport: false, resource: 'input',});
    s.connect();

    /*s.addEvent('connect', function() {
        s.send('New participant joined');
    });*/
	
	s.addEvent('message', function(data) {
		if (data) {
			console.log("message: " + data);
			//remove any newlines just in case
			data = data.replace("\r\n","");
			
			var message = data.split("_");
			if (message[0] == "color") {
				$("#indicator").css("background-color", message[1]);
			} else if (message[0] == "queued") {
				showState("prepare");
				countDown(message[1]);
			}else if (message[0] == "play") {
				showState("controller")
			} else if (message[0] == "gameover") {
				showState("joingame")
			}
		}
	});
	
}


function countDown(seconds) {
	$('#countdown .value').html(seconds);
	//if (seconds > 0) setTimeout("countDown("+ (seconds - 1) + ")",1000);
}



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
		console.log(event.keyCode);
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
		s.send('W');
		lDown = true;
	}
}
function lKeyUp() {
	if (lDown) {
		$('#left').removeClass("down");
		s.send('w');
		lDown = false;
	}
}


function rKeyDown() {
	if (!rDown) {
		$('#right').addClass("down");
		s.send('E');
		rDown = true;
	}
}
function rKeyUp() {
	if (rDown) {
		$('#right').removeClass("down");
		s.send('e');
		rDown = false;
	}
}

function uKeyDown() {
	if (!uDown) {
		$('#up').addClass("down");
		s.send('N');
		uDown = true;
	}
}
function uKeyUp() {
	if (uDown) {
		$('#up').removeClass("down");
		s.send('n');
		uDown = false;
	}
}

function dKeyDown() {
	if (!dDown) {
		$('#down').addClass("down");
		s.send('S');
		dDown = true;
	}
}
function dKeyUp() {
	if (dDown) {
		$('#down').removeClass("down");
		s.send('s');
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


