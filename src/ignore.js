/**
 * A method to add files to ignore to .gitignore and .npmignore.
 *
 * @author Daniel Steinhauer.
 */

const fs = require('fs');

const files = require('./files.js');

module.exports = function ignoreKeys() {
  const fileAlreadyIgnores = (filepath) => (fs.existsSync(filepath)
    ? fs.readFileSync(filepath).includes('credentials.*.key')
    : false);

  const linesOfIgnorance = '\n# Node schluessel credentials keys\ncredentials.*.key\n';
  const npmIgn = `${files.path}/.npmignore`;
  const gitIgn = `${files.path}/.gitignore`;

  if (fs.existsSync(npmIgn)) {
    if (!fileAlreadyIgnores(npmIgn)) {
      fs.appendFileSync(npmIgn, linesOfIgnorance);
    }
  }

  // Is this a git repo?
  if (fs.existsSync(`${files.path}/.git`)) {
    // If so, we don't care for whether there already is a .gitignore or not!
    // We will create one if it doesn't exist, yet.
    if (!fileAlreadyIgnores(gitIgn)) {
      fs.appendFileSync(gitIgn, linesOfIgnorance);
    }
  }
};
