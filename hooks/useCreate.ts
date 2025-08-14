import { useContext } from "react";
import { CreateContext } from "@/contexts/createContext";

export const useCreate = () => {
  const context = useContext(CreateContext);
  if (!context) {
    throw new Error('useCreate must be used within a CreateProvider');
  }
  return context;
};