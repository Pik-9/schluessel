#!/usr/bin/env node

// Indicate that we are running this from the CLI.
global.isCli = true;

const readline = require('readline');
const fs = require('fs');

const files = require('./src/files.js');
const ignoreKeys = require('./src/ignore.js');
const cred = require('./src/cred.js');
const edit = require('./src/edit-file.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const outline = (msg) => {
  process.stdout.write(`${msg}\n`);
};

const yesno = (qustn) => new Promise((resolve) => {
  rl.question(`${qustn} (y/N): `, (answer) => {
    resolve(answer.toUpperCase() === 'Y');
  });
});

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

const main = async () => {
  if (process.argv.length > 1) {
    if (process.argv[2] === 'new') {
      if (fs.existsSync(files.vaultFile)) {
        const overwriteVault = await yesno('WARNING: The vault file already exists. Overwrite?');
        if (!overwriteVault) {
          process.exit();
        }
      }

      try {
        cred.createKey();
      } catch (err) {
        outline(`WARNING: ${err.message}.`);
        const forcekey = await yesno('Key may be overwritten. Create anyway?');
        if (forcekey) {
          cred.createKey(true);
        }
      }

      const template = Buffer.from('{\n  "_description": "Put your credentials here..."\n}\n');
      cred.saveVault(template);

      // Make sure, the key files are ignored and not published.
      ignoreKeys();
    } else if (process.argv[2] === 'edit') {
      try {
        const content = cred.loadVault();
        const tmpFile = 'credentials.tmp.json';
        fs.writeFileSync(tmpFile, content);
        edit(tmpFile);
        const newContent = fs.readFileSync(tmpFile);
        fs.unlinkSync(tmpFile);
        cred.saveVault(newContent);
      } catch (err) {
        outline(`ERROR: ${err}`);
      }
    } else {
      help();
    }
  } else {
    help();
  }
};

main().then(() => {
  process.exit();
}, (err) => {
  process.stderr.write(`An error occured: ${err}\n`);
  process.exit(1);
});
