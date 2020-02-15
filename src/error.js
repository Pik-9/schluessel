const files = require('./files.js');

class KeyfileNotFound extends Error {
  constructor()  {
    super('The key file could not be found.');
    this.keyfile_path = files.key_file;
  }
};

class VaultfileNotFound extends Error {
  constructor()  {
    super('The vault file could not be found.');
    this.vaultfile_path = files.vault_file;
  }
};

class KeyfileAlreadyExists extends Error {
  constructor()  {
    super('The keyfile already exists.');
  }
};

class WrongKey extends Error {
  constructor()  {
    super('The key file does not seem to match the vault file.');
  }
};

class WrongKeysize extends Error {
  constructor() {
    super('The keyfile has the wrong size.');
  }
};

class InvalidFormat extends Error {
  constructor(file) {
    super('The file is not base64 encoded.');
    this.file = file;
  }
};

module.exports = {
  KeyfileNotFound: KeyfileNotFound,
  VaultfileNotFound: VaultfileNotFound,
  KeyfileAlreadyExists: KeyfileAlreadyExists,
  WrongKey: WrongKey,
  WrongKeysize: WrongKeysize,
  InvalidFormat: InvalidFormat,
  test_base64: /^[0-9a-zA-Z/+=]+[\s]?$/
}
