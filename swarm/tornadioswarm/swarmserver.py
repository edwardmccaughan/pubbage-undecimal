from os import path as op

import tornado.web
import tornadio
import tornadio.router
import tornadio.server
import logging,os

ROOT = op.normpath(op.dirname(__file__))

#just render the input.html page        
class InputHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("input.html")

#just render the screen.html page
class ScreenHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("screen.html")
        

class ScreenConnection(tornadio.SocketConnection):
    screens = set()
    
    def on_open(self, *args, **kwargs):
        self.screens.add(self)
        for player in InputConnection.players:
            player.notifyScreensOfJoin()
            player.notifyScreensOfLocation()
        
        
    def on_close(self):
        self.screens.remove(self)
        
    def on_message(self, message):
        pass
    
    def update(self):
        self.send(ScreenConnection.x)
    
    #there amy be several screens connected to the server, so let other things
    #send a message to them all at once
    @staticmethod
    def notifyScreens(message):
        for screen in ScreenConnection.screens:
            screen.send(message)
    
class InputConnection(tornadio.SocketConnection):
    players = set()
    playerCount = 0
    
    #on connect, set up players variables and tell the screens to display it
    def on_open(self, *args, **kwargs):
        logging.getLogger().debug("connection opened")
        self.players.add(self)
        self.id =  InputConnection.playerCount
        InputConnection.playerCount+=1  
        self.x = 0
        self.y = 0
        self.notifyScreensOfJoin()

    def on_message(self, message):
        if (message == "l"):
            self.x-=1            
            self.notifyScreensOfLocation()
        elif (message == "r"):
            self.x+=1
            self.notifyScreensOfLocation()
        elif (message == "u"):
            self.y-=1
            self.notifyScreensOfLocation()
        elif (message == "d"):
            self.y+=1
            self.notifyScreensOfLocation()

    def on_close(self):
        self.players.remove(self)
        ScreenConnection.notifyScreens("quit_"+str(self.id))
            
    def notifyScreensOfLocation(self):
        ScreenConnection.notifyScreens("pos_" + str(self.id) + "_" + str(self.x) + "_"+str(self.y))

    def notifyScreensOfJoin(self):
        ScreenConnection.notifyScreens("new_"+str(self.id))

#routers will autoamagicly generate the right urls for their resources
ScreenRouter = tornadio.get_router(ScreenConnection, resource='screen')
InputRouter = tornadio.get_router(InputConnection, resource='input')

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

    tornadio.server.SocketServer(application)

