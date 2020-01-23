const chalk = require('chalk');

/**
 *  Display Errors
 */
function flashError(message) {
	console.error(chalk.bold.red(`✖ ${message}`));
	process.exit(1);
}

/**
 *  Shows next actions to user
 */
function showInitialCommandsToUser({ destination, portfolioDir }) {
	console.log(chalk(`Initialized a git repository.`));
	console.log();
	console.log(
		chalk(
			`Success! Created ${portfolioDir} at ${destination}\nInside that directory, you can run several commands:`
		)
	);
	console.log();
	console.log(chalk.cyan.bold(`  yarn dev`));
	console.log(chalk(`    Starts the development server.`));
	console.log();
	console.log(chalk.cyan.bold(`  yarn build`));
	console.log(chalk(`    Bundles the app for production.`));
	console.log();
	console.log(chalk.cyan.bold(`  yarn export`));
	console.log(chalk(`    Bundles the app into static files using Next.js static exports.`));
	console.log();
	console.log(chalk(`We suggest that you begin by typing:`));
	console.log();
	console.log(chalk(`  ${chalk.cyan.bold(`cd`)} ${portfolioDir}`));
	console.log(chalk.cyan.bold(`  abhijithvijayan-portfolio serve`));
}

function showFinalInstructionsToUser() {
	console.log();
	console.log(chalk.green.bold(`  Warning!`));
	console.log(chalk(`   Do not delete or modify the ${chalk.cyan.bold(`portfolio-cli.json`)} file`));
	console.log();
	console.log(
		chalk(`What Next? We suggest that you read the instructions in ${chalk.cyan.bold(`README.md`)} to get started.`)
	);
	console.log();
	console.log(chalk(`Want to create remote repo as well?`));
	console.log();
	console.log(chalk(`Run ${chalk.cyan.bold(`npx create-remote-repo portfolio`)}`));
}

function showDeploymentConfigMessages() {
	console.log();
	console.log(chalk(`Success! Deployment configuration file for Travis CI created.`));
	console.log();
	console.log(chalk.cyan.bold(`Now sync repository with Travis CI at https://travis-ci.com/ to start deploying`));
}

module.exports = { flashError, showInitialCommandsToUser, showFinalInstructionsToUser, showDeploymentConfigMessages };
