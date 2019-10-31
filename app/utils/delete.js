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

	// overwrite public/manifest.json
	if (fs.existsSync('public/manifest.json')) {
		const sampleManifestContent = {
			name: 'Developer',
			short_name: 'Developer',
			icons: [
				{
					src: '',
					sizes: '72x72',
					type: 'image/png',
				},
				{
					src: '',
					sizes: '96x96',
					type: 'image/png',
				},
				{
					src: '',
					sizes: '128x128',
					type: 'image/png',
				},
				{
					src: '',
					sizes: '144x144',
					type: 'image/png',
				},
				{
					src: '',
					sizes: '152x152',
					type: 'image/png',
				},
				{
					src: '',
					sizes: '192x192',
					type: 'image/png',
				},
				{
					src: '',
					sizes: '384x384',
					type: 'image/png',
				},
				{
					src: '',
					sizes: '512x512',
					type: 'image/png',
				},
			],
			theme_color: '#0a192f',
			background_color: '#020c1b',
			start_url: '/',
			display: 'standalone',
			orientation: 'portrait',
		};

		await writeFileAsync('public/manifest.json', JSON.stringify(sampleManifestContent));
	}

	// TODO:
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
