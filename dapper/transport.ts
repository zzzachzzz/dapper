import { spawn } from 'child_process';

const debugAdapter = spawn('node', ['main.js'],
                           {cwd: '/Users/zach/.vscode/extensions/vscode-python/out/client/debugger/debugAdapter/'});

debugAdapter.stdout.setEncoding('utf-8');
debugAdapter.stderr.setEncoding('utf-8');

debugAdapter.stdout.on('data', (data) => {
  console.log('-----Stdout-----');
  console.log(data);
  console.log('----------------');
});

debugAdapter.stderr.on('data', (data) => {
  console.log('-----Stderr-----');
  console.log(data);
  console.log('----------------');
});

debugAdapter.on('data', (data) => {
  console.log('------Data------');
  console.log('----------------');
  console.log(data);
});

debugAdapter.on('close', (code) => {
  console.log('------Close-----');
  console.log(`Child process exited with code ${code}`);
  console.log('----------------');
});

debugAdapter.on('error', (err) => {
  console.error('------Error-----');
  console.error(err);
  console.error('----------------');
});

debugAdapter.on('exit', (code, signal) => {
  console.log('------Exit------');
  console.log(`child process exited with code ${code} and signal ${signal}`);
  console.log('----------------');
});

debugAdapter.on('message', (message) => {
  console.log('-----Message----');
  console.log(message);
  console.log('----------------');
});

debugAdapter.on('disconnect', (message) => {
  console.log('---Disconnect---');
  console.log(message);
  console.log('----------------');
});

function initialize() {
  const response = sendRequest('initialize', {
    clientID: 'dapper',
    clientName: 'dapper',
    adapterID: 'vscode-python',
    pathFormat: 'path',
    linesStartAt1: true,
    columnsStartAt1: true,
    supportsVariableType: true,
    supportsVariablePaging: false,
    supportsRunInTerminalRequest: true,
    locale: 'en-US'
  });
}

let seq = 1;

function sendRequest(command, args) {
  const request = JSON.stringify({
    seq: seq,
    type: 'request',
    command: command,
    arguments: args
  });
  seq++;
  const message = `Content-Length: ${request.length}\r\n\r\n${request}`;
  console.log('---sendRequest--');
  console.log(message);
  console.log('----------------');
  debugAdapter.stdin.write(message, 'utf-8', (err) => console.log(`Wrote 1 ${err}`));
}

console.log('Beginning Initialization...');
initialize();

