import tornadio
import logging


class ScreenConnection(tornadio.SocketConnection):
    screens = set()
    
    def on_open(self, *args, **kwargs):
        self.screens.add(self)
        for player in PlayerConnection.players:
            player.notifyScreensOfJoin()
            
        #tell self what players exist
        for player in PlayerConnection.players:
            self.send("new_"+str(player.id))
        
    def on_close(self):
        self.screens.remove(self)
        
    def on_message(self, message):
        print "received: " + message   
        messageSplit = message.split("_")
        if messageSplit[0] == "p":
            #pass along just the important bit to player
            playerMessage = "_".join(messageSplit[2:])
            
            if messageSplit[1] == "a":
                for player in PlayerConnection.players:
                    player.sendMessage(playerMessage)
            else:
                player = PlayerConnection.getPlayerById(messageSplit[1])
                player.sendMessage(playerMessage)
    
    
    def update(self):
        self.send(ScreenConnection.x)

        
    #there may be several screens connected to the server, so let other things
    #send a message to them all at once
    @staticmethod
    def notifyScreens(message):
        print "trying send screenconnections " + message
        for screen in ScreenConnection.screens:
            screen.send(message)
            

from playerconnection import PlayerConnection
from game import Game