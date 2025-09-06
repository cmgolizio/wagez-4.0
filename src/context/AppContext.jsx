"use client";

import { createContext, useState, useContext } from "react";

const AppContext = createContext();

export function ContextProvider({ children }) {
  const [shifts, setShifts] = useState([]);
  const [results, setResults] = useState(null);

  return (
    <AppContext value={{ shifts, setShifts, results, setResults }}>
      {children}
    </AppContext>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
