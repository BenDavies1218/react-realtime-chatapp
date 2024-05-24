// Context.js
import React, { useState, createContext } from "react";

export const Context = createContext();
export const ContextProvider = ({ children }) => {
  const [addMode, setAddMode] = useState(false);

  return (
    <Context.Provider value={[addMode, setAddMode]}>
      {children}
    </Context.Provider>
  );
};
