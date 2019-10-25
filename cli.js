#!/usr/bin/env node

const meow = require('meow');
const portfolioCLI = require('./');

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
			boolean: ['version'],
			string: ['generate', 'token', 'repo', 'message'],
			alias: {
				g: 'generate',
				r: 'repo',
				t: 'token',
				v: 'version',
			},
		},
	}
);

portfolioCLI(cli.flags);
