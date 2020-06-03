/**
 * Several test methods.
 *
 * @author Daniel Steinhauer.
 */

const fs = require('fs');
const cred = require('../src/cred.js');
const files = require('../src/files.js');
const errors = require('../src/error.js');

const setUp = () => {
  const nmk = process.env.NODE_MASTER_KEY;
  delete process.env.NODE_MASTER_KEY;
  fs.writeFileSync(files.keyFile, 'f2FLp+VrF4pXBDMXzBq21G1Dd23D0aosklIzXtKQB9E=');
  fs.writeFileSync(files.vaultFile, '79KRPELmA9Y8lpZb8PFJzR8od1QMDUQE1CNtIy/V/ZAnLKMqNi8GXdr+4iDZ0tfMpviev5qDn8YAAaWwoAwaHwhkrk1Cbbcn70BsnlRJpcnD');
  return () => {
    process.env.NODE_MASTER_KEY = nmk;
    if (fs.existsSync(files.keyFile)) {
      fs.unlinkSync(files.keyFile);
    }
    if (fs.existsSync(files.vaultFile)) {
      fs.unlinkSync(files.vaultFile);
    }
  };
};

const loadKeyfileNonExistent = (assert) => {
  const tearDown = setUp();
  fs.unlinkSync(files.keyFile);
  assert.throws(() => cred.loadKey(), errors.KeyfileNotFound);
  tearDown();
};

const loadKeyfileWrongSize = (assert) => {
  const tearDown = setUp();
  fs.writeFileSync(files.keyFile, 'lLJy13O49hKO/xuYOPunJ8k3LR9g51RUR/F6lp9r0Q==');
  assert.throws(() => cred.loadKey(), errors.WrongKeysize);
  tearDown();
};

const loadKeyfileInvalidFormat = (assert) => {
  const tearDown = setUp();
  fs.writeFileSync(files.keyFile, 'vgfBOS6/7GJZtgPX4PDIskRlgXudHMh5VX/!nDwz750=');
  assert.throws(() => cred.loadKey(), errors.InvalidFormat);
  tearDown();
};

const loadKeyfileSuccess = (assert) => {
  const tearDown = setUp();
  const cmp = Buffer.from('f2FLp+VrF4pXBDMXzBq21G1Dd23D0aosklIzXtKQB9E=', 'base64');
  let key;
  assert.doesNotThrow(() => { key = cred.loadKey(); });
  assert.strict.deepEqual(key, cmp);
  tearDown();
};

const loadKeyEnvWrongSize = (assert) => {
  const tearDown = setUp();
  process.env.NODE_MASTER_KEY = 'lLJy13O49hKO/xuYOPunJ8k3LR9g51RUR/F6lp9r0Q==';
  assert.throws(() => cred.loadKey(), errors.WrongKeysize);
  tearDown();
};

const loadKeyEnvInvalidFormat = (assert) => {
  const tearDown = setUp();
  process.env.NODE_MASTER_KEY = 'vgfBOS6/7GJZtgPX4PDIskRlgXudHMh5VX/!nDwz750=';
  assert.throws(() => cred.loadKey(), errors.InvalidFormat);
  tearDown();
};

const loadKeyEnvSuccess = (assert) => {
  const tearDown = setUp();
  fs.unlinkSync(files.keyFile);
  process.env.NODE_MASTER_KEY = 'f2FLp+VrF4pXBDMXzBq21G1Dd23D0aosklIzXtKQB9E=';
  const cmp = Buffer.from('f2FLp+VrF4pXBDMXzBq21G1Dd23D0aosklIzXtKQB9E=', 'base64');
  let key;
  assert.doesNotThrow(() => { key = cred.loadKey(); });
  assert.strict.deepEqual(key, cmp);
  tearDown();
};

const createKey = (assert) => {
  const tearDown = setUp();
  assert.throws(() => cred.createKey(), errors.KeyfileAlreadyExists);
  assert.doesNotThrow(() => cred.createKey(true));
  assert.doesNotThrow(() => cred.loadKey());
  tearDown();
};

const loadVaultWrongIV = (assert) => {
  const tearDown = setUp();
  const buf = fs.readFileSync(files.vaultFile);
  buf.write('a', 1);
  fs.writeFileSync(files.vaultFile, buf);
  assert.throws(() => cred.loadVault(), errors.WrongKey);
  tearDown();
};

const loadVaultWrongTag = (assert) => {
  const tearDown = setUp();
  const buf = fs.readFileSync(files.vaultFile);
  buf.write('a', 13);
  fs.writeFileSync(files.vaultFile, buf);
  assert.throws(() => cred.loadVault(), errors.WrongKey);
  tearDown();
};

const loadVaultWrongCiphertext = (assert) => {
  const tearDown = setUp();
  const buf = fs.readFileSync(files.vaultFile);
  buf.write('a', 29);
  fs.writeFileSync(files.vaultFile, buf);
  assert.throws(() => cred.loadVault(), errors.WrongKey);
  tearDown();
};

const loadVaultNonExistent = (assert) => {
  const tearDown = setUp();
  fs.unlinkSync(files.vaultFile);
  assert.throws(() => cred.loadVault(), errors.VaultfileNotFound);
  tearDown();
};

const loadVaultInvalidFormat = (assert) => {
  const tearDown = setUp();
  const buf = fs.readFileSync(files.vaultFile);
  buf.write('!', 29);
  fs.writeFileSync(files.vaultFile, buf);
  assert.throws(() => cred.loadVault(), errors.InvalidFormat);
  tearDown();
};

const saveLoadVault = (assert) => {
  const tearDown = setUp();
  const content = Buffer.from('{ "msg": "Just testing" }');
  cred.saveVault(content);
  assert.strict.deepEqual(cred.loadVault(), content);
  tearDown();
};

module.exports = (assert) => {
  loadKeyfileNonExistent(assert);
  loadKeyfileWrongSize(assert);
  loadKeyfileInvalidFormat(assert);
  loadKeyfileSuccess(assert);
  loadKeyEnvWrongSize(assert);
  loadKeyEnvInvalidFormat(assert);
  loadKeyEnvSuccess(assert);
  createKey(assert);
  loadVaultWrongIV(assert);
  loadVaultWrongTag(assert);
  loadVaultWrongCiphertext(assert);
  loadVaultNonExistent(assert);
  loadVaultInvalidFormat(assert);
  saveLoadVault(assert);
};
