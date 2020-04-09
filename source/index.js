#!/usr/bin/env node

/**
 *  @author abhijithvijayan <abhijithvijayan.in>
 */

const fs = require('fs');
const chalk = require('chalk');

const cli = require('./cli');
const setUpDeployment = require('./deploy');
const servePortfolioTemplate = require('./serve');
const generatePortfolio = require('./generate');
const argumentValidator = require('./utils/validate');
const { flashError } = require('./utils/displayMessages');

const PORTFOLIO_DIRECTORY = 'portfolio';
const options = {};

/**
 *	Driver Function
 */
(async () => {
	// Run validators to CLI input flags
	const err = argumentValidator(cli.flags);

	if (err) {
		return flashError(err);
	}

	let generate = false;
	let serve = false;
	let deploy = false;

	// get user input
	const [input] = cli.input;

	/**
	 *  Exit if User's input is invalid
	 */
	if (!input || (input !== 'generate' && input !== 'serve' && input !== 'deploy')) {
		return flashError('Error: Unknown input fields. Please provide a valid argument.');
	}

	if (input === 'generate') {
		generate = true;
	} else if (input === 'serve') {
		serve = true;
	} else if (input === 'deploy') {
		deploy = true;
	}

	/**
	 *  Exit if directory exists (only for generate command)
	 */
	if (fs.existsSync(PORTFOLIO_DIRECTORY) && !serve && !deploy) {
		return flashError(`Error: Directory ${chalk.cyan.bold(PORTFOLIO_DIRECTORY)} already exists in path!`);
	}

	if (generate) {
		await generatePortfolio(PORTFOLIO_DIRECTORY);
	} else if (serve) {
		await servePortfolioTemplate(PORTFOLIO_DIRECTORY);
	} else if (deploy) {
		await setUpDeployment();
	}
})();

module.exports.options = options;
