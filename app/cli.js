/**
 *  @author abhijithvijayan <abhijithvijayan.in>
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const isObject = require('validate.io-object');
const isString = require('validate.io-string-primitive');
const isBoolean = require('validate.io-boolean-primitive');

const pkg = require('../package.json');
const Spinner = require('./utils/spinner');
const { isWin } = require('./utils/os');

const options = {};
const projectName = 'portfolio';

/**
 *  CLI arguments validator
 */
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

/**
 *  Display Errors
 */
const flashError = message => {
	console.error(chalk.bold.red(`✖ ${message}`));
	process.exit(1);
};

/**
 *  Performs initial commit
 */
const performInitialCommit = () => {
	// change into directory
	process.chdir(projectName);
	const commands = ['init', 'add%.', 'commit%-m "⚡️ Initial commit from abhijithvijayan-portfolio CLI"'];
	commands.forEach(command => {
		return execa.sync('git', command.split('%'));
	});
};

/**
 *  Logs next actions to user
 */
const showInitialInstructions = () => {
	console.log();
	console.log(chalk.cyan.bold(` You're all set`));
	console.log(
		chalk.cyan.bold(
			` Now, just type in ${chalk.green.bold(`cd ${projectName}`)} && ${chalk.green.bold(
				'abhijithvijayan-portfolio serve'
			)}`
		)
	);

	// Remove `.git` folder
	const OsRemoveCmd = isWin ? 'rmdir /s /q' : 'rm -rf';
	execa(`${OsRemoveCmd} ${path.join(projectName, '.git')}`, { shell: true });

	// Initial commit template files
	performInitialCommit();
};

/**
 *  Fetch and Clone the template
 */
const fetchTemplate = async () => {
	// ToDo: Check if `git help -a` returns anything

	const repoURL = 'https://github.com/abhijithvijayan/abhijithvijayan.in';

	const fetchSpinner = new Spinner('Fetching the boilerplate template');
	fetchSpinner.start();

	try {
		// ToDo: use repo name as folder
		await execa('git', ['clone', repoURL, '--branch', 'master', '--single-branch', projectName]);
	} catch (err) {
		fetchSpinner.fail('Something went wrong');
		throw err;
	}

	fetchSpinner.stop();

	// Show initial instructions to the user
	showInitialInstructions();
};

/**
 *	Driver Function
 *
 *  @param {Object} _options
 *  @param {Array} input
 */
const initializeCLI = (_options, input) => {
	// Run validators to CLI input flags
	const err = validate(_options);
	if (err) {
		return flashError(err);
	}

	const { token = '', repo, version } = options;

	if (version) {
		console.log(chalk.bold.green(pkg.version));
		return pkg.version;
	}

	// ToDo: handle this validator
	const generate = input[0];
	if (!generate || generate !== 'generate') {
		return flashError('Error! generate is a required field.');
	}

	if (repo) {
		if (!token) {
			return flashError('Error: creating repository needs token. Set --token');
		}
	}

	if (fs.existsSync(projectName)) {
		return flashError(`Error: Directory ${chalk.cyan.bold(projectName)} already exists in path!`);
	}

	fetchTemplate();
};

module.exports = initializeCLI;
