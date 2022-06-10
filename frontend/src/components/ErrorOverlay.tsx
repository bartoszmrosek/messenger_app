import React from 'react';

/* 
    Error types are as following:
    0 - Error with connection to server
    1 - User already exists in database
*/

const errorOverlay = ({ error }: { error: string }) => {
  return <div>{error}</div>;
};
export default errorOverlay;
