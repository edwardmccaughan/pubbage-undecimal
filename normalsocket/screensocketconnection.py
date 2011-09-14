from twisted.internet import reactor, protocol

class SocketScreenHandler:
    def __init__(self, socket=8002):
        factory = protocol.ServerFactory()
        factory.protocol = TcpScreenConnection
        reactor.listenTCP(socket,factory)
        reactor.run()
        
    def notifyScreens(self, message):
        for screen in self.clients:
            screen.message(line)


class TcpScreenConnection(protocol.Protocol):
    
    def connectionMade (self, *args, **kwargs):
        print ("screen connected on normal socket")
        self.factory.clients.append(self)
    
    def dataReceived(self, data):
        messageSplit = data.split("_")
        if messageSplit[0] == "p":
            #pass along just the important bit to player
            playerMessage = "_".join(messageSplit[2:])
            player = PlayerConnection.getPlayerById(messageSplit[1])
            player.send(playerMessage)
    
    def send(self, data):
        self.transport.write(data)

from playerconnection import PlayerConnection