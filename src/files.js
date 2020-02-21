const path = require('path');

const env = process.env.NODE_ENV || 'development';
const vault = `credentials.${env.toLowerCase()}.json.enc`;
const key = `credentials.${env.toLowerCase()}.key`;
const mpath = (require.main.filename.endsWith('schluessel/cli.js') ? process.cwd() : path.dirname(require.main.filename));
const vaultFile = `${mpath}/${vault}`;
const keyFile = `${mpath}/${key}`;

module.exports = {
  environment: env,
  path: mpath,
  vault,
  key,
  vaultFile,
  keyFile,
};
