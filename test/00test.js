'use strict';

const	checkObjKey	= require(__dirname + '/../index.js'),
	assert	= require('assert'),
	log	= require('winston');

// Set up winston
log.remove(log.transports.Console);
/** /log.add(log.transports.Console, {
	'level':	'info',
	'colorize':	true,
	'timestamp':	true,
	'json':	false
});/**/

describe('Unit tests', function () {
	this.slow(1500);
	this.timeout(3000);

	it('should check if a value exists', function (done) {
		const	obj	= {'foo': 'bar'};

		checkObjKey({'obj': obj, 'objectKey': 'foo'}, function (err) {
			if (err) throw err;
			done();
		});
	});

	it('should check if a value exists that does not', function (done) {
		const	obj	= {'foo': 'bar'};

		checkObjKey({'obj': obj, 'objectKey': 'beng'}, function (err) {
			assert(err instanceof Error);
			done();
		});
	});

	it('should set a default value', function (done) {
		const	obj	= {'foo': 'bar'};

		checkObjKey({'obj': obj, 'objectKey': 'beng', 'default': 'funk'}, function (err, warning) {
			if (err) throw err;
			assert.strictEqual(obj.beng,	'funk');
			assert.strictEqual(warning,	'obj["beng"] is not set, setting default: "funk"');
			done();
		});
	});

	it('should fail if the given value is not in the validValues array', function (done) {
		const	obj	= {'foo': 'bar', 'beng': 'torsk'};

		checkObjKey({'obj': obj, 'objectKey': 'beng', 'validValues': ['bisse', 'bosse']}, function (err) {
			assert(err instanceof Error);
			done();
		});
	});

	it('should validate a value in the validValues array', function (done) {
		const	obj	= {'foo': 'bar', 'beng': 'torsk'};

		checkObjKey({'obj': obj, 'objectKey': 'beng', 'validValues': ['bisse', 'torsk']}, function (err) {
			if (err) throw err;
			assert.strictEqual(obj.beng,	'torsk');
			done();
		});
	});
});
