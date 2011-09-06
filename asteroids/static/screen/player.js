var Player = function(id){
	var self = this;
	self.id = id;
	self.x = 20;
	self.y = 20;
	self.xVel = 0;
	self.yVel = 0;
	self.thrustVel = 0
	self.maxVel = 2;
	self.friction = 0.98;
	self.rotVel = 0;
	self.defaultSize = 10;
	self.taggedSize = 20;
	self.speed = 0.5;
	self.rotSpeed = 3;
	self.color = 0;
	self.width = 10;
	self.height = 30;
	self.angle = 0;
	
	self.init = function(){
		self.setSize(self.defaultSize);
		self.setColor(random_color("hex"));
		
	}
	
	self.update = function(){
		self.calculateRotation();
		self.calculateMovement();
	
		//draw the player triangle
		getCanvas().fillStyle = self.color;
		var points = self.getTrianglePoints()
		getCanvas().beginPath();
		
		getCanvas().moveTo(self.x + (points[0].x * self.width), self.y + (points[0].y * self.width));
		getCanvas().lineTo(self.x + (points[1].x * self.width), self.y + (points[1].y * self.width));
		getCanvas().lineTo(self.x + (points[2].x * self.width), self.y + (points[2].y * self.width));
		
		getCanvas().closePath();
		getCanvas().fill();
		
		getCanvas().strokeStyle = "#000";
		//draw a central dot
		getCanvas().strokeRect(self.x,self.y,3,3);
		//draw a direction pointer dot
		var directionDot = getPointOnCircle(self.angle);
		getCanvas().strokeRect(self.x + (directionDot.x * 40) ,self.y + (directionDot.y * 40),3,3);
		
	}
	
	self.processMessage = function(message){
		directionKeys = ['l', 'L', 'r', 'R', 'u', 'U', 'd', 'D'];
		if ($.inArray(message[0], directionKeys > 0)) {
			self.processKeyPress(message[0]);
		}
		
	}
	
	self.processKeyPress = function(key){
		//if l or r, rotate
		if (key == "L") {
			self.rotVel -= 1;
		} else  if (key == "l") {
			self.rotVel += 1;
		} else if (key == "R") {
			self.rotVel += 1;
		} else if (key == "r") {
			self.rotVel -= 1;
		}
		
		//if u or d, move forward, backwards
		if (key == "U") {
			self.thrustVel += 1;
		} else if (key == "u") {
			self.thrustVel -= 1;
		} else if (key == "D") {
			self.thrustVel -= 1;
		} else  if (key == "d") {
			self.thrustVel += 1;
		}
	}
	
	self.calculateMovement = function(){
		var newHeading = getPointOnCircle(self.angle);
		
		self.xVel += self.thrustVel * self.speed * newHeading.x;
		self.yVel += self.thrustVel * self.speed * newHeading.y;
		
		//limit x and y vel if necessary
		if (self.xVel > self.maxVel) self.xVel = self.maxVel;
		else if (self.xVel < -self.maxVel) self.xVel = -self.maxVel;
		if (self.yVel > self.maxVel) self.yVel = self.maxVel;
		else if (self.yVel < -self.maxVel) self.yVel = -self.maxVel;
		
		//slow down due to friction
		self.xVel = self.xVel * self.friction;
		self.yVel = self.yVel * self.friction;
		
		
		var newX = self.x + self.xVel;
		var newY = self.y + self.yVel;
		
		
		//check if still in the bounds of the game screen
		if (newX < 0) 
			newX = 0;
		if (newY < 0) 
			newY = 0;
		if (newX > game.screenWidth - self.width) 
			newX = game.screenWidth - self.width;
		if (newY > game.screenHeight - self.height) 
			newY = game.screenHeight - self.height;
		
		//return whether or not the sprite moved
		if ((newX == self.x) && (newY == self.y)) {
			return false;
		}
		else {
			self.y = newY;
			self.x = newX;
			return true;
		}
	}
	
	self.calculateRotation = function(){
		self.angle += self.rotVel * self.rotSpeed;
	}
	
	self.setSize = function(size){
		self.width = size;
		self.height = size;
	}
	
	self.setRotation = function(angle){
		var value = "rotate(" + angle + "deg)";
		$("#player" + self.id).css("-webkit-transform", value);
	}
	
	self.getSprite = function(){
		return $("#player" + self.id)[0].style;
	}
	
	self.setColor = function(hexColor){
		self.color = hexColor;
		self.sendMessage("color_" + self.color);
	}
	
	self.getRect = function(){
		return {
			"x": self.x,
			"y": self.y,
			"width": self.width,
			"height": self.height
		}
	}
	
	self.getTrianglePoints = function(){
		return [getPointOnCircle(self.angle),
				 getPointOnCircle(self.angle + 120),
				 getPointOnCircle(self.angle + 240)];
		
	}
	
	self.sendMessage = function(message){
		s.send("p_" + self.id + "_" + message)
	}
	
	
	
	
	self.init();
	
}
