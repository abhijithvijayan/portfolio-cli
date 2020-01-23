const isObject = require('validate.io-object');

// const cli = require('../cli');

/**
 *  CLI arguments validator
 */
function argumentValidator(_options) {
	// const { options } = cli;

	if (!isObject(_options)) {
		return new TypeError(`invalid input argument. Options argument must be an object. Value: \`${_options}\`.`);
	}

	return null;
}

module.exports = argumentValidator;
