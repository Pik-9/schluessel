#!/usr/bin/env node

const rl = require('readline-sync');
const fs = require('fs');

const files = require('./src/files.js');
const ignore_keys = require('./src/ignore.js');
const cred = require('./src/cred.js');
const edit = require('./src/edit-file.js');

const help = () => {
  console.log('schluessel usage:');
  console.log('  $ npx schluessel new');
  console.log('    Create a new key and IV.');
  console.log('    ATTENTION: This will overwrite existing keys as well as credentials!');
  console.log('');
  console.log('  $ npx schluessel edit');
  console.log('    This will let you edit the credentials with your default text editor.');
  console.log('');
  console.log('Copyright (C) 2020, Daniel Steinhauer');
  console.log('Published under the terms of the BSD 2-Clause License.');
  console.log('  See LICENSE');
};

if (process.argv.length > 1)  {
  if (process.argv[2] === 'new')  {
    if (fs.existsSync(files.vault_file))  {
      if (rl.question('WARNING: The vault file already exists. Overwrite? (y/N) ').toUpperCase() !== 'Y')  {
        process.exit();
      }
    }

    try  {
      cred.create_key();
    } catch (err)  {
      if (rl.question(`WARNING: ${err} (y/N) `).toUpperCase() === 'Y')  {
        cred.create_key(true);
      }
    }

    const template = Buffer.from('{\n  "_description": "Put your credentials here..."\n}\n');
    cred.save_vault(template);

    // Make sure, the key files are ignored and not published.
    ignore_keys();
  } else if (process.argv[2] === 'edit')  {
    try  {
      const content = cred.load_vault();
      const tmp_file = 'credentials.tmp.json';
      fs.writeFileSync(tmp_file, content);
      edit(tmp_file);
      const new_content = fs.readFileSync(tmp_file);
      fs.unlinkSync(tmp_file);
      cred.save_vault(new_content);
    } catch (err)  {
      console.log(`ERROR: ${err}`);
    }
  } else  {
    help();
  }
} else  {
  help();
}
