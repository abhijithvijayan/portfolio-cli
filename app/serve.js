const execa = require('execa');
const Spinner = require('./utils/spinner');

const validateDependencyInstallation = require('./utils/install');

const servePortfolioTemplate = async templateDir => {
	await validateDependencyInstallation('yarn --version');

	const installDepsSpinner = new Spinner('Installing packages. This might take a couple of minutes.').start();

	try {
		await execa('yarn', ['install']);
	} catch (err) {
		installDepsSpinner.fail(`Something went wrong. Couldn't install packages!`);
		throw err;
	}
	installDepsSpinner.succeed(`Success!`);

	// ToDo: Serve on port
};

module.exports = servePortfolioTemplate;
