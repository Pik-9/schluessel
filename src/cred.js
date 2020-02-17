const files = require('./files.js');
const errors = require('./error.js');
const fs = require('fs');
const crypto = require('crypto');

const iv_len = 12;
const tag_len = 16;

const load_key_from_file = () => {
  if (!fs.existsSync(files.key_file))  {
    throw new errors.KeyfileNotFound();
  }

  const buffer = fs.readFileSync(files.key_file);
  if (!errors.test_base64.test(buffer.toString('ascii')))  {
    throw new errors.InvalidFormat(files.key_file);
  }

  const key = Buffer.from(buffer.toString('ascii'), 'base64');
  if (key.length !== 32)  {
    throw new errors.WrongKeysize();
  }

  return key;
}

const load_key_from_env = () => {
  const key_str = process.env.NODE_MASTER_KEY;
  if (typeof key_str === 'undefined')  {
    return undefined;
  } else  {
    if (!errors.test_base64.test(key_str))  {
      throw new errors.InvalidFormat(`NODE_MASTER_KEY = ${key_str}`);
    }

    const key = Buffer.from(key_str, 'base64');

    if (key.length !== 32)  {
      throw new errors.WrongKeysize();
    }

    return key;
  }
};

const load_key = () => load_key_from_env() || load_key_from_file();

const create_key = (force = false) => {
  if (!force && fs.existsSync(files.key_file))  {
    throw new errors.KeyfileAlreadyExists();
  }

  const key = crypto.randomBytes(32);
  fs.writeFileSync(files.key_file, key.toString('base64'));
};

const save_vault = (plaintext) => {
  const key = load_key();
  const iv = crypto.randomBytes(iv_len);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let ctext = cipher.update(plaintext);
  ctext = Buffer.concat([ctext, cipher.final()]);
  const authtag = cipher.getAuthTag();
  fs.writeFileSync(files.vault_file, Buffer.concat([iv, authtag, ctext]).toString('base64'));
};

const load_vault = () => {
  const key = load_key();

  if (!fs.existsSync(files.vault_file))  {
    throw new errors.VaultfileNotFound();
  }

  const buffer = fs.readFileSync(files.vault_file);
  if (!errors.test_base64.test(buffer.toString('ascii')))  {
    throw new errors.InvalidFormat(files.vault_file);
  }

  const vault = Buffer.from(buffer.toString('ascii'), 'base64');

  const iv = vault.slice(0, iv_len);
  const cipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  cipher.setAuthTag(vault.slice(iv_len, iv_len + tag_len));
  let ret;
  try  {
    ret = cipher.update(vault.slice(iv_len + tag_len));
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
