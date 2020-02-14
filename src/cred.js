const files = require('./files.js');
const errors = require('./error.js');
const fs = require('fs');
const crypto = require('crypto');

const load_key = () => {
  if (!fs.existsSync(files.key_file))  {
    throw new errors.KeyfileNotFound();
  }

  const buffer = fs.readFileSync(files.key_file);
  if (!errors.test_base64.test(buffer.toString('ascii')))  {
    throw new errors.InvalidFormat(files.key_file);
  }

  const keyiv = Buffer.from(buffer.toString('ascii'), 'base64');
  if (keyiv.length !== 44)  {
    throw new errors.WrongKeysize();
  }

  return {
    key: keyiv.slice(0, 32),
    iv: keyiv.slice(32)
  };
}

const create_key = (force = false) => {
  if (!force && fs.existsSync(files.key_file))  {
    throw new errors.KeyfileAlreadyExists();
  }

  const keyiv = crypto.randomBytes(44);
  fs.writeFileSync(files.key_file, keyiv.toString('base64'));
};

const save_vault = (plaintext) => {
  const keyiv = load_key();
  const cipher = crypto.createCipheriv('aes-256-gcm', keyiv.key, keyiv.iv);
  let ctext = cipher.update(plaintext);
  ctext = Buffer.concat([ctext, cipher.final()]);
  const authtag = cipher.getAuthTag();
  fs.writeFileSync(files.vault_file, Buffer.concat([authtag, ctext]).toString('base64'));
};

const load_vault = () => {
  const keyiv = load_key();

  if (!fs.existsSync(files.vault_file))  {
    throw new errors.VaultfileNotFound();
  }

  const buffer = fs.readFileSync(files.vault_file);
  if (!errors.test_base64.test(buffer.toString('ascii')))  {
    throw new errors.InvalidFormat(files.vault_file);
  }

  const vault = Buffer.from(buffer.toString('ascii'), 'base64');

  const cipher = crypto.createDecipheriv('aes-256-gcm', keyiv.key, keyiv.iv);
  cipher.setAuthTag(vault.slice(0, 16));
  let ret;
  try  {
    ret = cipher.update(vault.slice(16));
    ret = Buffer.concat([ret, cipher.final()]);
  } catch(err)  {
    throw new errors.WrongKey();
  }

  return ret;
};

module.exports = {
  load_key: load_key,
  create_key: create_key,
  save_vault: save_vault,
  load_vault: load_vault
}
