import { spawn } from 'child_process';

const debugAdapter = spawn('node', ['main.js'],
                           {cwd: '/Users/zach/.vscode/extensions/ms-python.python-2020.1.58038/out/client/debugger/debugAdapter/'});

debugAdapter.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

debugAdapter.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

debugAdapter.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});


debugAdapter.on('exit', (code, signal) => {
  console.log('child process exited with ' +
              `code ${code} and signal ${signal}`);
});

