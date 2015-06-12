var _ = require('lodash')
	, express = require('express')
	, fixtures = require('./fixtures')
	, passport = require('./auth')
	, config = require('./config')
	, db = require('./db')
	, User = db.model('User')
	, Tweet = db.model('Tweet')
	, app = express();

require('./middleware')(app)
require('./router')(app)
var server = app.listen(config.get('server:port'), config.get('server:host'));

module.exports = server;