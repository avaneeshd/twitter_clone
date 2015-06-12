var fs = require('fs');

describe("simple test", function(){
	it("test if dummy file exists", function(done){
		fs.exists('dummy', function(exists){
			if(exists) {
				done(null);
			}else{
				done(new Error('File does not exist'));
			}
		});
	});

});