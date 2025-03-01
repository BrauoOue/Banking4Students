import React, {createContext, useContext, ReactNode, useState} from "react";
import { Redirect } from "expo-router";

interface GlobalContextType {
  isLogged: boolean;
}

interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {

  const [isLogged, setIsLogged ] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context;
};

export default GlobalProvider;
