interface standardDbResponse<Type> {
  type: 'confirm' | 'error';
  payload: Type;
}

export type { standardDbResponse };
