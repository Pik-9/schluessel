const files = require('./files.js');

const fs = require('fs');

const ignore_keys = () => {
  const file_already_ignores = (filepath) => fs.readFileSync(filepath).includes('credentials.*.key');
  const lines_of_ignorance = '\n# Node receptionist credentials keys\ncredentials.*.key\n';
  const npm_ig = files.path + '/.npmignore';
  const git_ig = files.path + '/.gitignore';

  if (fs.existsSync(npm_ig))  {
    if (!file_already_ignores(npm_ig))  {
      fs.appendFileSync(npm_ig, lines_of_ignorance);
    }
  }

  // Is this a git repo?
  if (fs.existsSync(files.path + '/.git'))  {
    // If so, we don't care for whether there already is a .gitignore or not!
    // We will create one if it doesn't exist, yet.
    if (!file_already_ignores(git_ig))  {
      fs.appendFileSync(git_ig, lines_of_ignorance);
    }
  }
};

module.exports = ignore_keys;
