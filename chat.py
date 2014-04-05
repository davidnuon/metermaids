from gevent import monkey
from flask import Flask, Response, render_template, request
from socketio import socketio_manage
from socketio.namespace import BaseNamespace


monkey.patch_all()

app = Flask(__name__)
app.debug = True
app.config['PORT'] = 5000


class ChatNamespace(BaseNamespace):
    def __init__(self):
        self.logger = app.logger
        self.log = 'socketio session has started'

    def log(self, message):
        self.logger.info('[{0}] {1}'.format(self.socket.sessid, message))

    def rec_connect(self):
        self.log("new connection")

    def rec_dissconnect(self):
        self.log("Client dissconected")


@app.route("/", methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/socket.io/<path:remaining>')
def socketio(remaining):
    try:
        socketio_manage(request.environ, {'/chat': ChatNamespace}, request)
    except:
        app.logger.error('Exception while handling socketio connection', exc_info=True)
    return Response
