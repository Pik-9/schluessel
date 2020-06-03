/**
 * This exception is thrown whenever the key file to overwrite already exists.
 *
 * @author Daniel Steinhauer
 */

module.exports = class KeyfileAlreadyExists extends Error {
  constructor() {
    super('The keyfile already exists');
  }
};
