'use strict';

const	checkObjKey	= require(__dirname + '/../index.js'),
	test	= require('tape'),
	log	= require('winston');

// Set up winston
log.remove(log.transports.Console);
/** /log.add(log.transports.Console, {
	'level':	'info',
	'colorize':	true,
	'timestamp':	true,
	'json':	false
});/**/

test('should check if a value exists', function (t) {
	const	obj	= {'foo': 'bar'};

	checkObjKey({'obj': obj, 'objectKey': 'foo'}, function (err) {
		if (err) throw err;
		t.end();
	});
});

test('should check if a value exists that does not', function (t) {
	const	obj	= {'foo': 'bar'};

	checkObjKey({'obj': obj, 'objectKey': 'beng'}, function (err) {
		t.equal(err instanceof Error,	true);
		t.end();
	});
});

test('should set a default value', function (t) {
	const	obj	= {'foo': 'bar'};

	checkObjKey({'obj': obj, 'objectKey': 'beng', 'default': 'funk'}, function (err, warning) {
		if (err) throw err;
		t.equal(obj.beng,	'funk');
		t.equal(warning,	'obj["beng"] is not set, setting default: "funk"');
		t.end();
	});
});

test('should set a default value and label', function (t) {
	const	obj	= {'foo': 'bar'};

	checkObjKey({
		'obj':	obj,
		'objectKey':	'beng',
		'default':	'funk',
		'defaultLabel':	'booyah'
	}, function (err, warning) {
		if (err) throw err;
		t.equal(obj.beng,	'funk');
		t.equal(warning,	'obj["beng"] is not set, setting default: "booyah"');
		t.end();
	});
});

test('should fail if the given value is not in the validValues array', function (t) {
	const	obj	= {'foo': 'bar', 'beng': 'torsk'};

	checkObjKey({'obj': obj, 'objectKey': 'beng', 'validValues': ['bisse', 'bosse']}, function (err) {
		t.equal(err instanceof Error,	true);
		t.end();
	});
});

test('should validate a value in the validValues array', function (t) {
	const	obj	= {'foo': 'bar', 'beng': 'torsk'};

	checkObjKey({'obj': obj, 'objectKey': 'beng', 'validValues': ['bisse', 'torsk']}, function (err) {
		if (err) throw err;
		t.equal(obj.beng,	'torsk');
		t.end();
	});
});

test('should return error if options is not an object', function (t) {
	checkObjKey('foo', function (err) {
		t.equal(err instanceof Error,	true);
		t.end();
	});
});

test('should return error if options.obj is not an object', function (t) {
	checkObjKey({}, function (err) {
		t.equal(err instanceof Error,	true);
		t.end();
	});
});

test('should work even if cb is not given', function (t) {
	checkObjKey();
	t.end();
});

test('should return error if objectKey is not valid', function (t) {
	const	obj	= {'foo': 'bar'};

	checkObjKey({'obj': obj, 'objectKey': {}}, function (err) {
		t.equal(err instanceof Error,	true);
		t.end();
	});
});
