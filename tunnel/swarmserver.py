from os import path as op
import tornado.web
import tornadio
import tornadio.router
import tornadio.server
import logging,os
import time
from playerconnection import PlayerConnection
from screenconnection import ScreenConnection
from game import Game

ROOT = op.normpath(op.dirname(__file__))



#just render the input.html page        
class InputHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

#just render the screen.html page
class ScreenHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("screen.html")
        
#routers will autoamagicly generate the right urls for their resources
ScreenRouter = tornadio.get_router(ScreenConnection, resource='screen')
InputRouter = tornadio.get_router(PlayerConnection, resource='input')

#configure the urls for the tornado server
routes = [(r"/", InputHandler),
          (r"/input", InputHandler),
          InputRouter.route(),
          (r"/screen", ScreenHandler),
          ScreenRouter.route()
          ]

settings = {"static_path": os.path.join(os.path.dirname(__file__), "static")}

#set up and run the actual server process
application = tornado.web.Application(
    routes,
    enabled_protocols = ['websocket',
                         'flashsocket',
                         'xhr-multipart',
                         'xhr-polling'],
    flash_policy_port = 843,
    flash_policy_file = op.join(ROOT, 'flashpolicy.xml'),
    socket_io_port = 8001,
     **settings
)

if __name__ == "__main__": 
    logging.getLogger().setLevel(logging.DEBUG)
    #Game.game = Game()
    tornadio.server.SocketServer(application)
    
    
    
    



