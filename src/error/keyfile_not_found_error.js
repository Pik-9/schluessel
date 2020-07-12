/**
 * This exception is thrown whenever the keyfile couldn't be found.
 *
 * @author Daniel Steinhauer
 */

const files = require('../files.js');

module.exports = class KeyfileNotFound extends Error {
  constructor() {
    super('The key file could not be found.');
    this.keyfilePath = files.keyFile;
  }
};
