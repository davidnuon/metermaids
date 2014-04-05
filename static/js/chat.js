(function($,window){
    $(function(){
        console.log("Welcome to pychat");
        var socket = io.connect('/chat');
        socket.on('connect', function () {
            socket.emit('join', 'Bob', function(joined, name){
                socket.emit('message', 'hello this is ' + name, function(sent){
                    console.log("message sent: ", sent);
                });
            });
        });

        socket.on('message', function(message){
            alert("got a message: " + message);
        });
    });
}($,window));
