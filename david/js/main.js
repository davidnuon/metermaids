
$( function () {
	var k = new Kibo();
	var $chatInput = $('#chat-message');

	k.up(['any'], function(e) {
		console.log(e);
		$chatInput.focus();
	})

})