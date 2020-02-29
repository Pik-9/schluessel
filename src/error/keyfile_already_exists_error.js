module.exports = class KeyfileAlreadyExists extends Error {
  constructor() {
    super('The keyfile already exists');
  }
};
