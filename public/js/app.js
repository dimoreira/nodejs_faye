$(document).ready(function() {
	var client = new Faye.Client('/faye', {
		timeout: 20
	});

	client.subscribe('/channel', function(message) {
		$('#messages').append('<p>'+ message.text +'</p>');
	});
});
