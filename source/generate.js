const path = require('path');
const execa = require('execa');

const pkg = require('../package.json');
const {isWin} = require('./utils/os');
const Spinner = require('./utils/spinner');
const currentDate = require('./utils/moment');
const {writeFileAsync} = require('./utils/fs');
const deleteStrayFilesAndFolders = require('./utils/delete');
const validateDependencyInstallation = require('./utils/install');
const {showInitialCommandsToUser} = require('./utils/displayMessages');

let CLIConfig = {};

/**
 *  Write CLI config file locally to project
 */
async function writeConfigFileToFolder(directory) {
  // last commit id
  const {stdout} = await execa('git', ['log', '--format="%H"', '-n', '1']);

  CLIConfig = [
    '{',
    `  "name": "${directory}",`,
    `  "version": "${pkg.version}",`,
    `  "sync": true,`,
    `  "generatedBy": "${pkg.name}",`,
    `  "generatedOn": "${currentDate}",`,
    `  "remote": "https://github.com/abhijithvijayan/v6",`,
    `  "commit": ${stdout}`,
    '}',
  ];

  await writeFileAsync('portfolio-cli.json', CLIConfig.join('\n').toString());
}

/**
 *  Performs initial commit
 */
async function performInitialCommit() {
  // Remove existing `.git` folder
  const OsRemoveCmd = isWin ? 'rmdir /s /q' : 'rm -rf';
  // delete .git folder
  await execa(`${OsRemoveCmd} .git`, {shell: true});

  const commands = [
    'init',
    'add%.',
    'commit%-m "⚡️ Initial commit from @abhijithvijayan/portfolio CLI"',
  ];

  for await (const command of commands) {
    execa.sync('git', command.split('%'));
  }
}

/**
 *  Fetch and Clone the template
 */
async function fetchPortfolioTemplate(destination, directory) {
  // validate git installation
  await validateDependencyInstallation('git help -a');

  const repoURL = 'https://github.com/abhijithvijayan/v6';

  const fetchSpinner = new Spinner(
    `Generating a new portfolio site in ${destination}`
  );
  console.log();
  fetchSpinner.start();

  try {
    await execa('git', [
      'clone',
      repoURL,
      '--branch',
      'master',
      '--single-branch',
      directory,
    ]);
  } catch (err) {
    fetchSpinner.fail('Something went wrong');
    throw err;
  }

  fetchSpinner.stop();
}

/**
 *  Generator Function
 */
async function generatePortfolio(directory) {
  const destination = path.resolve(process.cwd(), directory);
  await fetchPortfolioTemplate(destination, directory);

  // change into directory
  process.chdir(directory);

  await deleteStrayFilesAndFolders();
  await writeConfigFileToFolder(directory);
  await performInitialCommit();
  showInitialCommandsToUser({destination, directory});
}

module.exports = generatePortfolio;
