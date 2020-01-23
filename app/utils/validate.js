const isObject = require('validate.io-object');
const isString = require('validate.io-string-primitive');
const isBoolean = require('validate.io-boolean-primitive');

const cli = require('../cli');

/**
 *  CLI arguments validator
 */
const argumentValidator = _options => {
	const { options } = cli;

	if (!isObject(_options)) {
		return new TypeError(`invalid input argument. Options argument must be an object. Value: \`${_options}\`.`);
	}

	return null;
};

module.exports = argumentValidator;
