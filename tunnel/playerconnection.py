import tornadio
import logging

class PlayerConnection(tornadio.SocketConnection):
    players = []
    playerCount = 0
    
    def on_open(self, *args, **kwargs):
        self.players.append(self)
        self.id =  PlayerConnection.playerCount
        PlayerConnection.playerCount+=1  
        self.notifyScreensOfJoin()

    def on_message(self, message):
       ScreenConnection.notifyScreens("m_" + str(self.id) + message)

    def on_close(self):
        ScreenConnection.notifyScreens("quit_"+str(self.id))

    def notifyScreensOfJoin(self):
        ScreenConnection.notifyScreens("new_"+str(self.id))
        
from screenconnection import ScreenConnection
from game import Game