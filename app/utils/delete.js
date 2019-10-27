const fs = require('fs');
const execa = require('execa');
const chalk = require('chalk');

const { isWin } = require('./os');
const { readFileAsync, writeFileAsync } = require('./fs');

const deleteStrayFiles = async () => {
	const deleteCommand = isWin ? 'del' : 'rm';

	// 1. delete .kodiak.toml
	if (fs.existsSync('.kodiak.toml')) execa(`${deleteCommand} .kodiak.toml`, { shell: true });
	// 2. delete CONTRIBUTING.md
	if (fs.existsSync('CONTRIBUTING.md')) execa(`${deleteCommand} CONTRIBUTING.md`, { shell: true });
	// 3. delete CODE_OF_CONDUCT.md
	if (fs.existsSync('CODE_OF_CONDUCT.md')) execa(`${deleteCommand} CODE_OF_CONDUCT.md`, { shell: true });
	// 4.overwrite `config/index.js` with `config/sample.js`
	if (fs.existsSync('config/index.js')) {
		await writeFileAsync('config/index.js', await readFileAsync('config/sample.js'));
	}
	// update public/manifest.json
	// delete/replace README.md
	// delete markdown/**/* except sample.md
	// delete public/images
	// delete public/icons
};

module.exports = deleteStrayFiles;
