import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContextProvider } from './Contexts/UserContext';
import App from './App';
import './index.css';
import { MobileNavbarProvider } from './Contexts/MobileNavbarContext';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <UserContextProvider>
        <MobileNavbarProvider>
          <App />
        </MobileNavbarProvider>
      </UserContextProvider>
    </Router>
  </React.StrictMode>,
);
