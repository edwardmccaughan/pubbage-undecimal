var currentPlayers = new Array();
$(document).ready(function () {

    s = new io.Socket(window.location.hostname, {port: 8001, rememberTransport: false, resource: 'screen',});
    s.connect();

    s.addEvent('connect', function() {
        //s.send('get_allplayers');
		
    });

   	s.addEvent('message', function(data) {
		if (data) {
			console.log("message: " + data);
			
			var message = data.split("_");
			if (message[0] == "new") {
				game.addNewPlayer(message[1]);
			}
			else if (message[0] == "quit") {
				game.removePlayer(message[1]);
			}
			else if (message[0] == "m") {
				//pass the message to the player object to handle
				var playerId = message[1]
				currentPlayers[playerId].processMessage(message.slice(2))
			}
			
			
			//put whatever data was recieved into a div for debug
			$("#xvalue").html(data);
			
		}
    });
});

Game = {
	//players are just divs with an id
	addNewPlayer: function(playerID){
		if ($.inArray(playerID, currentPlayers) < 0 ) {
			$("#screen").append('<div class="player" id="player' + message[1] + '"></div>')
			currentPlayers[playerID] = new Player();
		} else {
			console.log ("player already exists: " + playerID);
		}
	},
	removePlayer : function (playerID) {
		//figure this out later...
	},
}


