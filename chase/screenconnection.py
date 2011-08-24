import tornadio
import logging


class ScreenConnection(tornadio.SocketConnection):
    screens = set()
    
    def on_open(self, *args, **kwargs):
        self.screens.add(self)
        for player in PlayerConnection.players:
            player.notifyScreensOfJoin()
            player.notifyScreensOfLocation()
            
        self.screenWidth = 400;
        self.screenHeight = 300;
        self.setScreenSize();
        
    def on_close(self):
        self.screens.remove(self)
        
    def on_message(self, message):
        pass
    
    def update(self):
        self.send(ScreenConnection.x)
        
    def setScreenSize(self):
        self.send("screenW_" + str(self.screenWidth))
        self.send("screenH_" + str(self.screenHeight))
        
    #there may be several screens connected to the server, so let other things
    #send a message to them all at once
    @staticmethod
    def notifyScreens(message):
        for screen in ScreenConnection.screens:
            screen.send(message)
            

from playerconnection import PlayerConnection
from game import Game