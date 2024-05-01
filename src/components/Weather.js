import React from "react";
import { useState, useEffect} from "react";
import './Weather.css'

export default function WeatherDetails({ weatherData }){
    const { location, current, forecast } = weatherData;
    const cityName = weatherData.location.name;
    const { is_day } = weatherData.current;
    const [hourlyForecast, setHourlyForecast] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [showAddToFavorites, setShowAddToFavorites] = useState(true);

    
    useEffect(() => {
        if (forecast) {
            const currentDay = new Date().getDate();
            const currentHour = new Date().getHours();
            let filteredForecast = [];

            // Filter hours from the current day starting from the current hour
            const currentDayForecast = forecast.forecastday[0].hour.filter(hour => {
                const hourDate = new Date(hour.time_epoch * 1000);
                const hourDay = hourDate.getDate();
                const hourHour = hourDate.getHours();
                return hourDay === currentDay && hourHour >= currentHour;
            });

            // Add current day's hours to the list
            filteredForecast.push(...currentDayForecast);

            // Calculate remaining hours needed to make the list 24 items
            const remainingHours = 24 - currentDayForecast.length;

            if (remainingHours > 0) {
                // Filter hours from the next day to fill remaining slots up to 24
                const nextDayForecast = forecast.forecastday[1].hour.slice(0, remainingHours);
                filteredForecast.push(...nextDayForecast);
            }

            // Set the filtered hourly forecast
            setHourlyForecast(filteredForecast);
        }
    }, [forecast]);

    useEffect(() => {
        // Check if city is already in favorites
        if (cityName) {
            if (favorites.includes(cityName)) {
                setShowAddToFavorites(false); // Hide "Add to Favorites" button
            } else {
                setShowAddToFavorites(true); // Show "Add to Favorites" button
            }
        }
    }, [weatherData, favorites]);

    useEffect(() => {
        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem("austineWeatherFavorites");
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
            console.log(favorites)
        }
    }, []);
    
    const handleAddToFavorites = () => {
        const cityName = weatherData?.location?.name;
        
        if (cityName) {
            if (favorites.includes(cityName)) {
                const updatedFavorites = favorites.filter((favCity) => favCity !== cityName);
                setFavorites(updatedFavorites);
                setShowAddToFavorites(true); // Show "Add to Favorites" button
            } else {
                if (favorites.length < 5) {
                    const updatedFavorites = [...favorites, cityName];
                    setFavorites(updatedFavorites);
                    setShowAddToFavorites(false); // Hide "Add to Favorites" button
                }
            }
        }
    };
    useEffect(() => {
        localStorage.setItem("austineWeatherFavorites", JSON.stringify(favorites));
    }, [favorites]);

    return(
        <div className='weatherDetails'>
                <div className='mainDetails'>
                    <p id='currentLocation'>{location.name}, <br/>{weatherData.location.region}, {weatherData.location.country}</p>
                    <p id='currentTemp'>{truncate(current.temp_c)}<span>℃</span></p>
                    <p id='currentText'>{current.condition.text}</p>
                    <img src={current.condition.icon} alt='icon' id='currentIcon'/>
                </div>
                <div className='dailyDetails'>
                    <ul className='dailyList'>
                        {forecast.forecastday.map(day=>(
                            <li key={day.date_epoch} className='dayDetails'>
                                <p id='dayMain'>{formatDate(day.date_epoch)}</p>
                                <p id='dayTempRange'><img src={`${process.env.PUBLIC_URL}/images/temperature.png`} alt='icon'/>{truncate(day.day.maxtemp_c)} - {truncate(day.day.mintemp_c)}℃</p>
                                <p id='dayText'><img src={day.day.condition.icon} alt='icon'/>{day.day.condition.text}</p>
                                <p id='rainChance'><img src={`${process.env.PUBLIC_URL}/images/drop.png`} alt='icon'/>{day.day.daily_chance_of_rain}%</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='hourlyDetails'>
                    <ul className='hourlyList'>
                        {hourlyForecast.map(hour =>(
                            <li key={hour.time_epoch} className='hourDetails'>
                                <p id='hourTime'>{formatTimeEpoch(hour.time_epoch)}</p>
                                <img src={hour.condition.icon} alt='icon' id='hourIcon'/>
                                <p id='hourText'>{truncate(hour.temp_c)}℃ - <img src={`${process.env.PUBLIC_URL}/images/drop.png`} alt='icon'/>{hour.chance_of_rain}%</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='otherDetails'>
                    <div className="tempRange">
                    <img src={`${process.env.PUBLIC_URL}/images/temperature.png`} alt='icon'/>
                    <p>temp range: <br/>{forecast.forecastday[0].day.maxtemp_c}℃ - {forecast.forecastday[0].day.mintemp_c} ℃</p>
                    </div>
                    <div className="uv">
                    <img src={`${process.env.PUBLIC_URL}/images/uv.png`} alt='icon'/>
                    <p> ultra violet: <br/>{current.uv}</p>
                    </div>
                    <div className="wind">
                    <img src={`${process.env.PUBLIC_URL}/images/wind.png`} alt='icon'/>
                    <p> wind: <br/>{current.wind_kph}kph - {current.wind_dir}</p>
                    </div>
                    <div className="humidity">
                    <img src={`${process.env.PUBLIC_URL}/images/humidity.png`} alt='icon'/>
                    <p> humidity: <br/>{current.humidity}</p>
                    </div>
                    <div className="visibility">
                    <img src={`${process.env.PUBLIC_URL}/images/visibility.png`} alt='icon'/>
                    <p> visibility: <br/>{current.vis_km}km</p>
                    </div>
                    <div className="pressure">
                    <img src={`${process.env.PUBLIC_URL}/images/pressure.png`} alt='icon'/>
                    <p> pressure: <br/>{current.pressure_mb}mb</p>
                    </div>
                    {(is_day === 1 ) && <div className="sunTrack" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/sunlight.jpg)`}}>
                        <p><img src={`${process.env.PUBLIC_URL}/images/sunrise.png`} alt='icon'/> sunrise: <br/>{forecast.forecastday[0].astro.sunrise}</p>
                        <p> day-time: <br/>{formatTimeEpoch(location.localtime_epoch)}</p>
                        <p><img src={`${process.env.PUBLIC_URL}/images/sunset.png`} alt='icon'/> sunset: <br/>{forecast.forecastday[0].astro.sunset}</p>
                    </div>}
                    {(is_day === 0 ) && <div className="moonTrack" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/moonlight.jpg)`}}>
                        <p><img src={`${process.env.PUBLIC_URL}/images/sunset.png`} alt='icon'/> sunset: <br/>{forecast.forecastday[0].astro.sunset}</p>
                        <p>night-time: <br/>{formatTimeEpoch(location.localtime_epoch)}</p>
                        <p><img src={`${process.env.PUBLIC_URL}/images/sunrise.png`} alt='icon'/> sunrise: <br/>{forecast.forecastday[1].astro.sunrise}</p>
                    </div>}
                </div>

                {!showAddToFavorites && (
                    <button onClick={handleAddToFavorites} id="addFavorite">
                        Remove from Favorites
                    </button>
                )}
                {/* Show "Add to Favorites" button if city is not in favorites and there are less than 5 favorites */}
                {showAddToFavorites && favorites.length < 5 && (
                    <button onClick={handleAddToFavorites} id="removeFavorite">
                        Add to Favorites
                    </button>
                )}
                    </div>
    )
}


const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    
    // Check if the date is today
    if (date.toDateString() === today.toDateString()) {
      return "today";
    }
  
    // Array of day names
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    
    // Get the day index from the date object
    const dayIndex = date.getDay();
    
    // Return the corresponding day name
    return days[dayIndex];
  };

  const formatTimeEpoch = (epoch) => {
    const date = new Date(epoch * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

const truncate =(inputnumber)=>{
    return Math.floor(inputnumber)
}
  