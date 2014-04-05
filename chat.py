from gevent import monkey
from flask import Flask, Response, render_template, request, redirect
from socketio import socketio_manage
from socketio.namespace import BaseNamespace
from socketio.mixins import BroadcastMixin
import uuid

monkey.patch_all()
app = Flask(__name__)
app.debug = True
app.config['PORT'] = 5000


class RoomForm(Form):
    room_name = TextField('room_name', validators=[DataRequired()])


class ChatNamespace(BaseNamespace, BroadcastMixin):
    def initialize(self):
        self.logger = app.logger
        self.log("Socketio session started")

    def log(self, message):
        self.logger.info("[{0}] {1}".format(self.socket.sessid, message))

    def recv_connect(self):
        self.log("New connection")

    def recv_disconnect(self):
        self.log("Client disconnected")

    def on_join(self, email):
        self.log("%s joined chat" % email)
        self.session['email'] = email
        return True, email

    def on_message(self, message):
        self.log('got a message: %s' % message)
        self.broadcast_event_not_me("message",{ "sender" : self.session["email"], "content" : message})
        return True, message



@app.route('/', methods=['GET'])
def landing():
    namespaces = {uuid.uuid4: ChatNamespace}
    return redirect(url_for('room'))

@app.route('/socket.io/<path:remaining>')
def socketio(remaining):
    try:
        socketio_manage(request.environ, namespaces, request)
    except:
        app.logger.error("Exception while handling socketio connection",
                         exc_info=True)
    return Response()
@app.route('/room/<uuid>')
def room():

