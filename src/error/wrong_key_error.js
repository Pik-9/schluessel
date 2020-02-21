module.exports = class WrongKey extends Error {
  constructor() {
    super('The key file does not seem to match the vault file.');
  }
};
