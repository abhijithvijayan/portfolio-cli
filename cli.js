#!/usr/bin/env node

const meow = require('meow');
const initializeCLI = require('./src/');

const cli = meow(
	`
	Usage
	  $ abhijithvijayan-portfolio [input]

  Options
    --generate  Lorem ipsum

  Examples
    $ abhijithvijayan-portfolio --generate
`,
	{
		flags: {
			input: ['generate'],
			boolean: ['version'],
			string: ['token', 'repo', 'message'],
			alias: {
				g: 'generate',
				r: 'repo',
				t: 'token',
				v: 'version',
			},
		},
	}
);

initializeCLI(cli.flags, cli.input);
