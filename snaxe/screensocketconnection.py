import errno
import functools
import socket
from tornado import ioloop, iostream

class SocketScreenHandler:
    stream = 0

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
            SocketScreenHandler.stream = self.stream
            self.stream.set_close_callback(self.on_close)
            
            for player in PlayerConnection.players:
                self.stream.write("new_"+str(player.id)+"\r\n")
            
            self.waitForNextMessage()
        
    def on_message(self,message):
        
        messageSplit = message.split("_")
        if messageSplit[0] == "p":
            #pass along just the important bit to player
            playerMessage = "_".join(messageSplit[2:])
            
            if messageSplit[1] == "a":
                for player in PlayerConnection.players:
                    player.sendMessage(playerMessage)
            else:
                player = PlayerConnection.getPlayerById(messageSplit[1])
                if player:
                    player.sendMessage(playerMessage)
        
        self.waitForNextMessage()
        
        
    def waitForNextMessage(self):
        self.stream.read_until("\r\n", self.on_message)
    
    def on_close(self):
        SocketScreenHandler.stream = 0
    
    @staticmethod
    def notifyScreens(message):
        if SocketScreenHandler.stream:
            fullMessage = message + "\r\n"
            SocketScreenHandler.stream.write(fullMessage.encode('utf8'))

from playerconnection import PlayerConnection