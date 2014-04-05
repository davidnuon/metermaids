function makeid(k)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < k; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

// Message Manager
var mm = {
	name: '',

	last: 0,
	messages : [], 
	addMessage : function (pic, name, content) {
		this.messages[this.messages.length] = {
			'name' : name,
			'pic' : pic,
			'content' : content
		}
	},
	append : function () {
		// Message Window
		var mw = $('.messages');
		for(var i = this.last; i < this.messages.length; i++) {
			var msg = this.messages[i];
			mw.append(
				'<div class="message"><div class="avatar"></div><div class="content"><strong>$n</strong>&mdash;$m</div></div>'
				.replace('$m',msg.content)
				.replace('$n',msg.name)
			)
		}
		this.last = this.messages.length;		
		mw.scrollTop(mw.prop("scrollHeight"));
	}
}


var chatAPI = {

		connect : function(done) {

			var that = this;

			this.socket = io.connect('/chat');
			this.socket.on('connect', done);

			this.socket.on('message', function(message){
				if(that.onMessage){
					that.onMessage(message);
				}
			});
		},

		join : function(email, onJoin){
			this.socket.emit('join', email, onJoin);
		},

		sendMessage : function(message, onSent) {
			this.socket.emit('message', message, onSent);
		}

	};	

$( function () {
	mm.name = makeid(5); //prompt('', 'Enter your name', '');
	chatAPI.connect(function(){});

	var km = new Kibo();
	var $chatInput = $('#chat-message');

	chatAPI.join(mm.name, function(joined, name){
				if(joined){
					$(".compose-message-form").show();
					$(".messages").show();
				}
	});

	// Keyboard stuff
	km
	.up(['any'], function(e) {
		$chatInput.focus();
	})
	.up(['enter'], function() {
		var text = $chatInput.val();
		
		if(text.length > 2) {

			chatAPI.sendMessage(text, function(sent,message){
			if(sent){

				mm.addMessage(
				'test',  // Image
				mm.name,  // Name
				text)  // Message Content
				console.log(text);
				mm.append();

			}
		});

		$chatInput.val('');
		} 	
	})
	// end kibo

	chatAPI.onMessage = function(message){
			mm.addMessage(
				'test',  // Image
				message.sender,  // Name
				message.content)  // Message Content
			mm.append();

	};



	  // var editor = CodeMirror.fromTextArea($chatInput[0], {
	  //   mode: "text/x-markdown"
	  // });
})