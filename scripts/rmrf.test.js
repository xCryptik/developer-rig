const { join } = require('path');
const childProcess = require('child_process');
const options = { shell: true };
childProcess.spawnSync(process.platform === 'win32' ? 'md' : 'mkdir', [join('a', 'b')], options);
childProcess.spawnSync(process.platform === 'win32' ? 'copy' : 'cp', [process.argv[1], join('a', 'b', 'c.dat')], options);
const rmrf = require('./rmrf');
rmrf('a');
rmrf('z');
