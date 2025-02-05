// utils/localStorageHelper.js
import { checkweatherdiffExpired } from "./dateConfig";

const SAVED_LOCATIONS_KEY = 'Locations';

const WEATHER_DATA_KEY = 'weatherData';
const SHORT_WEATHER_DATA_KEY = 'shortweatherdata';

const APP_SETTINGS_KEY = 'Settings'


//the gets
export const getLocations = () => {
  const existingLocations = localStorage.getItem(SAVED_LOCATIONS_KEY);
  return existingLocations ? JSON.parse(existingLocations) : [];
};

export const getshortweathers = () => {
  const existingweathers= localStorage.getItem(SHORT_WEATHER_DATA_KEY);
  return existingweathers ? JSON.parse(existingweathers) : {};
};

export const getWeatherData = (location) => {
  const weatherData = localStorage.getItem(WEATHER_DATA_KEY);
  if (!weatherData) return null;

  const parsedData = JSON.parse(weatherData);
  const locationKey = location.id;
  
  return parsedData[locationKey] || null;
};


export const getSettings = ()=>{
  const existingsettings= localStorage.getItem(APP_SETTINGS_KEY);
  return existingsettings ? JSON.parse(existingsettings) : false;
}




//the saves
export const saveLocation = (location, iscurrent) => {
  let existingLocations = getLocations();

  if(iscurrent){
    const exists = existingLocations.find((loc)=> loc.current === iscurrent)
    if(exists){
     existingLocations =  removeLocation(exists)
    }
  }else{
    const exists = existingLocations.find(
      (loc) => loc.id === location.place_id
    );
    if (exists) return existingLocations;
  }

  // Limit to 5 locations
  if (existingLocations.length >= 30) {
    existingLocations.shift(); // Remove the oldest location
  }
  let name, country;
  if(iscurrent){
    name = location.address.city || location.address.town || location.address.village || location.name || 'uknown location';
    country = location.address.country;
  }else{
    const nameparts = location.display_name.split(',');
    name = nameparts[0]?.trim();
    country = nameparts[nameparts.length - 1]?.trim();
  }
  const newLocation = {
    id: location.place_id,
    name: name,
    country: country,
    lat: location.lat,
    lon: location.lon,
    current: iscurrent,
  }
  if(iscurrent){
    existingLocations.unshift(newLocation)
  }else{
    if(existingLocations.length > 1){
      existingLocations.splice(1, 0, newLocation)
    }else{
      existingLocations.push(newLocation);
    }
  }
  localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(existingLocations));
  return existingLocations;
};

export const saveWeatherData = (location, data) => {
  const weatherData = JSON.parse(localStorage.getItem(WEATHER_DATA_KEY)) || {};

  weatherData[location] = {
    data,
    timestamp: Date.now(), // Store current timestamp
  };

  localStorage.setItem(WEATHER_DATA_KEY, JSON.stringify(weatherData));
};

export const saveshortweatherData = (location, code)=>{
  const shortweatherData = JSON.parse(localStorage.getItem(SHORT_WEATHER_DATA_KEY)) || {};

  shortweatherData[location] = {
    code,
    timestamp: Date.now(), // Store current timestamp
  };

  localStorage.setItem(SHORT_WEATHER_DATA_KEY, JSON.stringify(shortweatherData));
}

export const saveSettings = (values)=>{
  localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(values))
}


/**
 * Check if weather data is expired (e.g., older than 1 hour)
 * @param {Object} location - The location object (lat, lon)
 * @param {number} maxAge - Maximum allowed age in milliseconds (e.g., 1 hour = 3600000 ms)
 */
export const isWeatherDataExpired = (location, maxage) => {
  const weather = getWeatherData(location);
  if (!weather) return true; // No weather data exists

  return checkweatherdiffExpired(weather.timestamp, maxage);
};


export const removeLocation = (loc)=>{
  try{
    const locations = getLocations();
    let newarray = locations.filter(item => item['id'] !== loc.id);
    localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(newarray))
    let savedweathers = JSON.parse(localStorage.getItem(WEATHER_DATA_KEY)) || {};
    let savedshortweathers = JSON.parse(localStorage.getItem(SHORT_WEATHER_DATA_KEY)) || {};
    const datakey = loc.id
    if(datakey in savedweathers){
      delete savedweathers[datakey];
      localStorage.setItem(WEATHER_DATA_KEY, JSON.stringify(savedweathers))
    }
    if(datakey in savedshortweathers){
      delete savedshortweathers[datakey];
      localStorage.setItem(SHORT_WEATHER_DATA_KEY, JSON.stringify(savedshortweathers))
    }
    return newarray
  }catch(error){
    console.error('error removing item:', error)
    return false
  }
}


/**
 * Clear all saved locations
 */
export const clearLocations = () => {
  localStorage.removeItem(SAVED_LOCATIONS_KEY);
  localStorage.removeItem(WEATHER_DATA_KEY);
  localStorage.removeItem(SHORT_WEATHER_DATA_KEY);
  window.location.reload()
};

