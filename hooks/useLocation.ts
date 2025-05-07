import { useContext } from 'react';
import { LocationContext } from '@/contexts/locationContext';

export default function useLocation() {
  const value = useContext(LocationContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useLocation must be wrapped in a <LocationProvider />');
    }
  }

  return value;
}