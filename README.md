[![Build Status](https://travis-ci.org/larvit/check-object-key.svg?branch=master)](https://travis-ci.org/larvit/check-object-key) [![Dependencies](https://david-dm.org/larvit/check-object-key.svg)](https://david-dm.org/larvit/check-object-key.svg)

# Check object key

Standardized way to check an objects key, setting defaults, timing out etc.

## Installation

```bash
npm i check-object-key
```

## Usage

Load up library like so:

```javascript
'use strict';

const	checkKey	= require('check-object-key');
```

### Basic usage, check if if key exists

```javascript
const	obj	= {'foo': 'bar'};

checkKey({
	'obj':	obj,
	'objectKey':	'foo'
}, function (err) {
	if (err) throw err;

	// If no error, key exists
});
```

### Basic usage, set default value if key does not exist

```javascript
const	obj	= {};

checkKey({
	'obj':	obj,
	'objectKey':	'foo',
	'default':	'blut'
}, function (err) {
	if (err) throw err;

	console.log(obj.foo); // "blut"
});
```

### Basic usage, check key against list ov validValues

```javascript
const	obj	= {'foo': 'nein'};

checkKey({
	'obj':	obj,
	'objectKey':	'foo',
	'validValues':	['ja', 'yes', 'da']
}, function (err) {
	if (err) throw err; // This should throw an error, since "nein" is not in the validValues array
});
```

### Works async as well

```javascript
const	obj	= {};

checkKey({
	'obj':	obj,
	'objectKey':	'foo'
}, function (err) {
	if (err) throw err;

	// No error is thrown, since obj.foo is set in the async operation below
});

someAsyncThingie(function (err, someValue) {
	if (err) throw err;

	obj.foo	= someValue;
});
```

### Full documentation on parameters

options.obj:	object	- Object to have its keys checked
options.objectKey:	string	- object key name
options.default:	any	- The default value if it does not exist
options.defaultLabel:	string	- What to print in the log as the default value (will default to "default" if it is a string)
options.retries:	integer	- used internally. Set to 10+ to have the method immediately set the default value or fail if the key does not exist
