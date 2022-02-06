/**
 * Export methods to load/save key/vault files.
 *
 * @author Daniel Steinhauer
 */

const fs = require('fs');
const crypto = require('crypto');
const files = require('./files.js');
const errors = require('./error.js');
const editFile = require('./edit-file');

const ivLen = 12;
const tagLen = 16;

const loadKeyFromFile = () => {
  if (!fs.existsSync(files.keyFile)) {
    throw new errors.KeyfileNotFound();
  }

  const buffer = fs.readFileSync(files.keyFile);
  if (!errors.testBase64.test(buffer.toString('ascii'))) {
    throw new errors.InvalidFormat(files.keyFile);
  }

  const key = Buffer.from(buffer.toString('ascii'), 'base64');
  if (key.length !== 32) {
    throw new errors.WrongKeysize();
  }

  return key;
};

const loadKeyFromEnv = () => {
  const keyStr = process.env.NODE_MASTER_KEY;
  if (typeof keyStr === 'undefined') {
    return undefined;
  }
  if (!errors.testBase64.test(keyStr)) {
    throw new errors.InvalidFormat(`NODE_MASTER_KEY = ${keyStr}`);
  }

  const key = Buffer.from(keyStr, 'base64');

  if (key.length !== 32) {
    throw new errors.WrongKeysize();
  }

  return key;
};

const loadKey = () => loadKeyFromEnv() || loadKeyFromFile();

const createKey = (force = false) => {
  if (!force && fs.existsSync(files.keyFile)) {
    throw new errors.KeyfileAlreadyExists();
  }

  const key = crypto.randomBytes(32);
  fs.writeFileSync(files.keyFile, key.toString('base64'));
};

const saveVault = (plaintext) => {
  const key = loadKey();
  const iv = crypto.randomBytes(ivLen);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let ctext = cipher.update(plaintext);
  ctext = Buffer.concat([ctext, cipher.final()]);
  const authtag = cipher.getAuthTag();
  fs.writeFileSync(files.vaultFile, Buffer.concat([iv, authtag, ctext]).toString('base64'));
};

const loadVault = () => {
  const key = loadKey();

  if (!fs.existsSync(files.vaultFile)) {
    throw new errors.VaultfileNotFound();
  }

  const buffer = fs.readFileSync(files.vaultFile);
  if (!errors.testBase64.test(buffer.toString('ascii'))) {
    throw new errors.InvalidFormat(files.vaultFile);
  }

  const vault = Buffer.from(buffer.toString('ascii'), 'base64');

  const iv = vault.slice(0, ivLen);
  const cipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  cipher.setAuthTag(vault.slice(ivLen, ivLen + tagLen));
  let ret;
  try {
    ret = cipher.update(vault.slice(ivLen + tagLen));
    ret = Buffer.concat([ret, cipher.final()]);
  } catch (err) {
    throw new errors.WrongKey();
  }

  return ret;
};

module.exports = {
  loadKey,
  createKey,
  saveVault,
  loadVault,
};
