var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
	id: {type:String, unique:true},
	name: String,
	email: {type:String, unique:true},
	password: String,
	followingIds: {type: [String], default: []}
});

userSchema.pre('save', function(next){
	var myThis = this;
	bcrypt.hash((this.password, 8 , function(err, hash){
		myThis.password = hash;
		next();
	}));
});

userSchema.methods.toClient = function(){
	var user = {};
	user.id = this.id;
	user.name = this.name;
	return user;
};

module.exports = userSchema;