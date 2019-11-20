#!/usr/bin/env node

const meow = require('meow');
const initializeCLI = require('./cli');

const cli = meow(
	`
	Usage
	  $ abhijithvijayan-portfolio [input] [options]

	Input
		generate	Bootstraps the portfolio template
		serve  		Serves the portfolio template locally
		deploy    Creates a travis config file to deploy to GitHub Pages

	Options
		-v, --version          Show the version and exit with code 0

  Examples
		$ abhijithvijayan-portfolio generate
`,
	{
		flags: {
			input: ['generate', 'serve', 'deploy'],
			boolean: ['version'],
			string: [],
			alias: {
				v: 'version',
			},
		},
	}
);

initializeCLI(cli.flags, cli.input);
