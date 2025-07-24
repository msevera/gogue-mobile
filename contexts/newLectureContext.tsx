import { createContext, useState } from "react";

export const NewLectureContext = createContext({
  initialDescription: '',
  newLectureVisible: false,
  setNewLectureVisible: (visible: boolean) => { },
  setInitialDescription: (description: string) => { },
  createPressed: false,
  setCreatePressed: (pressed: boolean) => { }
});

export const NewLectureProvider = ({ children }: { children: React.ReactNode }) => {
  const [newLectureVisible, setNewLectureVisible] = useState(false);
  const [initialDescription, setInitialDescription] = useState('');
  const [createPressed, setCreatePressed] = useState(false);

  return <NewLectureContext.Provider value={{
    initialDescription,
    newLectureVisible,
    setNewLectureVisible,
    setInitialDescription,
    createPressed,
    setCreatePressed
  }}>
    {children}
  </NewLectureContext.Provider>;
};
