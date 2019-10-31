const chalk = require('chalk');

/**
 *  Display Errors
 */
const flashError = message => {
	console.error(chalk.bold.red(`✖ ${message}`));
	process.exit(1);
};

/**
 *  Shows next actions to user
 */
const showInitialCommandsToUser = ({ destination, portfolioDir }) => {
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

const showFinalInstructionsToUser = () => {
	console.log();
	console.log(chalk.green.bold(`  Warning!`));
	console.log(chalk.default(`   Do not delete or modify the ${chalk.cyan.bold(`portfolio-cli.json`)} file`));
	console.log();
	console.log(
		chalk.default(
			`What Next? We suggest that you read the instructions in ${chalk.cyan.bold(`README.md`)} to get started.`
		)
	);
	console.log();
	console.log(chalk.default(`Thanks for using ${chalk.cyan.bold(`abhijithvijayan-portflio CLI`)}`));
};

module.exports = { flashError, showInitialCommandsToUser, showFinalInstructionsToUser };
