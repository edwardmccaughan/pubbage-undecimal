
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
			} else if (message[0] == "quit") {
				game.removePlayer(message[1]);
			} else if (message[0] == "m") {
				//pass the message to the player object to handle
				var playerId = message[1];
				game.currentPlayers[playerId].processMessage(message.slice(2))
			}
			
			
			//put whatever data was recieved into a div for debug
			$("#xvalue").html(data);
			
		}
    });
	game.init();
	setInterval(game.mainLoop, 15);
});

Game  = function() {
	var self = this;
	self.currentPlayers = {};
	
	self.screenWidth = 700;
	self.screenHeight = 500;
	self.taggedPlayer = undefined;
	self.lastTaggedPlayer = undefined;

	self.addNewPlayer = function(playerID){
		self.currentPlayers[playerID] = new Player(playerID);
		if (self.taggedPlayer === undefined) {
			self.tagPlayer(self.currentPlayers[playerID]);
		}
	}
	self.removePlayer = function (playerID) {
		delete self.currentPlayers[playerID];
		
		//if player is the tagged player, tag the first player remaining
		/*if (self.taggedPlayer.id == playerID){
			self.taggedPlayer = undefined;			for (var first in self.currentPlayers) break;
			self.tagPlayer(self.currentPlayers[first])
		}*/
	}
	self.tagPlayer = function(player){
		//remove tag from previous player, if it exists
		if (self.taggedPlayer != undefined) 
		{
			self.lastTaggedPlayer = self.taggedPlayer;
			if (self.lastTaggedPlayer != undefined) {
				self.lastTaggedPlayer.setSize(self.lastTaggedPlayer.defaultSize)
			}
		}
		//tag new player
		self.taggedPlayer = player;
		player.setSize(player.taggedSize);
	
	}
	
	self.checkTagCollision = function (){
		for (player in self.currentPlayers){
			var isTaggedPlayer = false;
			var isLastTaggedPlayer = false;
			if (self.taggedPlayer != undefined) {
				isTaggedPlayer = (self.currentPlayers[player].id == self.taggedPlayer.id);
			}
			if (self.lastTaggedPlayer != undefined) {
				isLastTaggedPlayer = (self.currentPlayers[player].id == self.lastTaggedPlayer.id);
			}
			if ((!isTaggedPlayer) && (!isLastTaggedPlayer)) {
				
				if (colSprites(self.currentPlayers[player], self.taggedPlayer)) {
					self.tagPlayer(self.currentPlayers[player])
				}
			}
		}                           
	}
	
	self.mainLoop = function() {
		getCanvas().fillStyle = "#FFFFFF";
		getCanvas().fillRect(0,0,self.screenWidth,self.screenHeight);
		for (playerId in self.currentPlayers) {
			self.currentPlayers[playerId].update();
		}
		self.checkTagCollision();
	}
	
	self.setScreenSize = function(width, height) {
		self.screenWidth = width;
		self.screenHeight = height
		//$("#screen").width(width);
		//$("#screen").height(height);
		$('#screen').attr("width",width);
		$('#screen').attr("height",height);
	}
	self.init = function() {
		self.setScreenSize( self.screenWidth, self.screenHeight);
	}
}


game = new Game();







