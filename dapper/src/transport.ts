import { spawn } from 'child_process';
import { DebugProtocol } from 'vscode-debugprotocol';
import { Requests } from './requests';

const debugAdapter = spawn('node', ['main.js'],
                           {cwd: '/Users/zach/.vscode/extensions/vscode-python/out/client/debugger/debugAdapter/'});

debugAdapter.stdout.setEncoding('utf-8');
debugAdapter.stderr.setEncoding('utf-8');

debugAdapter.stdout.on('data', (data: string): void => {
  console.log('-----Stdout-----');
  console.log(data);
  console.log('----------------');

  const response = parseResponse(data);
  if (response.success === false) {
    console.error("Unsuccessful response recieved");
    return;
  }
  switch(response.command) {
    case 'initialize':
      // (Process capabilities response)
      sendRequest(Requests.configurationDone());
      break;
    case 'configurationDone':
      // (Launch request)
      sendRequest(Requests.launch());
      break;
  }
});

debugAdapter.stderr.on('data', (data: string): void => {
  console.log('-----Stderr-----');
  console.log(data);
  console.log('----------------');
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

function sendRequest(message: string): void {
  console.log('---sendRequest--');
  console.log(message);
  console.log('----------------');
  debugAdapter.stdin.write(message, 'utf-8', (err) => err && console.log(`Error: ${err}`));
}

function parseResponse(data: string): DebugProtocol.Response {
  // Extract the "Content Part" and JSON.parse it
  const match = data.match(/\r\n\r\n{/);
  if (match === null) {
    throw `No "Content Part" found in stdout response:\n${data}`;
  }
  const substring = data.substring(match.index + match[0].length - 1);
  return JSON.parse(substring);
}

export default function main(): void {
  console.log('Beginning Initialization...');
  sendRequest(Requests.initialize());
}

/*

# Requests Sequence

* Initalize
* Add breakpoints (and other config?)
* configurationDone
* Launch

*/

