# receptionist
Node.js package for storing application credentials (API keys, database passwords, etc.) encrypted in your repository.

## Introduction
In complex application you often have several credentials :key: like database passwords, API keys, etc. you need to store
somehow without accidentally checking them into your git repo or publishing them with your npm package.  
The popular framework _Ruby on Rails_ has a
[very neat solution](https://medium.com/craft-academy/encrypted-credentials-in-ruby-on-rails-9db1f36d8570)
for this dilemma:
The credentials get enciphered :lock: and written to a file that can be checked into the repository.
In order for the application to access them, you need to hand over the master key to decipher :unlock: them.

## How it works
`receptionist` will create two files called `credentials.<NODE_ENV>.json.env` and `credentials.<NODE_ENV>.key`.
You can check in the first file, but make sure to **never publish** the key file!
You can create such a pair for any environment you like - the default is `development`.

### Install `receptionist`
Just install `receptionist` typing from your project root directory:
```bash
npm install --save receptionist
```

### Accessing the credentials
Credentials are stored in JSON format.
Let's assume you have the following credentials:
```json
{
  "_description": "Put your credentials here...",
  "database": {
    "username": "admin",
    "password": "topsecret"
  }
}
```

From your application do:
```javascript
const my_credentials = require('receptionist');

// my_credentials will be the object you defined above in JSON format.
let db_connection = connect_to_database(my_credentials.database.username, my_credentials.database.password);
```

That's it! :smile:

### Creating a vault and keyfile
`receptionist` has a CLI that can be executed with `npx`.
**ATTENTION: It is important to `cd /path/to/your/project/root` before you execute the following!**
Just do:
```bash
npx receptionist new
```
This will create a new vault and keyfile in your project root directory for the development environment.

If you want to create a vault and keyfile for another environment, just do:
```bash
NODE_ENV=<your environment> npx receptionist new
```

This command will also add the line `credentials.*.key` to your `.gitignore` (and `.npmignore` if it exists)
to make sure that you really will never check the keyfile in.

### Editing the credentials
Just type:
```bash
npx receptionist edit
```
This will decipher the vault file and let you edit it with your favorite text editor.
It will be enciphered again as soon as you close the editor.

## Security considerations
The encryption algorithm used is AES with a 256 bit key in [Galois/Counter Mode](https://en.wikipedia.org/wiki/Galois/Counter_Mode).

### Key handling
I cannot stress enough how crucial it is that you never upload the .key file anywhere.
For deploying I would recommend creating a separate `NODE_ENV` (e.g. `production`) and put the keyfile for
this environment (and only for this one) to your server manually.  
If you cannot or don't want to place a file on your server, you can also _pass it via an environment variable_:
```bash
NODE_ENV=production NODE_MASTER_KEY="mqkMGRLfY+GwjnlXOlIzJw+tlip/SBny/QOlDHQltEM=" node my_awesome_app.js
```

Note: All binary data is encoded in _base64_.

### Changing IVs
Every time you edit the credentials, a new _Initialisation Vector_ will be used resulting in completely differnt
ciphertexts even for very small changes. This will prevent attackers from searching for patterns in your
`credentials.<NODE_ENV>.json.env` across several save states.
