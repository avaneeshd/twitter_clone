var express = require('express')
	, passport = require('../../auth')
	, db = require('../../db')
	, User = db.model('User')
	, router = express.Router();

var ensureAuthentication = require('../../middleware/ensureAuthentication.js')
/*
 * 	=============User APIs===================
 * 	SignUp: 			POST /api/users
 *  User Details: 		GET /api/users/:userId
 *	Update password: 	PUT /api/users/:userId
 *	Follow User: 		POST /api/users/:userId/follow
 *	Unfollow User:	 	POST /api/users/:userId/unfollow
 *
 * */

router.post('/', function(req, res){
	var user = req.body.user;
	user.followingIds = [];
	var u = User(user);
	u.save(function(err){
		if (err) {
			var code = err.code === 11000 ? 409 : 500;
			return res.sendStatus(code)
		}
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			return res.sendStatus(200);
		});
	});
});

router.get('/:userId', function(req, res){
	var userID = req.params.userId;
	if(!userID){
		return res.sendStatus(400);
	}

	User.findOne({'id': userID} , function(err, user){
		if(err) return res.sendStatus(500);
		else{
			if(!user){
				return res.sendStatus(404);
			}
			return res.send({user: user.toClient()});
		}
	})
});


router.put('/:userId', ensureAuthentication, function(req, res, next){
	var userID = req.params.userId;
	var updatePassword = req.body.password;
	if(!userID){
		return res.sendStatus(400);
	}
	if(req.user.id !== userID){
		return res.sendStatus(403);
	}

	User.findOneAndUpdate({'id': userID}, {'password': updatePassword}, function(err, user){
		if(err) return res.sendStatus(500);
		else{
			return res.sendStatus(200);
		}
	});
});


router.post('/:userId/follow', ensureAuthentication, function(req, res, next){
	var userID = req.params.userId;
	if(!userID){
		return res.sendStatus(400);
	}
	User.findOne({id: userID}, function(err, followUser){
		if(err) return res.sendStatus(500);
		if(!followUser){
			return res.sendStatus(403);
		}else{
			User.findOneAndUpdate({'id': req.user.id}, { $addToSet:{ followingIds: userID }}, function(err, user){
				if(err) return res.sendStatus(500);
				res.sendStatus(200);
			});
		}
	});
});


router.post('/:userId/unfollow', ensureAuthentication, function(req, res, next){
	var userID = req.params.userId;
	if(!userID){
		return res.sendStatus(400);
	}
	User.findOne({id: userID}, function(err, followUser){
		if(err) return res.sendStatus(500);
		if(!followUser){
			return res.sendStatus(403);
		}else{
			User.findOneAndUpdate({'id': req.user.id}, { $pull:{ followingIds: userID }}, function(err, user){
				if(err) return res.sendStatus(500);
				res.sendStatus(200);
			});
		}
	});
});

router.get('/:userId/friends', function(req, res){
	var userId = req.params.userId;
	if(!userId){
		return res.sendStatus(400);
	}
	User.findOne({id: userId}, function(err, user){
		if(err) return res.sendStatus(500);
		if(!user) return res.sendStatus(404);
		User.find({id: {$in : user.followingIds}}, function(err, users){
			var responseUsers = users.map(function(u) { return u.toClient() });
			return res.send({users: responseUsers});
		});
	});
});


router.get('/:userId/followers', function(req, res){
	var userId = req.params.userId;
	if(!userId){
		return res.sendStatus(400);
	}

	User.findOne({id: userId}, function(err, user){
		if(err) return res.sendStatus(500);
		if(!user) return res.sendStatus(404);

		User.find({followingIds: { $in:[userId]}}, function(err, followers){
			if(err) return res.sendStatus(500);
			if(!followers) return res.sendStatus(404);
			var responseUsers = followers.map(function(u) { return u.toClient() });
			return res.send({users: responseUsers});
		})
	});

});

module.exports = router;