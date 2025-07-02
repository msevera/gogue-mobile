import { createContext, useState } from "react";

export const NewLectureContext = createContext({
  newLectureVisible: false,
  setNewLectureVisible: (visible: boolean) => {},
});
  
export const NewLectureProvider = ({ children }: { children: React.ReactNode }) => {
  const [newLectureVisible, setNewLectureVisible] = useState(false);
  return <NewLectureContext.Provider value={{ newLectureVisible, setNewLectureVisible }}>
    {children}    
  </NewLectureContext.Provider>;
};
