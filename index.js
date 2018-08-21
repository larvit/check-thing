'use strict';

const topLogPrefix = 'check-object-key: index.js: ';
const LUtils       = require('larvitutils');

/**
 * Checking an object key
 *
 * @param {obj} options {
 *		'obj':	object	- Object to have its keys checked
 *		'objectKey':	string	- object key name
 *		'default':	any	- The default value if it does not exist
 *		'defaultLabel':	string	- What to print in the log as the default value (will default to "default" if it is a string)
 *		'retries': integer	- used internally. Set to 10+ to have the method immediately set the default value or fail if the key does not exist
 *	}
 * @param {func} cb cb(err, waring) err = critical, warning for example setting default value
 * @returns {obj} self
 */
function checkObjKey(options, cb) {
	let logPrefix = topLogPrefix + 'checkObjKey() - ';
	let warning;
	let log;

	if (typeof cb !== 'function') {
		cb = function () {};
	}

	options = options || {};

	if (typeof options !== 'object') {
		const err = new Error('options must be an object');

		return cb(err);
	}

	if (! options.log) {
		const lUtils = new LUtils();

		options.log = new lUtils.Log();
	}
	log = options.log;

	if (typeof options.objectKey !== 'string' || options.objectKey === '') {
		const err = new Error('options.objectKey must be a non-emtpy string');

		log.error(logPrefix + err.message);

		return cb(err);
	}

	if (! options.orgStack) {
		const err = new Error('Stack');

		options.orgStack = err.stack;
	}

	logPrefix += 'objectKey: "' + options.objectKey + '" - ';

	if (options.retries === undefined) {
		options.retries = 0;
	}

	if ((typeof options.default) === 'string' && options.defaultLabel === undefined) {
		options.defaultLabel = '"' + options.default + '"';
	} else if (! options.defaultLabel) {
		options.defaultLabel = String(options.default);
	}

	log.silly(logPrefix + 'retry: ' + options.retries);

	// If validValues is provided, check if objectKey is one of these values
	if (Array.isArray(options.validValues) && options.validValues.indexOf(options.obj[options.objectKey]) !== - 1) {
		log.debug(logPrefix + 'obj["' + options.objectKey + '"] is set to a valid option, no modification needed');

	// If no validValues is set, but objectKey is, assume it is a correct value and stop checking
	} else if (! Array.isArray(options.validValues) && options.obj[options.objectKey] !== undefined) {
		log.debug(logPrefix + 'obj["' + options.objectKey + '"] is set, no modification needed');

	// Exhaused amount of retries, do something radical
	} else if (options.retries > 10) {
		// Fallback to the default
		if (Object.keys(options).indexOf('default') !== - 1) {
			warning	= 'obj["' + options.objectKey + '"] is not set, setting default: ' + options.defaultLabel;
			log.verbose(logPrefix + warning);
			log.verbose(logPrefix + options.orgStack);
			options.obj[options.objectKey]	= options.default;

		// No default exists, return with error!
		} else {
			const err = new Error('obj["' + options.objectKey + '"] is not set, can not start.');

			warning = err.message;
			log.error(logPrefix + err.message);
			log.verbose(logPrefix + options.orgStack);

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
