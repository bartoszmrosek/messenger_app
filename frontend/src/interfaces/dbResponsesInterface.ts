export interface standardDbResponse<Type> {
  type: 'confirm' | 'error';
  payload: Type;
}
