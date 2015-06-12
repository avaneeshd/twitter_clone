var mongoose = require('mongoose'),
	config =  require('../config'),
	userSchema = require('./schemas/user'),
	tweetSchema = require('./schemas/tweet');

var database = config.get('database:name');
var host = config.get('database:host');
var port = config.get('database:port');

var db =  mongoose.createConnection(host, database , port);
db.model('User', userSchema);
db.model('Tweet', tweetSchema);
module.exports = db;