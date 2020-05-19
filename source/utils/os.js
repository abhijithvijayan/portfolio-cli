const isWin = process.platform === 'win32';
const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

module.exports = {
  isMac,
  isWin,
  isLinux,
};
