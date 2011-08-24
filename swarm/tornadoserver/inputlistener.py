import tornado.web
import tornado.options
import tornado.httpserver
import inspect

x = 0

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        global x
        #print self.request.arguments
        if (self.request.arguments['direction'][0] == "left"):
            x -= 1
        elif (self.request.arguments['direction'][0] == "right"):
            x += 1
        
        self.write("You requested the main page" + str(x))



def main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(tornado.web.Application([
        (r"/", MainHandler),
    ]))
    http_server.listen(5000)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
