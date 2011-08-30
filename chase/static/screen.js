var currentPlayers = [];
$(document).ready(function () {

    s = new io.Socket(window.location.hostname, {port: 8001, rememberTransport: false, resource: 'screen',});
    s.connect();

    s.addEvent('connect', function() {
        //s.send('get_allplayers');
		
    });

   	s.addEvent('message', function(data) {
		if (data) {
			console.log("message: " + data);
			
			message = data.split("_");
			if (message[0] == "new") {
				Screen.addNewPlayer(message[1]);
			} else if (message[0] == "pos") {
				Screen.updatePlayerPos(message[1],message[2],message[3]);		
			} else if  (message[0] == "quit") {
				Screen.removePlayer(message[1]);
			} else if  (message[0] == "screenW") {
				Screen.setWidth(message[1]);
			} else if  (message[0] == "screenH") {
				Screen.setHeight(message[1]);
			} else if  (message[0] == "tag") {
				Screen.tagPlayer(message[1]);
			} else if  (message[0] == "size") {
				Screen.setPlayerSize(message[1],message[2],message[3]);
			}
			
			
			//put whatever data was recieved into a div for debug
			$("#xvalue").html(data);
			
		}
    });
	
	setInterval(self.mainLoop, 1000/self.fps);
});

Screen = {
	//players are just divs with an id
	addNewPlayer: function(playerID){
		if ($.inArray(playerID, currentPlayers) < 0 ) {
			$("#screen").append('<div class="player" id="player' + message[1] + '"></div>')
			currentPlayers.push(playerID);
		} else {
			console.log ("player already exists: " + playerID);
		}
	},
	
	//parse the player update for x and y co-ords and set the player div css to match
	updatePlayerPos : function(playerID, playerX, playerY) {
		var playerSprite = $("#player" + playerID)[0].style;
		playerSprite.left = playerX  + "px";
		playerSprite.top = playerY + "px";
		console.log("player " + playerID + " x: " + playerX);
	},
	setPlayerSize : function(playerID, playerWidth, playerheight) {
		var playerSprite = $("#player" + playerID)[0].style;
		playerSprite.width = playerWidth  + "px";
		playerSprite.height = playerheight + "px";
	},
	removePlayer : function (playerID) {
		
		var index = $.inArray(playerID, currentPlayers);
		if (index >= 0 ) {
			console.dir(currentPlayers);
			console.log("removing player " + playerID);
			$("#player"+playerID).remove();		
			currentPlayers.splice(index,1)
			console.dir(currentPlayers);
		} else {
			console.log ("player already exists: " + playerID);
		}
	},
	setWidth: function (width){
		$("#screen").css("width", width + "px");
	},
	setHeight: function (height){
		$("#screen").css("height", height + "px");
	},
	tagPlayer: function(playerID) {
		$(".player").removeClass("tagged");
		$("#player"+playerID).addClass("tagged");
	}
}


        
       
