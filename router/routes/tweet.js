var express = require('express')
	, passport = require('../../auth')
	, db = require('../../db')
	, User = db.model('User')
	, Tweet = db.model('Tweet')
	, router = express.Router();
var ensureAuthentication = require('../../middleware/ensureAuthentication.js')
/*
 * 	====================== Tweet APIs ===========================
 * 	Post tweet: 				POST /api/tweets
 * 	Get tweets by user id:		GET /api/tweets?userId=<userId>
 * 	Get single tweet by Id:		GET /api/tweets/:tweetId
 * 	Delete Tweet by Id:			DELETE /api/tweets/:tweetId
 * */


router.post('/', ensureAuthentication, function(req, res){
	var tweet = req.body.tweet;
	tweet.userId = req.user.id;
	tweet.created = Math.floor(new Date() / 1000);

	var t = new Tweet(tweet);
	t.save(function(err, tw){
		if (err) {
			var code = err.code === 11000 ? 409 : 500;
			return res.sendStatus(code)
		}else{
			res.send({'tweet': tw.toClient()});
		}
	});
});

router.get('/', ensureAuthentication, function(req, res){
	var userID = req.query.userId;
	var stream = req.query.stream;
	if(!stream){
		return res.sendStatus(400);
	}
	if(stream === "home_timeline") {
		User.findOne({id: req.user.id}, function (err, user) {
			if (err) return res.sendStatus(500);
			if (!user) return res.sendStatus(404);

			Tweet.find({'userId': {$in: user.followingIds}}).sort({created: 'desc'}).exec(function (err, tweets) {
				if (err) return res.sendStatus(500);
				var responseTweets = tweets.map(function (tweet) {
					return tweet.toClient()
				});
				return res.send({
					tweets: responseTweets
				});
			});
		});
	}

	if(stream === "profile_timeline"){
		if(userID) {
			Tweet.find({'userId': userID}).sort({created: 'desc'}).exec(function (err, tweets) {
				if (err) return res.sendStatus(500);
				var responseTweets = tweets.map(function (tweet) {
					return tweet.toClient()
				});
				return res.send({
					tweets: responseTweets
				});
			});
		} else {
			return res.sendStatus(400);
		}
	}

});

router.get('/:tweetId', function(req, res){
	Tweet.findById(req.params.tweetId, function(err, tweet){
		if(err) return res.sendStatus(500);
		if(tweet){
			res.send({tweet: tweet.toClient()});
		}else{
			res.sendStatus(404);
		}
	});
});

router.delete('/:tweetId', ensureAuthentication,  function(req, res) {
	Tweet.findById(req.params.tweetId, function (err, tweet) {
		if (!tweet) {
			res.sendStatus(404);
		} else {
			if (req.user.id === tweet.userId) {
				Tweet.findByIdAndRemove(req.params.tweetId, function(err) {
					if(err) return res.sendStatus(500);

					res.sendStatus(200);
				});
			}else {
				res.sendStatus(403);
			}
		}
	});
});

module.exports = router;