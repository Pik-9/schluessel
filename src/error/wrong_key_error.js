/**
 * This exception is thrown, whenever the key doesn't fit the credentials file.
 *
 * @author Daniel Steinhauer
 */

module.exports = class WrongKey extends Error {
  constructor() {
    super('The key file does not seem to match the vault file.');
  }
};
