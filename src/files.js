/**
 * Export several important file paths in the project.
 *
 * @author Daniel Steinhauer
 */

const appRoot = require('app-root-path');

const env = process.env.NODE_ENV || 'development';
const vault = `credentials.${env.toLowerCase()}.json.enc`;
const key = `credentials.${env.toLowerCase()}.key`;

/*
 * If we are running this from the CLI, choose the current
 * working directory, appRoot otherwise.
 */
const mpath = (global.isCli ? process.cwd() : appRoot.path);
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
