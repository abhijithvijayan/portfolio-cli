/**
 *  @author abhijithvijayan <abhijithvijayan.in>
 */

const ora = require('ora');
const chalk = require('chalk');
const isObject = require('validate.io-object');
const isString = require('validate.io-string-primitive');
const isBoolean = require('validate.io-boolean-primitive');

const pkg = require('./package.json');

/**
 *  Display Errors
 */
const flashError = message => {
	console.error(chalk.bold.red(`✖ ${message}`));
	process.exit(1);
};

const options = {};
const validate = _options => {
	if (!isObject(_options)) {
		return new TypeError(`invalid input argument. Options argument must be an object. Value: \`${_options}\`.`);
	}
	if (
		Object.prototype.hasOwnProperty.call(_options, 'generate') ||
		Object.prototype.hasOwnProperty.call(_options, 'g')
	) {
		options.generate = _options.generate || _options.g;
		if (!isBoolean(options.generate)) {
			return new TypeError(`invalid option. Generate option must be a boolean primitive.`);
		}
	}
	if (
		Object.prototype.hasOwnProperty.call(_options, 'token') ||
		Object.prototype.hasOwnProperty.call(_options, 't')
	) {
		options.token = _options.token || _options.t;
		if (!isString(options.token)) {
			return new TypeError(`invalid option. Token must be a string primitive.`);
		}
	}
	if (Object.prototype.hasOwnProperty.call(_options, 'repo') || Object.prototype.hasOwnProperty.call(_options, 'r')) {
		options.repo = _options.repo || _options.r;
		if (!isString(options.repo)) {
			return new TypeError(`invalid option. Repo name must be a string primitive.`);
		}
	}
	if (
		Object.prototype.hasOwnProperty.call(_options, 'message') ||
		Object.prototype.hasOwnProperty.call(_options, 'm')
	) {
		options.message = _options.message || _options.m;
		if (!isString(options.message)) {
			return new TypeError(`invalid option. Commit message must be a string primitive.`);
		}
	}
	if (
		Object.prototype.hasOwnProperty.call(_options, 'version') ||
		Object.prototype.hasOwnProperty.call(_options, 'v')
	) {
		options.version = _options.version || _options.v;
		if (!isBoolean(options.version)) {
			return new TypeError(`invalid option. Version option must be a boolean primitive.`);
		}
	}
	return null;
};

const portfolioCLI = (_options, input) => {
	// Run validators to CLI input flags
	const err = validate(_options);
	if (err) {
		flashError(err);
		return;
	}

	const { token = '', repo, version } = options;

	if (version) {
		console.log(chalk.bold.green(pkg.version));
		return pkg.version;
	}

	// command `generate`
	const generate = input[0];
	if (!generate) {
		flashError('Error! generate is a required field.');
		return;
	}

	if (repo) {
		if (!token) {
			flashError('Error: creating repository needs token. Set --token');
		}
	}
};

module.exports = portfolioCLI;
