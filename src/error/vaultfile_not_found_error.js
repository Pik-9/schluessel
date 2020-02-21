const files = require('../files.js');

module.exports = class VaultfileNotFound extends Error {
  constructor() {
    super('The vault file could not be found.');
    this.vaultfile_path = files.vault_file;
  }
};
