import {
  createContext,
  type PropsWithChildren, useState, useEffect
} from 'react';

import * as Location from 'expo-location';

export const LocationContext = createContext<{
  location: Location.LocationGeocodedAddress | null;
  coordinates: Location.LocationObjectCoords | null;
}>({
  location: null,
  coordinates: null,
});

export function LocationProvider({ children }: PropsWithChildren) {
  const [location, setLocation] = useState<{
    location: Location.LocationGeocodedAddress | null,
    coordinates: Location.LocationObjectCoords | null,
  }>({
    location: null,
    coordinates: null,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    async function getCurrentLocation() {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      subscription = await Location.watchPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }, async (location) => {
        const address = await Location.reverseGeocodeAsync(location.coords)
        setLocation({
          location: address[0],
          coordinates: location.coords,
        });
      });
    }

    getCurrentLocation();

    return () => {
      subscription.remove();
    };
  }, []);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <LocationContext.Provider value={{ location: location.location, coordinates: location.coordinates }}>
      {children}
    </LocationContext.Provider>
  );
}