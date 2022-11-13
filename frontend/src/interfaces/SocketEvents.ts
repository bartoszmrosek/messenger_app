import { userMessageInterface } from '../Contexts/UserContext';

// This is from socket.io documentation --> helper function for timeouts inside emitters
type WithTimeoutAck<
  isSender extends boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args extends any[],
> = isSender extends true ? [Error, ...args] : args;

export interface ServerToClientEvents {
  newMessageToClient: (
    param: userMessageInterface,
    callback: (obj: { status: number }) => void,
  ) => void;
  reconnect: () => void;
}

export interface ClientToServerEvents<isSender extends boolean = false> {
  newMessageToServer: (
    arg: userMessageInterface,
    callback: (...args: WithTimeoutAck<isSender, [string]>) => void,
  ) => void;
}
