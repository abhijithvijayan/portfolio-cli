/* eslint-disable default-case */
const execa = require('execa');
const chalk = require('chalk');
const inquirer = require('inquirer');

const Spinner = require('./spinner');
const { isLinux, isWin } = require('./os');
const flashError = require('./displayMessages');

const spinner = new Spinner();

/**
 *  Trigger Git Installation
 */
async function installGit() {
	if (isWin) {
		const url = 'https://git-scm.com/download/win';
		flashError(`Follow instructions online at ${url}`);
	} else {
		const packageManager = isLinux ? 'apt' : 'brew';

		// eslint-disable-next-line no-useless-catch
		try {
			await execa('sudo apt update', { stdio: 'inherit', shell: true });
			await execa(`${packageManager} install git`, { stdio: 'inherit', shell: true });
			// show success message
		} catch (err) {
			// Something went wrong during installation
			throw err;
		}
	}
}

/**
 *  Trigger yarn installation
 */
async function installYarn() {
	if (isWin) {
		const url = 'https://yarnpkg.com/lang/en/docs/install/#windows-stable';
		flashError(`Follow instructions online at ${url}`);
	} else {
		const packageManager = isLinux ? 'apt' : 'brew';

		// eslint-disable-next-line no-useless-catch
		try {
			await execa('sudo apt update', { stdio: 'inherit', shell: true });
			// ToDo: If needed, configure the yarn repository first
			await execa(`${packageManager} install yarn`, { stdio: 'inherit', shell: true });
			// show success message
		} catch (err) {
			// Something went wrong during installation
			throw err;
		}
	}
}

/**
 *  Install the missing dependency
 */
async function installDependency(dependency) {
	spinner.text = `Installing ${dependency}`;
	spinner.start();

	// Install dependencies
	if (dependency === 'git help -a') {
		await installGit();
	} else if (dependency === 'yarn --version') {
		await installYarn();
	}
}

/**
 *  Run dependency command to see if it is installed
 */
async function checkIfDependencyIsInstalled(command) {
	try {
		await execa(command, { shell: true });
		return true;
	} catch (err) {
		return false;
	}
}

/**
 *  Installation Validator
 */
async function validateDependencyInstallation(dependency) {
	const isInstalled = await checkIfDependencyIsInstalled(dependency);

	if (!isInstalled) {
		const { shouldInstallDep } = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'shouldInstallDep',
				message: `Sorry, ${dependency} is not installed on your system, Do you want to install it?`,
			},
		]);

		if (shouldInstallDep) {
			await installDependency(dependency);
		} else {
			flashError(` Warning:- ${chalk.cyan.bold(`${dependency} is required to be installed`)}`);
		}
	}
}

module.exports = validateDependencyInstallation;
