/**
 * Created by avaneeshdesai on 6/6/15.
 */
var passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy
	, fixtures = require('./fixtures.js')
	, bcrypt = require('bcrypt')
	, conn = require('./db')
	, User = conn.model('User')
	, _ = require('lodash');

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.findOne({'id': id}, function(err, user){
		if(!user){
			return done(null ,false);
		}
		done(null, user);
	});
});

passport.use(new LocalStrategy(
	function (username, password, done){
		User.findOne({'id': username}, function(err, user) {
			if (err) {
				return done(err)
			}
			if (!user) {
				return done(null, false, {'message': 'Incorrect username.'});
			} else {
				bcrypt.compare(password, user.password, function(err, res){
					if(res){
						return done(null, false, {'message': 'Incorrect password.'})
					}else {
						return done(null, user);
					}
				});

			}
		});
	}));

module.exports = passport;