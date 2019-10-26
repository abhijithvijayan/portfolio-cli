const execa = require('execa');
const Spinner = require('./utils/spinner');

const servePortfolioTemplate = async templateDir => {
	const installDepsSpinner = new Spinner('Installing dependencies in the background. Hold on...');
	installDepsSpinner.start();

	// ToDo: check if yarn installed first
	try {
		await execa('yarn', ['install']);
	} catch (err) {
		installDepsSpinner.fail(`Something went wrong. Couldn't install the dependencies!`);
		throw err;
	}
	installDepsSpinner.succeed(`You're all set`);

	// ToDo: Delete unwanted content & serve on port
};

module.exports = servePortfolioTemplate;
