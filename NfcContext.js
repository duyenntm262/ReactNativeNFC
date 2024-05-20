import React, {createContext, useState} from 'react';

export const NfcContext = createContext();

export const NfcProvider = ({children}) => {
  const [writtenText, setWrittenText] = useState('');

  return (
    <NfcContext.Provider value={{writtenText, setWrittenText}}>
      {children}
    </NfcContext.Provider>
  );
};
