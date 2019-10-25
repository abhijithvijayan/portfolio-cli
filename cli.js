#!/usr/bin/env node
'use strict';
const meow = require('meow');
const cli = require('./');

meow(`
	Usage
	  $ abhijithvijayan-portfolio [input]

  Options
    --generate  Lorem ipsum

  Examples
    $ abhijithvijayan-portfolio --generate
`, {
	flags: {}
});

