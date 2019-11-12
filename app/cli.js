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
const currentDate = require('./utils/moment');
const { writeFileAsync } = require('./utils/fs');
const servePortfolioTemplate = require('./serve');
const argumentValidator = require('./utils/validate');
const deleteStrayFilesAndFolders = require('./utils/delete');
const validateDependencyInstallation = require('./utils/install');
const { flashError, showInitialCommandsToUser } = require('./utils/displayMessages');

const options = {};
let cliConfigContent = {};
const portfolioDir = 'portfolio';

/**
 *  Write CLI config file locally to project
 */
const writeConfigFileToFolder = async () => {
	cliConfigContent = [
		'{',
		`  "name": "${portfolioDir}",`,
		`  "version": "${pkg.version}",`,
		`  "fetch": true,`,
		`  "generatedOn": "${currentDate}",`,
		`  "remote": "https://github.com/abhijithvijayan/portfolio-cli"`,
		'}',
	];

	await writeFileAsync('portfolio-cli.json', cliConfigContent.join('\n').toString());
};

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
 *  Fetch and Clone the template
 */
const fetchPortfolioTemplate = async destination => {
	// validate git installation
	await validateDependencyInstallation('git help -a');

	const repoURL = 'https://github.com/abhijithvijayan/abhijithvijayan.in';

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
};

/**
 *  Generator Function
 */
const generatePortfolio = async () => {
	const destination = path.resolve(process.cwd(), portfolioDir);
	await fetchPortfolioTemplate(destination);

	// change into directory
	process.chdir(portfolioDir);

	await deleteStrayFilesAndFolders();
	await writeConfigFileToFolder();
	await performInitialCommit();

	showInitialCommandsToUser({ destination, portfolioDir });
};

/**
 *	Driver Function
 */
const initializeCLI = async (_options, userInputs) => {
	// Run validators to CLI input flags
	const err = argumentValidator(_options);

	if (err) {
		return flashError(err);
	}

	const { version } = options;

	if (version) {
		console.log(chalk.default(pkg.version));
		return;
	}

	const firstInput = userInputs[0];
	let generate = false;
	let serve = false;

	if (!firstInput || (firstInput !== 'generate' && firstInput !== 'serve')) {
		return flashError('Error: Unknown input fields. Please provide a valid argument.');
	}

	if (firstInput === 'generate') {
		generate = true;
	} else if (firstInput === 'serve') {
		serve = true;
	}

	if (fs.existsSync(portfolioDir) && !serve) {
		return flashError(`Error: Directory ${chalk.cyan.bold(portfolioDir)} already exists in path!`);
	}

	if (generate) {
		await generatePortfolio();
	} else if (serve) {
		await servePortfolioTemplate(portfolioDir);
	}
};

module.exports.options = options;
module.exports = initializeCLI;
