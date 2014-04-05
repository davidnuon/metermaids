// Message Manager
var mm = {
	last: 0,
	messages : [], 
	addMessage : function (name, pic, content) {
		this.messages[this.messages.length] = {
			'name' : name,
			'pic' : pic,
			'content' : content
		}
	},
	append : function () {
		// Message Window
		var mw = $('#messages');
		for(var i = this.last; i < this.messages.length; i++) {
			var msg = this.messages[i];
			mw.append(
				'<div class="message"><div class="avatar"></div><div class="content">$m</div></div>'
				.replace('$m',msg.content)
			)
		}
		this.last = this.messages.length;		
	}
}


$( function () {
	var km = new Kibo();
	var $chatInput = $('#chat-message');

	km
	.up(['any'], function(e) {
		$chatInput.focus();
	})
	.up(['enter'], function() {
		mm.addMessage(
			'test',  // Image
			'test',  // Name
			$chatInput.val());  // Message Content
		mm.append();
		$chatInput.val('');
	})

})