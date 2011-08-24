import tornado
import logging

class Game:
    
    game = 0
    
    def __init__(self):
        main_loop = tornado.ioloop.IOLoop.instance() 
        scheduler = tornado.ioloop.PeriodicCallback(self.gameloop,30, io_loop = main_loop) 
        scheduler.start()
        
        self.screenWidth = 400;
        self.screenHeight = 300;
        self.taggedPlayer = 0
        
    def gameloop(self):
        for player in PlayerConnection.players:
            player.update()
        self.checkTaggedPlayer()
            
    def tagPlayer(self, player):
        print "tagged player " + str(player.id)
        self.lastTaggedPlayer = self.taggedPlayer
        self.taggedPlayer = player
        ScreenConnection.notifyScreens("tag_" + str(player.id))
        if self.lastTaggedPlayer:
            self.lastTaggedPlayer.setSize(self.lastTaggedPlayer.defaultSize)
        self.taggedPlayer.setSize(self.taggedPlayer.taggedSize)
    
    def checkTaggedPlayer(self):
        for player in PlayerConnection.players:
            if (not self.taggedPlayer or player.id != self.taggedPlayer.id) and (not self.lastTaggedPlayer or player.id != self.lastTaggedPlayer.id):
                if self.colRect(player.x, player.y, player.width, player.height, 
                                self.taggedPlayer.x, self.taggedPlayer.y, self.taggedPlayer.width, self.taggedPlayer.height):
                    self.tagPlayer(player)
 
    def colRect(self,x1,y1,w1,h1,x2,y2,w2,h2):
        if (x2 > x1 + w1) or (x2 + w2 < x1) or (y2 > y1 + h1) or (y2 + h1 < y1):
            return False
        else:
            return True
        
        
        
from playerconnection import PlayerConnection
from screenconnection import ScreenConnection