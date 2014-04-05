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
	conv: null,
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
		if(this.conv == null) {
			this.conv =  new Markdown.Converter();
		}

		var source   = $("#message-template").html();
		var template = Handlebars.compile(source);

		// Message Window
		var mw = $('.messages');
		for(var i = this.last; i < this.messages.length; i++) {
			var msg = this.messages[i];
			mw.append(
				template({
					'name' : msg.name,
					'content' : this.conv.makeHtml(msg.content)
				})
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

	$(document).on( 'click', 'pre', function(){
		var codeBlock = $($(this).find('code')[0]);
		var outputBlock = $($(this).find('output')[0]);
		var me = this; 

		function outf(text) { 
			var outputBlock = me.childNodes[1];
			outputBlock.innerHTML += text;
			$(outputBlock).show();
			//console.log(outputBlock);
			//outputBlock.html( outputBlock.html() + text); 
		} 

		function builtinRead(x) {
		    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
		            throw "File not found: '" + x + "'";
		    return Sk.builtinFiles["files"][x];
		}
 
		function runit() { 
		   var outputBlock = me.childNodes[1];
		   var prog = codeBlock.html(); 
		  
		   outputBlock.innerHTML = '';
		   
		   Sk.configure({output:outf, read:builtinRead}); 
		   eval(Sk.importMainWithBody("<stdin>",false,prog));
		} 

		runit();

		$(this).onclick(function() {});
	} );

  var $chatInput = $('#chat-message');

  var editor = CodeMirror.fromTextArea($chatInput[0], {
    mode: "text/x-markdown"
  });

  editor.setSize('100%', '100px');


	mm.name = makeid(5); //prompt('', 'Enter your name', '');
	chatAPI.connect(function(){});

	var km = new Kibo();

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
	.up(['ctrl enter'], function() {
		var text = editor.getValue();
		
		if(text.length > 2) {

			chatAPI.sendMessage(text, function(sent,message){
			if(sent){

				mm.addMessage(
				'test',  // Image
				mm.name,  // Name
				text)  // Message Content
				mm.append();
				editor.setValue('');
			}
		});

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

})