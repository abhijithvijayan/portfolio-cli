/**
 *  @author abhijithvijayan <abhijithvijayan.in>
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const execa = require('execa');

const pkg = require('../package.json');
const { isWin } = require('./utils/os');
const Spinner = require('./utils/spinner');
const servePortfolioTemplate = require('./serve');
const flashError = require('./utils/displayMessages');
const argumentValidator = require('./utils/validate');
const deleteStrayFilesAndFolders = require('./utils/delete');
const validateDependencyInstallation = require('./utils/install');

const portfolioDir = 'portfolio';

/**
 *  Performs initial commit
 */
const performInitialCommit = () => {
	// Remove existing `.git` folder
	const OsRemoveCmd = isWin ? 'rmdir /s /q' : 'rm -rf';
	execa(`${OsRemoveCmd} ${path.join(portfolioDir, '.git')}`, { shell: true });

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

	// change into directory
	process.chdir(portfolioDir);

	deleteStrayFilesAndFolders();
	performInitialCommit();
	showInitialCommandsToUser(destination);
};

// eslint-disable-next-line prefer-const
let options = {};

/**
 *	Driver Function
 */
const initializeCLI = (_options, userInputs) => {
	// Run validators to CLI input flags
	const err = argumentValidator(_options);
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

module.exports.options = options;
module.exports = initializeCLI;
