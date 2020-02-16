import { DebugProtocol } from 'vscode-debugprotocol';

let seq = 1;

function buildRequestContentPart(command: string, args: object): DebugProtocol.Request {
  const requestContent = {
    seq: seq,
    type: 'request',
    command: command,
    arguments: args
  };
  seq++;
  return requestContent;
}

function buildRequestMessage(command: string, args: object): string {
  const requestContent = JSON.stringify(buildRequestContentPart(command, args));
  const message = `Content-Length: ${requestContent.length}\r\n\r\n${requestContent}`;
  return message;
}

export namespace Requests {
  export function initialize(): string {
    const args: DebugProtocol.InitializeRequestArguments = {
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
    };
    return buildRequestMessage('initialize', args);
  }

  export function configurationDone(): string {
    const args: DebugProtocol.ConfigurationDoneArguments = {};
    return buildRequestMessage('configurationDone', args);
  }

  export function launch(): string {
    const args: DebugProtocol.LaunchRequestArguments = {};
    return buildRequestMessage('launch', args);
  }
}

