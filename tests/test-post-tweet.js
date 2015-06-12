var request = require('supertest');
var should = require('should');
var mongoose = require('mongoose');
var chai = require('chai')
	, expect = chai.expect;
describe("Test Suite POST /api/tweets", function(){

	var agentPeter = null
	var agentIncognito = null
	var Session = null

	before(function(done){
		process.env.NODE_ENV = 'test'
		var host = '127.0.0.1';
		var port = 27017;
		mongoose.connect('mongodb://127.0.0.1:27017/twittertest',function(err){
			/* Drop the DB */

			mongoose.connection.db.dropDatabase(function(err){
				console.log("Dropeed");
				done(null);
			});

		});
	});
	//
	it("Should connect to server", function(){
		process.env.NODE_ENV = 'test'
		var server = require('../index')
		Session = require('supertest-session')({
			app: server
		});

		agentIncognito = new Session();
		agentPeter = new Session();
	});

	it("should respond with 403 for unauthenticated user", function(done){
		var data = { text: 'My first tweet' };
		agentIncognito.post('/api/tweets')
			.send({data: data})
			.expect(403, done);
	});

	it("should respond with 200, for POST /api/users", function(done){
		var user = { id: 'peter'
			, name: 'Peter Thiel'
			, email: 'peter@thiel.com'
			, password: 'investor'
		}
		agentPeter.post("/api/users").send({user:user}).expect(200).end(function(err, res){
			should.not.exist(err);
			done();
		});
	});

	it("should respond with 200, for POST /api/tweets authenticated user", function(done){
		var data = { text: 'My first tweet' };
		agentPeter.post('/api/tweets')
			.send({tweet: data})
			.expect(200)
			.end(function(err, response){
				try {
					expect(response.body).to.have.property('tweet');
					done(null);
				} catch(err) {
					done(new Error(err))
				}
			});
	});

});