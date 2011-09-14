This is a demo of a multiplayer game platform controlled by mobile browser based controllers.

To run the game:
	-start the swarmserver.py
	-use a web browser to connect to the screen url (eg: localhost:8001/screen)
	-connect as many browsers as you want to the input controller url (eg: localhost:8001/input) and each one should have a player appear
	

Running the server:
	The server depends on
		-python
		-tornado
		-tornadio
all of which are availible with PIP

The clients can be any browser that supports javascript. Ideally it will try and use websockets, failing that it will transparently fall back to flash sockets and then regular ajax.
if you watch the server console, you can see as devices connect what method they're using.

Flash sockets requires port 843 open for the flash policy file, which means you'll have to either run it as root, or change that port and just not have the flash fallback work. 