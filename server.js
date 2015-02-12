/*
 * Dependencies initialization
 */
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var faye = require('faye');

/*
 * Initialize Faye with Baydeux Protocol
 */
var bayeux = new faye.NodeAdapter({
	mount: '/faye',
	timeout: 45
});

/*
 * Server setup
 */
var app = module.exports = express();
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(express.static(__dirname + '/public'));

/*
 * Initial root route
 */
app.get('/', function(req, res) {
	res.status(200);
	res.json({
		version: '1.0.0',
		message: 'NodeJs Message Broker with Faye'
	});
});

/*
 * Message post route
 * ------------------
 *
 * Do a json post to this endpoint to check
 * the response on the client
 *
 * POST /message
 *
 * { "message": "YOUR MESSAGE HERE" }
 *
 */
app.post('/message', function(req, res) {
	bayeux.getClient().publish('/channel', { text: req.body.message });
	res.status(200);
	res.json({
		error: false,
		message: 'Received message: ' + req.body.message
	});
});

/*
 * Server initialization
 */
var server = http.createServer(app);
bayeux.attach(server);
server.listen(app.get('port'), function() {
	console.log('Express server listening on port: ' + app.get('port'));
});
