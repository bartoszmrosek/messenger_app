import React, { createContext, FunctionComponent, useState } from 'react';

interface ReactContextChildren {
  children?: React.ReactNode;
}

export interface MobileNavbarContextExports {
  isMobileNavbar: boolean;
  setIsMobileNavbar: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileNavbarContext = createContext<MobileNavbarContextExports>(null);

const MobileNavbarProvider: FunctionComponent<ReactContextChildren> = ({
  children,
}) => {
  const [isMobileNavbar, setIsMobileNavbar] = useState(true);
  return (
    <MobileNavbarContext.Provider value={{ isMobileNavbar, setIsMobileNavbar }}>
      {children}
    </MobileNavbarContext.Provider>
  );
};

export { MobileNavbarProvider, MobileNavbarContext };
