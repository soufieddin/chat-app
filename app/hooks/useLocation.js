import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default useLocation = () => {
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if(!granted) return;
      let { coords } = await Location.getCurrentPositionAsync();
      if (coords) {
        const { latitude, longitude } = coords;
        let response = await Location.reverseGeocodeAsync({
          latitude,
          longitude
        });
        for (let item of response) {
          let address = `My current location is: ${item.street} ${item.name}, ${item.postalCode} ${item.city}`;
    
          setLocation(address);
        }
      }
      

    }catch {
      console.log(error);

    }
    
  }

useEffect(() => {
  getLocation();
 
}, [])
return location;
}