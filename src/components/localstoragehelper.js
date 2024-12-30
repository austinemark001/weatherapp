// utils/localStorageHelper.js

const SAVED_LOCATIONS_KEY = 'savedLocations';
const CURRENT_LOCATION_KEY = 'currentLocation';

/**
 * Get saved locations from local storage
 */
export const getSavedLocations = () => {
  const savedLocations = localStorage.getItem(SAVED_LOCATIONS_KEY);
  return savedLocations ? JSON.parse(savedLocations) : [];
};

/**
 * Save a new location to the saved locations list
 * @param {Object} location - The location object to save (name, lat, lon, id)
 */
export const saveLocation = (location) => {
  const savedLocations = getSavedLocations();

  // Prevent duplicates
  const exists = savedLocations.find(
    (loc) => loc.lat === location.lat && loc.lon === location.lon
  );
  if (exists) return;

  // Limit to 5 locations
  if (savedLocations.length >= 5) {
    savedLocations.shift(); // Remove the oldest location
  }

  const nameparts = location.display_name.split(',');
  const name = nameparts[0]?.trim();
  const country = nameparts[nameparts.length - 1]?.trim();
  const newLocation = {
    name: name,
    country: country,
    lat: location.lat,
    lon: location.lon
  }

  savedLocations.push(newLocation);
  localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(savedLocations));
};

/**
 * Get the current location from local storage
 */
export const getCurrentLocation = () => {
  const currentLocation = localStorage.getItem(CURRENT_LOCATION_KEY);
  return currentLocation ? JSON.parse(currentLocation) : null;
};

/**
 * Save the current location to local storage
 * @param {Object} location - The location object to save (name, lat, lon, id)
 */
export const saveCurrentLocation = (location) => {
  localStorage.setItem(CURRENT_LOCATION_KEY, JSON.stringify(location));
};




// utils/localStorageHelper.js

const WEATHER_DATA_KEY = 'weatherData';

/**
 * Get weather data from local storage for a specific location
 * @param {Object} location - The location object (lat, lon)
 */
export const getWeatherData = (location) => {
  const weatherData = localStorage.getItem(WEATHER_DATA_KEY);
  if (!weatherData) return null;

  const parsedData = JSON.parse(weatherData);
  const locationKey = `${location.lat},${location.lon}`;
  
  return parsedData[locationKey] || null;
};

/**
 * Save weather data to local storage
 * @param {Object} location - The location object (lat, lon)
 * @param {Object} data - The weather data (temperature, condition, etc.)
 */
export const saveWeatherData = (location, data) => {
  const weatherData = JSON.parse(localStorage.getItem(WEATHER_DATA_KEY)) || {};

  const locationKey = `${location.lat},${location.lon}`;
  weatherData[locationKey] = {
    data,
    timestamp: Date.now(), // Store current timestamp
  };

  localStorage.setItem(WEATHER_DATA_KEY, JSON.stringify(weatherData));
};

/**
 * Check if weather data is expired (e.g., older than 1 hour)
 * @param {Object} location - The location object (lat, lon)
 * @param {number} maxAge - Maximum allowed age in milliseconds (e.g., 1 hour = 3600000 ms)
 */
export const isWeatherDataExpired = (location, maxAge = 3600000) => {
  const weather = getWeatherData(location);
  if (!weather) return true; // No weather data exists

  const currentTime = Date.now();
  return currentTime - weather.timestamp > maxAge;
};


export const removeLocation = (loc)=>{
  try{
    const locations = getSavedLocations();
    let newarray = locations.filter(item => item['name'] !== loc.name);
    localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(newarray))
    let savedweathers = JSON.parse(localStorage.getItem(WEATHER_DATA_KEY)) || {};
    const datakey = `${loc.lat},${loc.lon}`
    if(datakey in savedweathers){
      delete savedweathers[datakey];
      localStorage.setItem(WEATHER_DATA_KEY, JSON.stringify(savedweathers))
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
  localStorage.removeItem(CURRENT_LOCATION_KEY);
  localStorage.removeItem(WEATHER_DATA_KEY)
  window.location.reload()
};

