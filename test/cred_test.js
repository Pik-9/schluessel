const cred = require('../src/cred.js');
const files = require('../src/files.js');
const errors = require('../src/error.js');
const fs = require('fs');

const setUp = () => {
  const nmk = process.env.NODE_MASTER_KEY;
  delete process.env.NODE_MASTER_KEY;
  fs.writeFileSync(files.key_file, 'f2FLp+VrF4pXBDMXzBq21G1Dd23D0aosklIzXtKQB9E=');
  fs.writeFileSync(files.vault_file, '79KRPELmA9Y8lpZb8PFJzR8od1QMDUQE1CNtIy/V/ZAnLKMqNi8GXdr+4iDZ0tfMpviev5qDn8YAAaWwoAwaHwhkrk1Cbbcn70BsnlRJpcnD');
  return () => {
    process.env.NODE_MASTER_KEY = nmk;
    if (fs.existsSync(files.key_file))  {
      fs.unlinkSync(files.key_file);
    }
    if (fs.existsSync(files.vault_file))  {
      fs.unlinkSync(files.vault_file);
    }
  }
};

const load_key_file_non_existent = (assert) => {
  const tearDown = setUp();
  fs.unlinkSync(files.key_file);
  assert.throws(() => cred.load_key(), errors.KeyfileNotFound);
  tearDown();
};

const load_key_file_wrong_size = (assert) => {
  const tearDown = setUp();
  fs.writeFileSync(files.key_file, 'lLJy13O49hKO/xuYOPunJ8k3LR9g51RUR/F6lp9r0Q==');
  assert.throws(() => cred.load_key(), errors.WrongKeysize);
  tearDown();
};

const load_key_file_invalid_format = (assert) => {
  const tearDown = setUp();
  fs.writeFileSync(files.key_file, 'vgfBOS6/7GJZtgPX4PDIskRlgXudHMh5VX/!nDwz750=');
  assert.throws(() => cred.load_key(), errors.InvalidFormat);
  tearDown();
};

const load_key_file_success = (assert) => {
  const tearDown = setUp();
  const cmp = Buffer.from('f2FLp+VrF4pXBDMXzBq21G1Dd23D0aosklIzXtKQB9E=', 'base64');
  let key;
  assert.doesNotThrow(() => key = cred.load_key());
  assert.strict.deepEqual(key, cmp);
  tearDown();
};

const load_key_env_wrong_size = (assert) => {
  const tearDown = setUp();
  process.env.NODE_MASTER_KEY = 'lLJy13O49hKO/xuYOPunJ8k3LR9g51RUR/F6lp9r0Q==';
  assert.throws(() => cred.load_key(), errors.WrongKeysize);
  tearDown();
};

const load_key_env_invalid_format = (assert) => {
  const tearDown = setUp();
  process.env.NODE_MASTER_KEY = 'vgfBOS6/7GJZtgPX4PDIskRlgXudHMh5VX/!nDwz750=';
  assert.throws(() => cred.load_key(), errors.InvalidFormat);
  tearDown();
};

const load_key_env_success = (assert) => {
  const tearDown = setUp();
  fs.unlinkSync(files.key_file);
  process.env.NODE_MASTER_KEY = 'f2FLp+VrF4pXBDMXzBq21G1Dd23D0aosklIzXtKQB9E=';
  const cmp = Buffer.from('f2FLp+VrF4pXBDMXzBq21G1Dd23D0aosklIzXtKQB9E=', 'base64');
  let key;
  assert.doesNotThrow(() => key = cred.load_key());
  assert.strict.deepEqual(key, cmp);
  tearDown();
};

const create_key = (assert) => {
  const tearDown = setUp();
  assert.throws(() => cred.create_key(), errors.KeyfileAlreadyExists);
  assert.doesNotThrow(() => cred.create_key(true));
  assert.doesNotThrow(() => cred.load_key());
  tearDown();
};

const load_vault_wrong_iv = (assert) => {
  const tearDown = setUp();
  let buf = fs.readFileSync(files.vault_file);
  buf.write('a', 1);
  fs.writeFileSync(files.vault_file, buf);
  assert.throws(() => cred.load_vault(), errors.WrongKey);
  tearDown();
};

const load_vault_wrong_tag = (assert) => {
  const tearDown = setUp();
  let buf = fs.readFileSync(files.vault_file);
  buf.write('a', 13);
  fs.writeFileSync(files.vault_file, buf);
  assert.throws(() => cred.load_vault(), errors.WrongKey);
  tearDown();
};

const load_vault_wrong_ciphertext = (assert) => {
  const tearDown = setUp();
  let buf = fs.readFileSync(files.vault_file);
  buf.write('a', 29);
  fs.writeFileSync(files.vault_file, buf);
  assert.throws(() => cred.load_vault(), errors.WrongKey);
  tearDown();
};

const load_vault_non_existent = (assert) => {
  const tearDown = setUp();
  fs.unlinkSync(files.vault_file);
  assert.throws(() => cred.load_vault(), errors.VaultfileNotFound);
  tearDown();
};

const load_vault_invalid_format = (assert) => {
  const tearDown = setUp();
  let buf = fs.readFileSync(files.vault_file);
  buf.write('!', 29);
  fs.writeFileSync(files.vault_file, buf);
  assert.throws(() => cred.load_vault(), errors.InvalidFormat);
  tearDown();
};

const save_load_vault = (assert) => {
  const tearDown = setUp();
  const content = Buffer.from('{ "msg": "Just testing" }');
  cred.save_vault(content);
  assert.strict.deepEqual(cred.load_vault(), content);
  tearDown();
};

module.exports = (assert) => {
  load_key_file_non_existent(assert);
  load_key_file_wrong_size(assert);
  load_key_file_invalid_format(assert);
  load_key_file_success(assert);
  load_key_env_wrong_size(assert);
  load_key_env_invalid_format(assert);
  load_key_env_success(assert);
  create_key(assert);
  load_vault_wrong_iv(assert);
  load_vault_wrong_tag(assert);
  load_vault_wrong_ciphertext(assert);
  load_vault_non_existent(assert);
  load_vault_invalid_format(assert);
  save_load_vault(assert);
};
