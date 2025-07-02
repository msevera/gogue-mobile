import { useContext } from "react";
import { NewLectureContext } from "@/contexts/newLectureContext";

export const useNewLecture = () => {
  const context = useContext(NewLectureContext);
  if (!context) {
    throw new Error('useNewLecture must be used within a NewLectureProvider');
  }
  return context;
};