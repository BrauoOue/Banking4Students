import React, { createContext, useContext, ReactNode, useState } from "react";

interface GlobalContextType {
  isLogged: boolean;
  setIsLogged: (value: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  ipAddress: string;
}

interface User {
  id: number; // Fixed property name (from $id to id)
  name: string;
  email: string;
  surname: string;
  ssn: string;
  points: number;
  attending_university: number;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Added state
  const ipAddress = "192.168.0.194:8000"

  return (
    <GlobalContext.Provider value={{ isLogged, setIsLogged, user, setUser, ipAddress }}>
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
