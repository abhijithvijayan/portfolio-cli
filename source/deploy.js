const fs = require('fs');

const currentDate = require('./utils/moment');
const { flashError, showDeploymentConfigMessages } = require('./utils/displayMessages');
const { writeFileAsync, readFileAsync } = require('./utils/fs');
const { sampleTravisConfigContent } = require('./utils/template');

async function setUpDeployConfig() {
	// check if `portfolio-cli.json` exists
	if (!fs.existsSync('portfolio-cli.json')) {
		return flashError(`Error: Current directory doesn't have portfolio config file`);
	}

	try {
		// create travis config file
		await writeFileAsync('.travis.yml', sampleTravisConfigContent);

		showDeploymentConfigMessages();
	} catch (err) {
		return flashError(err);
	}

	const configFile = await readFileAsync(`portfolio-cli.json`);
	const configFileContent = JSON.parse(configFile.toString());

	// inject fields to config file
	configFileContent.deploy = true;
	configFileContent.ci = 'travis';
	configFileContent.provider = 'gh-pages';
	configFileContent.enabled = currentDate;

	const writeFileContent = JSON.stringify(configFileContent, null, 2);

	// write back the config file
	return writeFileAsync(`portfolio-cli.json`, writeFileContent);
}

module.exports = setUpDeployConfig;
