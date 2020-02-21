module.exports = class WrongKeysize extends Error {
  constructor() {
    super('The keyfile has the wrong size.');
  }
};
