import React from 'react';
import ReactDOM from 'react-dom/client';
import { SocketContextProvider } from './Contexts/SocketContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContextProvider } from './Contexts/UserContext';
import App from './App';
import './index.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <UserContextProvider>
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </UserContextProvider>
    </Router>
  </React.StrictMode>,
);
