import { MessageStatus, UserMessageInterface } from './MessageInterfaces';

// This is from socket.io documentation --> helper function for timeouts inside emitters
type WithTimeoutAck<
  isSender extends boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args extends any[],
> = isSender extends true ? [Error, ...args] : args;

export interface ServerToClientEvents<isSender extends boolean = false> {
  newMessageToClient: (
    param: UserMessageInterface,
    callback: (...args: WithTimeoutAck<isSender, [[MessageStatus]]>) => void,
  ) => void;
  serverUpdateStatus: (sender: number, status: MessageStatus) => void;
  reconnect: () => void;
}

export interface ClientToServerEvents<isSender extends boolean = false> {
  newMessageToServer: (
    arg: UserMessageInterface,
    callback: (...args: WithTimeoutAck<isSender, [MessageStatus]>) => void,
  ) => void;
  clientUpdateStatus: (recievers: number[], status: MessageStatus) => void;
}
