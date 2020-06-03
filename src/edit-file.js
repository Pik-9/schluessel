/**
 * Open the user's preferred text editor to edit the credentials.
 *
 * @author Daniel Steinhauer.
 */

const fs = require('fs');
const cp = require('child_process');

const findFirstValidCmd = (cmds) => {
  const pths = process.env.PATH.split(':');
  let ret;
  for (let ii = 0; ii < cmds.length; ii += 1) {
    const cmd = cmds[ii];
    if (pths.some(
      (path) => fs.existsSync(`${path}/${cmd}`),
    )) {
      ret = cmd;
      break;
    }
  }

  return ret;
};

const findAlternative = () => {
  let ret;
  if (fs.existsSync('/usr/bin/editor')) {
    ret = fs.realpathSync('/usr/bin/editor');
  }

  return ret;
};

const editors = ['vim', 'vi', 'nano', 'emacs', 'ed'];

const unixEditor = () => process.env.EDITOR
  || process.env.VISUAL
  || findAlternative()
  || findFirstValidCmd(editors);

const defaultEditor = () => {
  if (process.platform === 'win32') {
    return process.env.EDITOR || process.env.VISUAL || 'notepad.exe';
  }
  return unixEditor();
};

module.exports = (file) => {
  const ret = cp.spawnSync(
    defaultEditor(),
    [file],
    {
      stdio: ['inherit', 'inherit', 'inherit'],
      windowsHide: true,
      shell: true,
    },
  );

  if ('error' in ret) {
    throw ret.error;
  }
};
