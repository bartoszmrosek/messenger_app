import React, { ReactElement } from 'react';
import { MobileNavbarProvider } from '../Contexts/MobileNavbarContext';
import { UserContextProvider } from '../Contexts/UserContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, RenderOptions } from '@testing-library/react';

const AllProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Router>
      <UserContextProvider>
        <MobileNavbarProvider>{children}</MobileNavbarProvider>
      </UserContextProvider>
    </Router>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  render(ui, { wrapper: AllProviders, ...options });
};

export * from '@testing-library/react';
export { customRender as render };
