#!/usr/bin/env node

const rl = require('readline-sync');
const fs = require('fs');

const files = require('./src/files.js');
const ignoreKeys = require('./src/ignore.js');
const cred = require('./src/cred.js');
const edit = require('./src/edit-file.js');

const outline = (msg) => {
  process.stdout.write(`${msg}\n`);
};

const help = () => {
  outline('schluessel usage:');
  outline('  $ npx schluessel new');
  outline('    Create a new key and IV.');
  outline('    ATTENTION: This will overwrite existing keys as well as credentials!');
  outline('');
  outline('  $ npx schluessel edit');
  outline('    This will let you edit the credentials with your default text editor.');
  outline('');
  outline('Copyright (C) 2020, Daniel Steinhauer');
  outline('Published under the terms of the BSD 2-Clause License.');
  outline('  See LICENSE');
};

if (process.argv.length > 1) {
  if (process.argv[2] === 'new') {
    if (fs.existsSync(files.vault_file)) {
      if (rl.question('WARNING: The vault file already exists. Overwrite? (y/N) ').toUpperCase() !== 'Y') {
        process.exit();
      }
    }

    try {
      cred.create_key();
    } catch (err) {
      if (rl.question(`WARNING: ${err} (y/N) `).toUpperCase() === 'Y') {
        cred.create_key(true);
      }
    }

    const template = Buffer.from('{\n  "_description": "Put your credentials here..."\n}\n');
    cred.save_vault(template);

    // Make sure, the key files are ignored and not published.
    ignoreKeys();
  } else if (process.argv[2] === 'edit') {
    try {
      const content = cred.load_vault();
      const tmpFile = 'credentials.tmp.json';
      fs.writeFileSync(tmpFile, content);
      edit(tmpFile);
      const newContent = fs.readFileSync(tmpFile);
      fs.unlinkSync(tmpFile);
      cred.save_vault(newContent);
    } catch (err) {
      outline(`ERROR: ${err}`);
    }
  } else {
    help();
  }
} else {
  help();
}
