import tornadio
import logging

class PlayerConnection(tornadio.SocketConnection):
    players = []
    playerCount = 0
    
    #on connect, set up players variables and tell the screens to display it
    def on_open(self, *args, **kwargs):
        logging.getLogger().debug("connection opened")
        self.players.append(self)
        self.id =  PlayerConnection.playerCount
        PlayerConnection.playerCount+=1  
        self.x = 0
        self.y = 0
        self.xVel = 0
        self.yVel = 0
        self.defaultSize = 10
        self.taggedSize = 20
        self.speed = 2
        self.notifyScreensOfJoin()
        self.setSize(self.defaultSize)
        if not Game.game.taggedPlayer:
            Game.game.tagPlayer(self)
        

    def on_message(self, message):
        if (message == "L"):
            self.xVel-=1
        elif (message == "l"):
            self.xVel+=1
        elif (message == "R"):
            self.xVel+=1
        elif (message == "r"):
            self.xVel-=1
        elif (message == "U"):
            self.yVel-=1
        elif (message == "u"):
            self.yVel+=1
        elif (message == "D"):
            self.yVel+=1
        elif (message == "d"):
            self.yVel-=1
        
        #attempt to correct for missing keyUps
        if self.yVel > 1:
            self.yVel = 1
        elif self.yVel < -1:
            self.yVel = -1
            
        if self.xVel > 1:
            self.xVel = 1
        elif self.xVel < -1:
            self.xVel = -1
            
            
        logging.getLogger().debug("xVel:" + str(self.xVel) + ", yVel:" + str(self.yVel) + " (" + message + ")" )
        
    def update(self):
        if self.calculateMovement():
            self.notifyScreensOfLocation()
        
    def calculateMovement(self):
        newX = self.x + self.xVel * self.speed
        newY = self.y + self.yVel * self.speed
        if newX < 0:
            newX = 0
        if newY < 0:
            newY = 0
        if newX > Game.game.screenWidth - self.width:
            newX = Game.game.screenWidth - self.width
        if newY > Game.game.screenHeight - self.height:
            newY = Game.game.screenHeight - self.height
            
        if newX == self.x and newY == self.y:
            return False
        else:
            self.y = newY
            self.x = newX
            return True
        
        
    def on_close(self):
        self.players.remove(self)
        if Game.game.taggedPlayer.id == self.id and len(PlayerConnection.players):
            Game.game.tagPlayer(PlayerConnection.players[0])
        ScreenConnection.notifyScreens("quit_"+str(self.id))
            
    def notifyScreensOfLocation(self):
        ScreenConnection.notifyScreens("pos_" + str(self.id) + "_" + str(self.x) + "_"+str(self.y))

    def setSize(self, size):
        self.width = size
        self.height = size  
        ScreenConnection.notifyScreens("size_" + str(self.id) + "_" + str(self.width) + "_"+str(self.height))
        
    def notifyScreensOfJoin(self):
        ScreenConnection.notifyScreens("new_"+str(self.id))
        
from screenconnection import ScreenConnection
from game import Game