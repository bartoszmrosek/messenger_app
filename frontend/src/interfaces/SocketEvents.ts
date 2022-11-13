import { MessageStatus, UserMessageInterface } from './MessageInterfaces';

// This is from socket.io documentation --> helper function for timeouts inside emitters
type WithTimeoutAck<
  isSender extends boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args extends any[],
> = isSender extends true ? [Error, ...args] : args;

export interface ServerToClientEvents {
  newMessageToClient: (
    param: UserMessageInterface,
    callback: (obj: { status: MessageStatus }) => void,
  ) => void;
  reconnect: () => void;
}

export interface ClientToServerEvents<isSender extends boolean = false> {
  newMessageToServer: (
    arg: UserMessageInterface,
    callback: (...args: WithTimeoutAck<isSender, [string]>) => void,
  ) => void;
}
