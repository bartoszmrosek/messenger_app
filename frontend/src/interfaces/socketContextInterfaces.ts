/* eslint-disable @typescript-eslint/no-explicit-any*/

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: any) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  newMessageToClient: (arg1: any, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  checkUserLoginData: (...args: any) => void;
  checkOrCreateUser: (...args: any) => void;
  searchUser: (...args: any) => void;
  checkUserHistory: (...args: any) => void;
  newMessageToServer: (...args: any) => void;
  logoutUser: (...args: any) => void;
}
