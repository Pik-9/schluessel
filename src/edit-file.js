const fs = require('fs');
const cp = require('child_process');

const find_first_valid_cmd = (cmds) => {
  const pths = process.env.PATH.split(':');
  let ret = undefined;
  for (ii = 0; ii < cmds.length; ++ii)  {
    const cmd = cmds[ii];
    if (pths.some(
      (path) => fs.existsSync(`${path}/${cmd}`)
    )) {
      ret = cmd;
      break;
    }
  }

  return ret;
};

const find_alternative = () => {
  let ret = undefined;
  if(fs.existsSync('/usr/bin/editor'))  {
    ret = fs.realpathSync('/usr/bin/editor');
  }

  return ret;
};

const editors = ['vim', 'vi', 'nano', 'emacs', 'ed'];

const unix_editor = () => process.env.EDITOR || process.env.VISUAL || find_alternative() || find_first_valid_cmd(editors);

const default_editor = () => {
    if (process.platform === 'win32')  {
      return process.env.EDITOR || process.env.VISUAL || 'notepad.exe';
    } else  {
      return unix_editor();
    }
};

const edit_file = (file) => {
  cp.spawnSync(default_editor(), [file], {stdio: ['inherit', 'inherit', 'inherit'], windowsHide: true});
};

module.exports = edit_file;
