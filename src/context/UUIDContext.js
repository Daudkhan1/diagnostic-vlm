// UUIDContext.js
import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const UUIDContext = createContext(null);

export const UUIDProvider = ({ children }) => {
  const [uuid, setUuid] = useState(() => uuidv4()); // new on mount

  const refreshUUID = () => setUuid(uuidv4()); // regenerate on demand

  return (
    <UUIDContext.Provider value={{ uuid, refreshUUID }}>
      {children}
    </UUIDContext.Provider>
  );
};

export const useUUID = () => {
  const context = useContext(UUIDContext);
  if (!context) {
    throw new Error('useUUID must be used within a UUIDProvider');
  }
  return context;
};
