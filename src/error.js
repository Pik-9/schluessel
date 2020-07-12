/**
 * Export all exceptions in one file.
 *
 * @author Daniel Steinhauer
 */

const KeyfileNotFound = require('./error/keyfile_not_found_error.js');
const VaultfileNotFound = require('./error/vaultfile_not_found_error.js');
const KeyfileAlreadyExists = require('./error/keyfile_already_exists_error.js');
const WrongKey = require('./error/wrong_key_error.js');
const WrongKeysize = require('./error/wrong_keysize_error.js');
const InvalidFormat = require('./error/invalid_format_error.js');

module.exports = {
  KeyfileNotFound,
  VaultfileNotFound,
  KeyfileAlreadyExists,
  WrongKey,
  WrongKeysize,
  InvalidFormat,
  testBase64: /^[0-9a-zA-Z/+=]+[\s]?$/,
};
