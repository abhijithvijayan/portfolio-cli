const execa = require('execa');
const chalk = require('chalk');
const inquirer = require('inquirer');

const flashError = require('./message');

const checkIfDependencyIsInstalled = async command => {
	try {
		await execa(command, { shell: true });
		return true;
	} catch (err) {
		return false;
	}
};

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
			// Install it
		} else {
			flashError(` Warning:- ${chalk.cyan.bold(`${dependency} is required to be installed`)}`);
		}
	}
};

module.exports = validateDependencyInstallation;
