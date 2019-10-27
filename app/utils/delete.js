const fs = require('fs');
const del = require('del');
const execa = require('execa');

const { isWin } = require('./os');
const { readFileAsync, writeFileAsync } = require('./fs');

const deleteStrayFilesAndFolders = async () => {
	const deleteCommand = isWin ? 'del' : 'rm';

	if (fs.existsSync('.kodiak.toml')) {
		execa(`${deleteCommand} .kodiak.toml`, { shell: true });
	}

	if (fs.existsSync('CONTRIBUTING.md')) {
		execa(`${deleteCommand} CONTRIBUTING.md`, { shell: true });
	}

	if (fs.existsSync('CODE_OF_CONDUCT.md')) {
		execa(`${deleteCommand} CODE_OF_CONDUCT.md`, { shell: true });
	}

	// overwrite `config/index.js` with `config/sample.js`
	if (fs.existsSync('config/index.js')) {
		await writeFileAsync('config/index.js', await readFileAsync('config/sample.js'));
	}

	if (fs.existsSync('public/resume.pdf')) {
		execa(`${deleteCommand} public/resume.pdf`, { shell: true });
	}

	// TODO:
	// update public/manifest.json
	// delete/replace README.md

	/**
	 *  delete markdown/** except sample.md
	 *  delete public/images
	 *  delete public/icons
	 */
	await del([
		'public/images/**',
		'public/icons/**',
		'markdown/home/**',
		'markdown/about/**',
		'markdown/experience/**',
		'markdown/featured/**',
		'markdown/projects/**',
		'markdown/contact/**',
		'!markdown/home',
		'!markdown/home/sample.md',
		'!markdown/about',
		'!markdown/about/sample.md',
		'!markdown/experience',
		'!markdown/experience/sample.md',
		'!markdown/featured',
		'!markdown/featured/sample.md',
		'!markdown/projects',
		'!markdown/projects/sample.md',
		'!markdown/contact',
		'!markdown/contact/sample.md',
	]);
};

module.exports = deleteStrayFilesAndFolders;
