/* eslint-disable default-case */
const execa = require('execa');
const chalk = require('chalk');
const inquirer = require('inquirer');

const Spinner = require('./spinner');
const flashError = require('./message');
const { isLinux, isWin } = require('./os');

// Initialize the spinner.
const spinner = new Spinner();

/**
 *  Trigger Git Installation
 */
const installGit = async () => {
	if (isWin) {
		const url = 'https://git-scm.com/download/win';
		// show installation info
	} else {
		const packageMgr = isLinux ? 'apt' : 'brew';
		// eslint-disable-next-line no-useless-catch
		try {
			await execa('sudo apt update', { stdio: 'inherit', shell: true });
			await execa(`${packageMgr} install git`, { stdio: 'inherit', shell: true });
			// You're good to go
		} catch (err) {
			// Something went wrong
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
			}
		} else {
			flashError(` Warning:- ${chalk.cyan.bold(`${dependency} is required to be installed`)}`);
		}
	}
};

module.exports = validateDependencyInstallation;
