module.exports = class InvalidFormat extends Error {
  constructor(file) {
    super('The file is not base64 encoded.');
    this.file = file;
  }
};
