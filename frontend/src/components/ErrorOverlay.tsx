import React from 'react';

/* 
    Error types are as following:
    0 - Error with connection to server
    1 - User already exists in database
*/

const ErrorOverlay = ({ error }: { error: string }) => {
  return <div>{error}</div>;
};
export default ErrorOverlay;
