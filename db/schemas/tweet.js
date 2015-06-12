/**
 * Created by avaneeshdesai on 6/7/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tweetSchema = new Schema({
	userId: String,
	created: Number,
	text: String

});

tweetSchema.methods.toClient = function(){
	var tweet = {};
	tweet.id = this._id;
	tweet.created = this.created;
	tweet.text = this.text;
	tweet.userId = this.userId;
	return tweet;
}

module.exports = tweetSchema;