/**
 *  @author abhijithvijayan <abhijithvijayan.in>
 */

const chalk = require('chalk');

const pkg = require('./package.json');

/**
 *  Display Errors
 */
const flashError = message => {
  console.error(chalk.bold.red(`✖ ${message}`));
  process.exit(1);
};

const portfolioCLI = (_options) => {

  const {version} = _options;

  if (version) {
    console.log(chalk.bold.green(pkg.version));
    return pkg.version;
  }

}

module.exports = portfolioCLI;