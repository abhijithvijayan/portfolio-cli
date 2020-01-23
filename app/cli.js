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
const setUpDeployment = require('./deploy');
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
	// last commit id
	const { stdout } = await execa('git', ['log', '--format="%H"', '-n', '1']);

	cliConfigContent = [
		'{',
		`  "name": "${portfolioDir}",`,
		`  "version": "${pkg.version}",`,
		`  "fetch": true,`,
		`  "generatedOn": "${currentDate}",`,
		`  "remote": "https://github.com/abhijithvijayan/abhijithvijayan.in",`,
		`  "commit": ${stdout}`,
		'}',
	];

	await writeFileAsync('portfolio-cli.json', cliConfigContent.join('\n').toString());
};

/**
 *  Performs initial commit
 */
const performInitialCommit = async () => {
	// Remove existing `.git` folder
	const OsRemoveCmd = isWin ? 'rmdir /s /q' : 'rm -rf';
	// delete .git folder
	await execa(`${OsRemoveCmd} .git`, { shell: true });

	const commands = ['init', 'add%.', 'commit%-m "⚡️ Initial commit from abhijithvijayan-portfolio CLI"'];

	for await (const command of commands) {
		execa.sync('git', command.split('%'));
	}
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

	let generate = false;
	let serve = false;
	let deploy = false;

	// get user input
	const firstInput = userInputs[0];

	/**
	 *  Exit if User's input is invalid
	 */
	if (!firstInput || (firstInput !== 'generate' && firstInput !== 'serve' && firstInput !== 'deploy')) {
		return flashError('Error: Unknown input fields. Please provide a valid argument.');
	}

	if (firstInput === 'generate') {
		generate = true;
	} else if (firstInput === 'serve') {
		serve = true;
	} else if (firstInput === 'deploy') {
		deploy = true;
	}

	/**
	 *  Exit if directory exists (only for generate command)
	 */
	if (fs.existsSync(portfolioDir) && !serve && !deploy) {
		return flashError(`Error: Directory ${chalk.cyan.bold(portfolioDir)} already exists in path!`);
	}

	if (generate) {
		await generatePortfolio();
	} else if (serve) {
		await servePortfolioTemplate(portfolioDir);
	} else if (deploy) {
		await setUpDeployment();
	}
};

module.exports.options = options;
module.exports = initializeCLI;
