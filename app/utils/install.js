/* eslint-disable default-case */
const execa = require('execa');
const chalk = require('chalk');
const inquirer = require('inquirer');

const Spinner = require('./spinner');
const flashError = require('./displayMessages');
const { isLinux, isWin } = require('./os');

const spinner = new Spinner();

/**
 *  Trigger Git Installation
 */
const installGit = async () => {
	if (isWin) {
		const url = 'https://git-scm.com/download/win';
		// ToDo: show installation info
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
};

/**
 *  Trigger yarn installation
 */
const installYarn = async () => {
	if (isWin) {
		const url = 'https://yarnpkg.com/lang/en/docs/install/#windows-stable';
		// ToDo: show installation info
	} else {
		const packageManager = isLinux ? 'apt' : 'brew';
		// eslint-disable-next-line no-useless-catch
		try {
			await execa('sudo apt update', { stdio: 'inherit', shell: true });
			// ToDo: If needed, configure the repository first
			await execa(`${packageManager} install yarn`, { stdio: 'inherit', shell: true });
			// show success message
		} catch (err) {
			// Something went wrong during installation
			throw err;
		}
	}
};

/**
 *  Run dependency command to see if it is installed
 */
const checkIfDependencyIsInstalled = async command => {
	try {
		await execa(command, { shell: true });
		return true;
	} catch (err) {
		return false;
	}
};

/**
 *  Installation Validator | Installer
 */
const validateDependencyInstallation = async dependency => {
	const isInstalled = await checkIfDependencyIsInstalled(dependency);
	if (!isInstalled) {
		const { depToInstall } = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'depToInstall',
				message: `Sorry, ${dependency} is not installed on your system, Do you want to install it?`,
			},
		]);
		if (depToInstall) {
			spinner.text = `Installing ${dependency}`;
			spinner.start();

			// Install dependencies
			switch (dependency) {
				case 'git help -a': {
					await installGit();
					break;
				}
				case 'yarn --version': {
					await installYarn();
					break;
				}
			}
		} else {
			flashError(` Warning:- ${chalk.cyan.bold(`${dependency} is required to be installed`)}`);
		}
	}
};

module.exports = validateDependencyInstallation;
