const fs = require('fs');
const execa = require('execa');
const chalk = require('chalk');
const { isWin } = require('./os');

const deleteStrayFiles = async () => {
	const deleteCommand = isWin ? 'del' : 'rm';

	// 1. delete .kodiak.toml
	if (fs.existsSync('.kodiak.toml')) execa(`${deleteCommand} .kodiak.toml`, { shell: true });
	// 2. delete CODE_OF_CONDUCT.md
	if (fs.existsSync('CONTRIBUTING.md')) execa(`${deleteCommand} CONTRIBUTING.md`, { shell: true });
	// 3. delete CODE_OF_CONDUCT.md
	if (fs.existsSync('CODE_OF_CONDUCT.md')) execa(`${deleteCommand} CODE_OF_CONDUCT.md`, { shell: true });
	// 4. delete public/icons
	// 5. delete public/images
	// 6. delete public/resume.pdf
	// 7. update public/manifest.json
	// 8. delete markdown/**/* except sample.md
	// 9. delete/replace README.md
};

module.exports = deleteStrayFiles;
