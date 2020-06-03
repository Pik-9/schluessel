/**
 * This exception is thrown whenever is a file is not base64 encoded and therefore malformed.
 *
 * @author Daniel Steinhauer
 */

module.exports = class InvalidFormat extends Error {
  constructor(file) {
    super('The file is not base64 encoded.');
    this.file = file;
  }
};
