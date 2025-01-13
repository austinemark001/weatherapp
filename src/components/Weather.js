import React, { useState, useEffect } from "react";
import Forecast from "./Forecast";
import { getcodebackground, getcodecondition,  uvHealth, formatwind, formatwinddirection, formatvisibility } from "../weatherConfig";
import './Weather.css'
import { useLocation, useNavigate } from "react-router-dom";
import { getWeatherData ,saveWeatherData, saveshortweatherData,isWeatherDataExpired } from "../localstoragehelper";
import { temperatureUnit, speedUnit, distanceUnit, getAutoAge, temperatureUnitChart } from "../settingsConfig";
import axios from "axios";
import { Helmet } from "react-helmet";

export default function Weather(){
    const locationState = useLocation();
    const navigate = useNavigate();

    const location = locationState.state;
    const [current, setcurrent] = useState(null);
    const [dailyforecast, setdailyforecast] = useState(null);
    const [responsestatus, setresponse] = useState(false);
    const [iserror, seterror] = useState(false);
    
    //satro usestates
    
    
    if (!location) {
        console.error("Cannot save weather data for invalid location:", location);
        navigate('/')

    }

    useEffect(() => {
        const fetchWeather = async() => {

          // Initially check for saved weather data from localStorage
          const cachedWeather = getWeatherData(location);
          
          if (cachedWeather) {
            // If cached data exists, display it immediately
            feeddata(cachedWeather.data);
            if (isWeatherDataExpired(location, getAutoAge())) {
                setresponse('. . .')
                const response = await fetchweatherdata();
                if(response === true){
                    setresponse('updated')
                }else{
                    setresponse('update failed')
                }
                setTimeout(()=> setresponse(false), 2000)
          } 
          }else{
            await fetchweatherdata()
          }
           
    }
    
        fetchWeather();
      }, [location]);

    const feeddata =(filtereddata) =>{
        setcurrent(filtereddata.current);
        setdailyforecast(filtereddata.daily)
    };
    

    const fetchweatherdata = async()=>{
        try {
            requestInfo.latitude = location.lat;
            requestInfo.longitude = location.lon;

             const response = await axios.get(
               'https://api.open-meteo.com/v1/forecast', {
                       headers: {'Content-Type': 'application/json'},
                       params: requestInfo,
               
                   });
             
             const weatherData = {current: response.data.current?? [], daily: response.data.daily ?? []}
             saveWeatherData(location.id, weatherData);
             saveshortweatherData(location.id, weatherData.current.weather_code ?? 3)
             feeddata(weatherData ?? [])
             return true;
             
           } catch (error) {
             console.error('Error fetching weather data:', error);
             seterror(true)
             return false; 
         }
    }
    
    // astro usestates
    const [isday, setisday] = useState(false);
    useEffect(()=>{
        const astrocheck = ()=>{
            setisday(Boolean(current.is_day) ?? false)
        }

    if(current){
        astrocheck()
    }
    },[current, setcurrent, isday])

    const handleRefresh = async()=>{
        setresponse('. . .');
        const response = await fetchweatherdata();
        if(response === true){
            setresponse('updated')
        }else{
            setresponse('failed')
        }
        setTimeout(()=> setresponse(false), 2000)
    }


    return(
        <>
        <Helmet>
            <title>weather {location.name}</title>
            <meta name="description" content={`weather for ${location.name}, ${location.country} showing current, hourly forecast, daily forecast and astro details`}/>
            <meta name="keywords" content={`weather ${location.name}, today's weather ${location.name}, current weather ${location.name}`}/>
            <meta property='og:title' content={`weather ${location.name}`}/>
            <meta property="og:description" content={`weather ${location.name}, today's weather ${location.name}, current weather ${location.name}`}/>
            <meta property='og:url' content={`https://numbusnow.austinemark.com/weather/${location.name}`} />
            <meta property="twitter:title" content={`weather ${location.name}`}/>
            <meta property="twitter:description" content={`weather ${location.name}, today's weather ${location.name}, current weather ${location.name}`} />
        </Helmet>
        {responsestatus && <div className="weather-response">{responsestatus}</div>}
        {current ? <div className='weatherDetails'
        style={{backgroundImage: `url(${getcodebackground(current.weather_code, isday)})`}}>
           <div className='currentCondition'>
            <div className="current-location">
            <p id='currentlocation'>{location.current && <img src={`${process.env.PUBLIC_URL}/images/currentlocation.png`} alt="c"/>}{location.name}</p>
            <button  id="refresh-weather" onClick={handleRefresh}><img src={`${process.env.PUBLIC_URL}/images/refresh.png`} alt="refresh" /></button>
            </div>
            <div className="current-end">
            <div className="current-details">
                <p id='currenttemp'>{temperatureUnitChart(current.temperature_2m)}<sup>°</sup> <sub></sub></p>
                <p id="currentcondition"> {getcodecondition(current.weather_code)}</p>
            </div>
            <div className="day-conditions">
                <div>
                <p id="feels-like"> feels like
                <span>{temperatureUnit(current.apparent_temperature)}</span></p>
                <p id="dayconditions" style={{color: `${uvHealth(current.uv_index)}`}}> uv index<span>{Math.round(current.uv_index)}</span> </p>
                </div>
                <div>
                    <p> {formatwinddirection(current.wind_direction_10m)} {formatwind(current.wind_speed_10m)}
                    <span>{speedUnit(current.wind_speed_10m)}</span></p>
                    {/*<p> humidity <span>{Math.round(current.humidity)}% </span></p>*/}
                    <p> visibility <span>{distanceUnit(current.visibility)}</span>
                        {formatvisibility(current.visibility / 1000)}</p>
                </div>
            </div>
            </div>
            
               
        </div>

           {dailyforecast && <Forecast dailyforecast={dailyforecast}  currenttime={current.time} isDay= {isday}/>}
           
        </div> : <div className="no-weather"><img src={`${process.env.PUBLIC_URL}/images/cool.png`} alt="i"/> {iserror ? "things did't work out" : 'getting things ready...'}</div>}
        </>
    )
}




const requestInfo = {
    longitude: 0,
    latitude: 0,
    current: ['temperature_2m', 'apparent_temperature', 'is_day', 'precipitation', 'weather_code', 
        'visibility', 'wind_speed_10m', 'wind_direction_10m', 'uv_index'],
    daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min', 'sunrise', 'sunset',  'precipitation_sum',
         'precipitation_probability_max'],
    timezone: 'auto'
  }

