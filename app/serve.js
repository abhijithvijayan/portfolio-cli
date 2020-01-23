const fs = require('fs');
const execa = require('execa');
const chalk = require('chalk');

const Spinner = require('./utils/spinner');
const { readFileAsync } = require('./utils/fs');
const { flashError, showFinalInstructionsToUser } = require('./utils/displayMessages');
const validateDependencyInstallation = require('./utils/install');

/**
 *  Handles package installation
 */
async function installPackages() {
	console.log();
	const installDepsSpinner = new Spinner('Installing packages. This might take a couple of minutes.');
	installDepsSpinner.start();

	try {
		await execa('yarn', ['install']);
	} catch (err) {
		installDepsSpinner.fail(`Something went wrong. Couldn't install packages!`);
		throw err;
	}

	installDepsSpinner.succeed(`Success! Your new portfolio site is generated and ready to use.`);
}

/**
 *  Serve the template after package installation
 */
async function servePortfolioTemplate(portfolioDir) {
	// check if `portfolio-cli.json` exists
	if (!fs.existsSync('portfolio-cli.json')) {
		return flashError(`Error: Current directory doesn't have portfolio config file`);
	}

	// return if fetch wasn't successful
	const fileContent = await readFileAsync(`portfolio-cli.json`);
	const { fetch } = JSON.parse(fileContent.toString());

	if (!fetch) {
		return flashError(`Error: Directory ${chalk.cyan.bold(portfolioDir)} doesn't have required template files`);
	}

	await validateDependencyInstallation('yarn --version');
	await installPackages();
	showFinalInstructionsToUser();
}

module.exports = servePortfolioTemplate;
