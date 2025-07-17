import { createContext, useState } from "react";

export const NewLectureContext = createContext({
  initialDescription: '',
  newLectureVisible: false,
  setNewLectureVisible: (visible: boolean) => { },
  setInitialDescription: (description: string) => { },
});

export const NewLectureProvider = ({ children }: { children: React.ReactNode }) => {
  const [newLectureVisible, setNewLectureVisible] = useState(false);
  const [initialDescription, setInitialDescription] = useState('');

  return <NewLectureContext.Provider value={{
    initialDescription,
    newLectureVisible,
    setNewLectureVisible,
    setInitialDescription
  }}>
    {children}
  </NewLectureContext.Provider>;
};
