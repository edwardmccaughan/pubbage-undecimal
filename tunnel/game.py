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
            
        
        
        
from playerconnection import PlayerConnection
from screenconnection import ScreenConnection