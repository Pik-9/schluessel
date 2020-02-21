const cred = require('./src/cred.js');

module.exports = JSON.parse(cred.loadVault().toString());
