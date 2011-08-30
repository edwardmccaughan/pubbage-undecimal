var Player = function(id) {
	var self = this;
	self.id = id;
	self.x = 0;
	self.y = 0;
	self.yVel = 0;
	self.xVel = 0;
	self.defaultSize = 30
    self.taggedSize = 60
	self.speed = 3;
	self.color = 0;
	
	self.init = function () {
		$("#screen").append('<div class="player" id="player' + self.id + '"></div>')
		self.setSize(self.defaultSize);
		
		self.color = random_color("hex");
		$("#player" + self.id).css("background-color" , self.color);
		self.sendMessage("color_"+self.color);
	}
	
	self.update = function() {
		if (self.calculateMovement()) {
			self.getSprite().left = self.x  + "px";
			self.getSprite().top = self.y + "px";
		}
	}
	
	self.processMessage = function(message){
		directionKeys = ['l','L','r','R','u','U','d','D'];
		if ($.inArray(message[0], directionKeys > 0)) {
			self.processKeyPress(message[0]);
		}
		
	}
	
	self.processKeyPress = function(key) {
		if (key == "L") {
            self.xVel-=1;
		} else if (key == "l") {
            self.xVel+=1;
		} else if (key == "R") {
            self.xVel+=1;
		} else if (key == "r") {
            self.xVel-=1;
        } else if (key == "U") {
            self.yVel-=1;
        } else if (key == "u") {
            self.yVel+=1;
        } else if (key == "D") {
            self.yVel+=1;
        } else if (key == "d") {
            self.yVel-=1;
		}
	}
	
	self.calculateMovement = function() {
        var newX = self.x + self.xVel * self.speed
        var newY = self.y + self.yVel * self.speed
        if (newX < 0) newX = 0
        if (newY < 0) newY = 0
        if (newX > game.screenWidth - self.width) newX = game.screenWidth - self.width
        if (newY > game.screenHeight - self.height) newY = game.screenHeight - self.height
            
        if ((newX == self.x) && (newY == self.y)) {
			return false
		} else {
			self.y = newY
			self.x = newX
			return true
		}
	}
	self.setSize = function(size){
		self.width = size;
		self.height = size;
		self.getSprite().width = size + "px";
		self.getSprite().height = size + "px";
		$("#player" + self.id).css("border-radius" , size);
		
	}
	self.getSprite = function(){
		return $("#player" + self.id)[0].style;
	}
	self.getRect = function() {
		return {"x" : self.x,
				"y": self.y,
				"width" : self.width,
				"height" : self.height}
	}
	self.sendMessage = function(message){
		s.send("p_" + self.id + "_" + message)
	}
	
	
	self.init();
	
}
