const files = require('./files.js');
const fs = require('fs');
const crypto = require('crypto');

const load_key = () => {
  if (!fs.existsSync(files.key_file))  {
    throw 'Keyfile does not exist.';
  }

  const buffer = fs.readFileSync(files.key_file);
  if (!/^[0-9a-zA-Z/+=]+$/.test(buffer.toString('ascii')))  {
    throw 'Keyfile has invalid format. Should be a base64 string.';
  }

  const keyiv = Buffer.from(buffer.toString('ascii'), 'base64');
  if (keyiv.length !== 48)  {
    throw 'Keyfile has wrong size. You should create a new one.';
  }

  return {
    key: keyiv.slice(0, 32),
    iv: keyiv.slice(32)
  };
}

const create_key = (force = false) => {
  if (!force && fs.existsSync(files.key_file))  {
    throw 'The key file already exists. Overwrite?';
  }

  const keyiv = crypto.randomBytes(48);
  fs.writeFileSync(files.key_file, keyiv.toString('base64'));
};

const save_vault = (plaintext) => {
  const keyiv = load_key();
  const cipher = crypto.createCipheriv('aes256', keyiv.key, keyiv.iv);
  let ctext = cipher.update(plaintext);
  ctext = Buffer.concat([ctext, cipher.final()]);
  fs.writeFileSync(files.vault_file, ctext.toString('base64'));
};

const load_vault = () => {
  const keyiv = load_key();

  if (!fs.existsSync(files.vault_file))  {
    throw 'The vault does not exist.';
  }

  const buffer = fs.readFileSync(files.vault_file);
  if (!/^[0-9a-z-A-Z/+=]+$/.test(buffer.toString('ascii')))  {
    throw 'Vault file has invalid format. Should be a base64 string.';
  }

  const vault = Buffer.from(buffer.toString('ascii'), 'base64');

  const cipher = crypto.createDecipheriv('aes256', keyiv.key, keyiv.iv);
  let ret = cipher.update(vault);
  ret = Buffer.concat([ret, cipher.final()]);
  if (!ret.toString().startsWith('// Do not remove this line.'))  {
    throw 'Either the key is wrong, or the vault file is broken!';
  }

  return ret;
};

module.exports = {
  load_key: load_key,
  create_key: create_key,
  save_vault: save_vault,
  load_vault: load_vault
}
