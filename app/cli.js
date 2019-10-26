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
const { isWin } = require('./utils/os');
const Spinner = require('./utils/spinner');
const servePortfolioTemplate = require('./serve');
const flashError = require('./utils/displayMessages');
const validateDependencyInstallation = require('./utils/install');

const options = {};
const portfolioDir = 'portfolio';

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
		if (!isBoolean(options.generate))
			return new TypeError(`invalid option. Generate option must be a boolean primitive.`);
	}
	if (
		Object.prototype.hasOwnProperty.call(_options, 'token') ||
		Object.prototype.hasOwnProperty.call(_options, 't')
	) {
		options.token = _options.token || _options.t;
		if (!isString(options.token)) return new TypeError(`invalid option. Token must be a string primitive.`);
	}
	if (Object.prototype.hasOwnProperty.call(_options, 'repo') || Object.prototype.hasOwnProperty.call(_options, 'r')) {
		options.repo = _options.repo || _options.r;
		if (!isString(options.repo)) return new TypeError(`invalid option. Repo name must be a string primitive.`);
	}
	if (
		Object.prototype.hasOwnProperty.call(_options, 'message') ||
		Object.prototype.hasOwnProperty.call(_options, 'm')
	) {
		options.message = _options.message || _options.m;
		if (!isString(options.message))
			return new TypeError(`invalid option. Commit message must be a string primitive.`);
	}
	if (
		Object.prototype.hasOwnProperty.call(_options, 'version') ||
		Object.prototype.hasOwnProperty.call(_options, 'v')
	) {
		options.version = _options.version || _options.v;
		if (!isBoolean(options.version))
			return new TypeError(`invalid option. Version option must be a boolean primitive.`);
	}
	return null;
};

/**
 *  Performs initial commit
 */
const performInitialCommit = () => {
	// Remove existing `.git` folder
	const OsRemoveCmd = isWin ? 'rmdir /s /q' : 'rm -rf';
	execa(`${OsRemoveCmd} ${path.join(portfolioDir, '.git')}`, { shell: true });

	// change into directory
	process.chdir(portfolioDir);

	const commands = ['init', 'add%.', 'commit%-m "⚡️ Initial commit from abhijithvijayan-portfolio CLI"'];
	commands.forEach(command => {
		return execa.sync('git', command.split('%'));
	});
};

/**
 *  Shows next actions to user
 */
const showInitialCommandsToUser = destination => {
	console.log(chalk.default(`Initialized a git repository.`));
	console.log();
	console.log(
		chalk.default(
			`Success! Created ${portfolioDir} at ${destination}\nInside that directory, you can run several commands:`
		)
	);
	console.log();
	console.log(chalk.cyan.bold(`  yarn dev`));
	console.log(chalk.default(`    Starts the development server.`));
	console.log();
	console.log(chalk.cyan.bold(`  yarn build`));
	console.log(chalk.default(`    Bundles the app for production.`));
	console.log();
	console.log(chalk.cyan.bold(`  yarn export`));
	console.log(chalk.default(`    Bundles the app into static files using Next.js static exports.`));
	console.log();
	console.log(chalk.default(`We suggest that you begin by typing:`));
	console.log();
	console.log(chalk.default(`  ${chalk.cyan.bold(`cd`)} ${portfolioDir}`));
	console.log(chalk.cyan.bold(`  abhijithvijayan-portfolio serve`));
};

/**
 *  Fetch and Clone the template
 */
const fetchPortfolioTemplate = async () => {
	await validateDependencyInstallation('git help -a');

	const repoURL = 'https://github.com/abhijithvijayan/abhijithvijayan.in';
	const destination = path.resolve(process.cwd(), portfolioDir);
	const fetchSpinner = new Spinner(`Generating a new portfolio site in ${destination}`);

	console.log();
	fetchSpinner.start();
	try {
		await execa('git', ['clone', repoURL, '--branch', 'master', '--single-branch', portfolioDir]);
	} catch (err) {
		fetchSpinner.fail('Something went wrong');
		throw err;
	}
	fetchSpinner.stop();

	performInitialCommit();
	showInitialCommandsToUser(destination);
};

/**
 *	Driver Function
 */
const initializeCLI = (_options, userInputs) => {
	// Run validators to CLI input flags
	const err = validate(_options);
	if (err) return flashError(err);

	const { token = '', repo, version } = options;

	if (version) {
		console.log(chalk.bold.green(pkg.version));
		return pkg.version;
	}

	const firstInput = userInputs[0];
	let generate = false;
	let serve = false;

	if (!firstInput || (firstInput !== 'generate' && firstInput !== 'serve'))
		return flashError('Error! Unknown input fields');

	if (firstInput === 'generate') generate = true;
	else if (firstInput === 'serve') serve = true;

	if (!generate && !serve) return flashError('Error: Input fields missing');

	if (repo) {
		if (!token) return flashError('Error: creating repository needs token. Set --token');
	}
	if (fs.existsSync(portfolioDir))
		return flashError(`Error: Directory ${chalk.cyan.bold(portfolioDir)} already exists in path!`);

	if (generate) {
		fetchPortfolioTemplate();
	} else if (serve) {
		servePortfolioTemplate(portfolioDir);
	}
};

module.exports = initializeCLI;
