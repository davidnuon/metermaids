from gevent import monkey
from flask import Flask, Response, render_template, request, redirect, url_for
from socketio import socketio_manage
from socketio.namespace import BaseNamespace
from socketio.mixins import RoomsMixin
import uuid


monkey.patch_all()
app = Flask(__name__)
app.debug = True
app.config['PORT'] = 5000
def generate_room():
    room = uuid.uuid4()
    return str(room)

class ChatNamespace(BaseNamespace, RoomsMixin):
    def initialize(self):
        self.logger = app.logger
        self.log("Socketio session started")

    def log(self, message):
        self.logger.info("[{0}] {1}".format(self.socket.sessid, message))

    def recv_connect(self):
        self.join(chatroom)
        self.log("New connection")

    def recv_disconnect(self):
        self.leave(chatroom)
        self.log("Client disconnected")

    def on_message(self, msg):
        self.log('got a message: %s ' % msg)
        print dir(msg)
        self.emit_to_room(chatroom, 'message', {
            'content' : msg,
            'sender' : self.session['name']
            })
        return True, msg

    def on_join(self, email):
        self.session['name'] = email
        self.log('%s joins' % email)
        return True, email

@app.route('/', methods=['GET'])
def landing():
    return redirect(url_for('chatroom_route'))

@app.route('/socket.io/<path:remaining>')
def socketio(remaining):
    try:
        socketio_manage(request.environ, {chatroom: ChatNamespace} , request)
    except:
        app.logger.error("Exception while handling socketio connection",
                         exc_info=True)
    return Response()

@app.route('/room/' + room)
def chatroom_route():
    return render_template('room.html', chatroom = room)
