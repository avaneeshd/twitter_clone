var express = require('express')
	, passport = require('../../auth')
	, db = require('../../db')
	, router = express.Router();
/*
 * 	============= Auth APIs ===================
 * 	Login: 		POST /api/auth/login
 *  Logout: 	POST /api/auth/logout
 *
 * */

router.post('/login',  function(req, res, next){
	passport.authenticate('local', function(err, user, info){
		if(err){ return res.sendStatus(500);  }
		else if(user){
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				return res.send({'user': user.toClient()});
			});
		}
		else res.sendStatus(403);
	})(req, res, next);
});

router.post('/logout', function(req, res, next){
	req.logout();
	return res.sendStatus(200);
});

module.exports = router;