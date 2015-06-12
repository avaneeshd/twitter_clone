var request = require('supertest');

describe("Test GET requests", function(){

	it("Should respond with 404", function(done){
		process.env.NODE_ENV = 'test'
		var server = require('../index');
		request(server).get('/api/tweets/55231d90f4d19b49441c9cb9').expect(404, done);
	});

});