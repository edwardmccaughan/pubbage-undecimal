import tornadio
import logging


class ScreenConnection(tornadio.SocketConnection):
    screens = set()
    
    def on_open(self, *args, **kwargs):
        self.screens.add(self)
        for player in PlayerConnection.players:
            player.notifyScreensOfJoin()
            #player.notifyScreensOfLocation()
        
    def on_close(self):
        self.screens.remove(self)
        
    def on_message(self, message):
        messageSplit = message.split("_")
        if messageSplit[0] == "p":
            #pass along just the important bit to player
            playerMessage = "_".join(messageSplit[2:])
            player = PlayerConnection.getPlayerById(messageSplit[1])
            player.send(playerMessage)
    
    def update(self):
        self.send(ScreenConnection.x)

        
    #there may be several screens connected to the server, so let other things
    #send a message to them all at once
    @staticmethod
    def notifyScreens(message):
        for screen in ScreenConnection.screens:
            screen.send(message)
            

from playerconnection import PlayerConnection
from game import Game