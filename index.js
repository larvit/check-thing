'use strict';

const	topLogPrefix	= 'check-object-key: index.js: ',
	log	= require('winston');

/**
 * Checking an object key
 *
 * @param options {obj}	- {
 *		'obj':	object	- Object to have its keys checked
 *		'objectKey':	string	- object key name
 *		'default':	any	- The default value if it does not exist
 *		'defaultLabel':	string	- What to print in the log as the default value (will default to "default" if it is a string)
 *		'retries': integer	- used internally. Set to 10+ to have the method immediately set the default value or fail if the key does not exist
 *	}
 * @param cb {func} cb(err, waring) err = critical, warning for example setting default value
 */
function checkObjKey(options, cb) {
	let	logPrefix	= topLogPrefix + 'checkObjKey() - ',
		warning;

	if (typeof cb !== 'function') {
		cb	= function () {};
	}

	if (typeof options !== 'object') {
		const	err	= new Error('options must be an object');
		log.error(logPrefix + err.message);
		return cb(err);
	}

	if (typeof options.obj !== 'object') {
		const	err	= new Error('options.obj must be an object');
		log.error(logPrefix + err.message);
		return cb(err);
	}

	if (typeof options.objectKey !== 'string' || options.objectKey === '') {
		const	err	= new Error('options.objectKey must be a non-emtpy string');
		log.error(logPrefix + err.message);
		return cb(err);
	}

	logPrefix += 'objectKey: "' + options.objectKey + '" - ';

	if (options.retries === undefined) {
		options.retries	= 0;
	}

	if (typeof options.default === 'string' && options.defaultLabel === undefined) {
		options.defaultLabel	= options.default;
	}

	log.silly(logPrefix + 'retry: ' + options.retries);

	// If validValues is provided, check if objectKey is one of these values
	if (Array.isArray(options.validValues) && options.validValues.indexOf(options.obj[options.objectKey]) !== - 1) {
		log.debug(logPrefix + 'obj["' + options.objectKey + '"] is set to a valid option, no modification needed');

	// If no validValues is set, but objectKey is, assume it is a correct value and stop checking
	} else if ( ! Array.isArray(options.validValues) && options.obj[options.objectKey] !== undefined) {
		log.debug(logPrefix + 'obj["' + options.objectKey + '"] is set, no modification needed');

	// Exhaused amount of retries, do something radical
	} else if (options.retries > 10) {

		// Fallback to the default
		if (options.default) {
			warning	= 'obj["' + options.objectKey + '"] is not set, setting default: "' + options.defaultLabel + '"';
			log.verbose(logPrefix + warning);
			options.obj[options.objectKey]	= options.default;

		// No default exists, return with error!
		} else {
			const	err	= new Error('obj["' + options.objectKey + '"] is not set, can not start.');
			log.error(logPrefix + err.message);
			log.verbose(logPrefix + err.stack);
			return cb(err, warning);
		}

	// Retry
	} else {
		setTimeout(function () {
			options.retries ++;
			checkObjKey(options, cb);
		}, options.retries * 10);
		return;
	}

	cb(undefined, warning);
}

exports = module.exports = checkObjKey;
