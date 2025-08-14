import { createContext, useState } from "react";

export const CreateContext = createContext({
  input: '',
  source: null as any,
  setInput: (input: string) => { },
  setSource: (source: any) => { },
  setPreviewSource: (previewSource: { visible: boolean, source: any }) => { },
  previewSource: {
    visible: false,
    source: null as any,
  }
});

export const CreateProvider = ({ children }: { children: React.ReactNode }) => {
  const [input, setInput] = useState('');
  const [source, setSource] = useState(null);
  const [previewSource, setPreviewSource] = useState({
    visible: false,
    source: null as any,
  });

  return <CreateContext.Provider value={{
    input,
    source,
    setInput,
    setSource,
    setPreviewSource,
    previewSource
  }}>
    {children}
  </CreateContext.Provider>;
};
