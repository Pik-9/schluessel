/**
 * This exception is thrown whenever the vault file couldn't be found.
 *
 * @author Daniel Steinhauer
 */

const files = require('../files.js');

module.exports = class VaultfileNotFound extends Error {
  constructor() {
    super('The vault file could not be found.');
    this.vaultfilePath = files.vaultFile;
  }
};
