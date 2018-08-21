'use strict';

const checkObjKey = require(__dirname + '/../index.js');
const LUtils      = require('larvitutils');
const test        = require('tape');
const log         = new (new LUtils()).Log('none');

test('should check if a value exists', function (t) {
	const obj = {'foo': 'bar'};

	checkObjKey({'obj': obj, 'objectKey': 'foo', 'log': log}, function (err) {
		if (err) throw err;
		t.end();
	});
});

test('should check if a value exists that does not', function (t) {
	const obj = {'foo': 'bar'};

	checkObjKey({'obj': obj, 'objectKey': 'beng', 'log': log}, function (err) {
		t.equal(err instanceof Error, true);
		t.end();
	});
});

test('should set a default value', function (t) {
	const obj = {'foo': 'bar'};

	checkObjKey({'obj': obj, 'objectKey': 'beng', 'default': 'funk', 'log': log}, function (err, warning) {
		if (err) throw err;
		t.equal(obj.beng, 'funk');
		t.equal(warning, 'obj["beng"] is not set, setting default: "funk"');
		t.end();
	});
});

test('should set a null default value', function (t) {
	const obj = {'foo': 'bar'};

	checkObjKey({'obj': obj, 'objectKey': 'beng', 'default': null, 'log': log}, function (err, warning) {
		if (err) throw err;
		t.equal(obj.beng, null);
		t.equal(warning, 'obj["beng"] is not set, setting default: null');
		t.end();
	});
});

test('should set an explicitly undefined default value', function (t) {
	const obj = {'foo': 'bar'};

	checkObjKey({'obj': obj, 'objectKey': 'beng', 'default': undefined, 'log': log}, function (err, warning) {
		if (err) throw err;
		t.equal(obj.beng, undefined);
		t.equal(warning, 'obj["beng"] is not set, setting default: undefined');
		t.end();
	});
});

test('should set a default value and label', function (t) {
	const obj = {'foo': 'bar'};

	checkObjKey({
		'obj':          obj,
		'objectKey':    'beng',
		'default':      'funk',
		'defaultLabel': 'booyah',
		'log':          log
	}, function (err, warning) {
		if (err) throw err;
		t.equal(obj.beng, 'funk');
		t.equal(warning, 'obj["beng"] is not set, setting default: booyah');
		t.end();
	});
});

test('should fail if the given value is not in the validValues array', function (t) {
	const obj = {'foo': 'bar', 'beng': 'torsk'};

	checkObjKey({'obj': obj, 'objectKey': 'beng', 'validValues': ['bisse', 'bosse'], 'log': log}, function (err) {
		t.equal(err instanceof Error, true);
		t.end();
	});
});

test('should validate a value in the validValues array', function (t) {
	const obj = {'foo': 'bar', 'beng': 'torsk'};

	checkObjKey({'obj': obj, 'objectKey': 'beng', 'validValues': ['bisse', 'torsk'], 'log': log}, function (err) {
		if (err) throw err;
		t.equal(obj.beng, 'torsk');
		t.end();
	});
});

test('should return error if options is not an object', function (t) {
	checkObjKey('foo', function (err) {
		t.equal(err instanceof Error, true);
		t.end();
	});
});

test('should return error if options.obj is not an object', function (t) {
	checkObjKey({'log': log}, function (err) {
		t.equal(err instanceof Error, true);
		t.end();
	});
});

test('should not crash even if cb is not given', function (t) {
	checkObjKey();
	t.end();
});

test('should return error if objectKey is not valid', function (t) {
	const obj = {'foo': 'bar'};

	checkObjKey({'obj': obj, 'objectKey': {}, 'log': log}, function (err) {
		t.equal(err instanceof Error, true);
		t.end();
	});
});
