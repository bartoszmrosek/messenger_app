import { render, screen } from '@testing-library/react';
import React from 'react';
import './tests/matchMedia.mock';

import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { MobileNavbarProvider } from './Contexts/MobileNavbarContext';
import { UserContextProvider } from './Contexts/UserContext';

describe('App', () => {
  it('renders headline', () => {
    render(
      <Router>
        <UserContextProvider>
          <MobileNavbarProvider>
            <App />
          </MobileNavbarProvider>
        </UserContextProvider>
      </Router>,
    );

    screen.debug();

    // check if App components renders headline
  });
});
