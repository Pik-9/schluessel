const files = require('../files.js');

module.exports = class KeyfileNotFound extends Error {
  constructor() {
    super('The key file could not be found.');
    this.keyfile_path = files.key_file;
  }
};
