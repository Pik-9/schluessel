/**
 * This exception is thrown whenever the key file has the wrong size
 * and therefore is invalid.
 *
 * @author Daniel Steinhauer
 */

module.exports = class WrongKeysize extends Error {
  constructor() {
    super('The keyfile has the wrong size.');
  }
};
