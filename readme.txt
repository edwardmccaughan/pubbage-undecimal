This is a demo of a multiplayer game platform controlled by mobile browser based controllers.
The idea is that you have a multiplayer game playing on a big screen or projector and everyone uses their smartphone, psp, laptop etc. as a game controller over wifi or 3g.


Running the server:
	The server depends on
		-python 2.x
		-tornado (ideally 2.0)
		-tornadio
all of which are availible with PIP

The clients can be any browser that supports javascript. Ideally it will try and use websockets, failing that it will transparently fall back to flash sockets and then regular ajax.
if you watch the server console, you can see as devices connect what method they're using.

Flash sockets requires port 843 open for the flash policy file, which means you'll have to either run it as root, or change that port and just not have the flash fallback work. 

There are currently 4 versions
	-realsocket
		current latest version, realsocket also supports traditional tcp sockets for screen connections
	-asteroids
		based on tunnel, but uses html5 canvas
	-tunnel 
		Almost all the game logic is run in javascript on the screen html page and the python tornado server just acts as a conduit between the screen and controllers
	-chase
		Was the first actual game, with most of the game logic happening server side in python and then merely telling the screen what to display
	-swarm was the first prototype


To run the game:
	-start the swarmserver.py
	-use a web browser to connect to the screen url (eg: localhost:8001/screen)
	-connect as many browsers as you want to the input controller url (eg: localhost:8001) and each one should have a player appear
	