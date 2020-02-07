const path = require('path');

const env = process.env.NODE_ENV || 'development';
const vault = `credentials.${env.toLowerCase()}.json.enc`;
const key = `credentials.${env.toLowerCase()}.key`;
const mpath = (require.main === module ? process.cwd() : path.dirname(require.main.filename));
const vault_file = `${mpath}/${vault}`;
const key_file = `${mpath}/${key}`;

module.exports = {
  environment: env,
  vault: vault,
  key: key,
  vault_file: vault_file,
  key_file: key_file
};
