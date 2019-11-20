const fs = require('fs');

const { writeFileAsync } = require('./utils/fs');
const { flashError } = require('./utils/displayMessages');
const { sampleTravisConfigContent } = require('./utils/template');

const setUpDeployConfig = async () => {
	// check if `portfolio-cli.json` exists
	if (!fs.existsSync('portfolio-cli.json')) {
		return flashError(`Error: Current directory doesn't have portfolio config file`);
	}

	// ToDo: add key to config file

	await writeFileAsync('.travis.yml', sampleTravisConfigContent);
};

module.exports = setUpDeployConfig;
