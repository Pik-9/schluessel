/**
 * Export the loaded credentials.
 *
 * @author Daniel Steinhauer.
 */

const cred = require('./src/cred.js');

module.exports = JSON.parse(cred.loadVault().toString());
