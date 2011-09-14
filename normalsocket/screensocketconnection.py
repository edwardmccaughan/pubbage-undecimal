import errno
import functools
import socket
from tornado import ioloop, iostream

class SocketScreenHandler:
    screen = 0

    def __init__(self):
        
        
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM, 0)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.setblocking(0)
        self.sock.bind(("", 8002))
        self.sock.listen(5000)
        
        io_loop = ioloop.IOLoop.instance()
        callback = functools.partial(self.connectionReady, self.sock)
        io_loop.add_handler(self.sock.fileno(), callback, io_loop.READ)
        self.stream = 0
        
        
        
    def connectionReady(self,sock, fd, events):
        while True:
            try:
                self.connection, address = sock.accept()
            except socket.error, e:
                if e[0] not in (errno.EWOULDBLOCK, errno.EAGAIN):
                    raise
                return
            self.connection.setblocking(0)
            self.stream = iostream.IOStream(self.connection)
            SocketScreenHandler.screen = self
            self.waitForNextMessage()
        
    def on_message(self,message):
        
        messageSplit = message.split("_")
        if messageSplit[0] == "p":
            #pass along just the important bit to player
            playerMessage = "_".join(messageSplit[2:])
            
            if messageSplit[1] == "a":
                for player in PlayerConnection.players:
                    player.send(playerMessage)
            else:
                player = PlayerConnection.getPlayerById(messageSplit[1])
                player.send(playerMessage)
            
            
        elif messageSplit[0] == "p":
            #pass along just the important bit to all players
            playerMessage = "_".join(messageSplit[2:])
            player = PlayerConnection.getPlayerById(messageSplit[1])
            player.send(playerMessage)
        
        self.waitForNextMessage()
        
        
    def waitForNextMessage(self):
        self.stream.read_until("\r\n", self.on_message)
    
    @staticmethod
    def notifyScreens(message):
        if SocketScreenHandler.screen:
            SocketScreenHandler.screen.stream.write(message + "\r\n")

from playerconnection import PlayerConnection