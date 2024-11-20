import React, { useState, useEffect } from "react";
import Forecast from "./Forecast";
import { getcodeDetails, getmoonDetails, toFahrenheit, toKmPerHour, toMiles,  uvHealth, formatwinddirection, 
        formatwind, formathumidity, formatPressure, formatTime, formatvisibility, formatprep} from "../weatherConfig";
import './Weather.css'
import { useLocation, useNavigate } from "react-router-dom";
import { getWeatherData ,saveWeatherData, isWeatherDataExpired } from "./localstoragehelper";
import axios from "axios";

export default function Weather({ currenttoken, setcurrenttoken, settings }){
    const locationState = useLocation();
    const navigate = useNavigate();

    const {location, iscurrent} = locationState.state;
    const [current, setcurrent] = useState(null);
    const [hourlyforecast, sethourlyforecast] = useState(null);
    const [dailyforecast, setdailyforecast] = useState(null);
    const [responsestatus, setresponse] = useState(false);
    

    if (!location || iscurrent === undefined) {
        console.error("Cannot save weather data for invalid location:", location);
        navigate('/')

    }

    useEffect(() => {
        const fetchWeather = () => {
            const feeddata = (weatherdata)=>{
                weatherdata.data.timelines.forEach(timeline => {
                    const timestep = timeline.timestep
                    if(timestep === '1d'){
                        setdailyforecast(timeline.intervals);
    
                    }else if(timestep === '1h'){
                        sethourlyforecast(timeline.intervals.slice(0, 24));
    
                    }else if(timestep === 'current'){
                        setcurrent(timeline.intervals[0]);
                    }
                })
            }

            const fetchweatherdata = async()=>{
                setresponse('refreshing data')
                try {
                    requestInfo.location = `${location.lat}, ${location.lon}`;
                    console.log(requestInfo)
                     const response = await axios.get(
                       'https://api.tomorrow.io/v4/timelines', {
                               headers: {'Content-Type': 'application/json'},
                               params: requestInfo,
                       
                           });
                     
                     // Save the new weather data to localStorage
                     
                     const newWeatherData = response.data;
                     saveWeatherData(location, newWeatherData);
                     feeddata(newWeatherData)
                     setresponse('success')
                   } catch (error) {
                     console.error('Error fetching weather data:', error);
                     setresponse('error')
                   
                   }
                   finally{
                       setTimeout(()=>{setresponse(false)}, 2000)
                   }
                 }
            
          // Initially check for saved weather data from localStorage
          const cachedWeather = getWeatherData(location);
          
          if (cachedWeather) {
            // If cached data exists, display it immediately
            feeddata(cachedWeather.data);
          }
    
          // Check if weather data is expired (optional, you can adjust expiration time)
          if(current){
             if(currenttoken){
                fetchweatherdata();
                setcurrenttoken(false);
             }
          }else{
            if (isWeatherDataExpired(location)) {
                fetchweatherdata()
          } 
        };
    }
    
        fetchWeather();
      }, [location]);


    
    const [isday, setisday] = useState(false);
    const [astrotime, setastrotime] = useState({ first: 0, last: 0 })
    const [astroposition, setastroposition] = useState({x: 0, y: 0})

 
    useEffect(()=>{
        const astrocheck = ()=>{
            const checkday = ()=>{
                const currenttime = new Date(current.startTime);
                const sunrisetime = new Date(current.values.sunriseTime);
                const sunsetime = new Date(current.values.sunsetTime);
                return currenttime >= sunrisetime && currenttime < sunsetime;
            }
            if(checkday()){
                setisday(true)
            } 

            let totalMinutes, minutesSinceSunrise, last, first, localtime;
            setastroposition({x: 0, y: 0})
            if(isday){
                localtime = new Date(current.startTime).getTime();
                first = new Date(current.values.sunriseTime).getTime();
                last = new Date(current.values.sunsetTime).getTime();
                totalMinutes = (last - first);
                minutesSinceSunrise = (localtime - first);
            }else{
                localtime = new Date(current.startTime);
                last = new Date(dailyforecast[1].values.sunriseTime);
                first = new Date(current.values.sunsetTime);
                first.setDate(last.getDate())
                localtime.setDate(last.getDate())
                if(localtime.getHours() >= first.getHours()){
                    localtime.setHours(localtime.getHours() - 12)
                }else{
                    localtime.setHours(localtime.getHours() + 12)
                }
                totalMinutes = (first - last);
                minutesSinceSunrise = (localtime - last);
            
            }
        setastrotime({first, last})
            const progress = (minutesSinceSunrise /totalMinutes) * 100;
            const x = progress ;
            const y = x<= 50 ? 50 - x : x - 50;
            setastroposition({ x, y})
        }
    if(current){
        astrocheck()
    }
    },[current, setcurrent])


    return(
        <>
        {responsestatus && <div className="weather-response">{responsestatus}</div>}
        {(current && hourlyforecast && dailyforecast) ? <div className='weatherDetails'
        style={{backgroundImage: `url(${isday ? getcodeDetails[current.values.weatherCode].backgroundday :getcodeDetails[current.values.weatherCode].backgroundnight })`}}>
           <div className='currentCondition'>
            <p id='currentlocation'>{iscurrent && <img src={`${process.env.PUBLIC_URL}/images/currentlocation.png`} alt="c"/>}{location.name}</p>
            
            <p id='currenttemp'>{Math.round(settings.temp ==='celcius' ? `${current.values.temperature}`: `${toFahrenheit(current.values.temperature)}`)}<sup>°</sup> <sub></sub></p>
            <p id="currentcondition"> {getcodeDetails[current.values.weatherCode].text}</p>
            
            <p id="dayconditions">feels like {settings.temp ==='celcius' ? `${current.values.temperatureApparent}`: `${toFahrenheit(current.values.temperatureApparent)}`}°
                , max {Math.round(settings.temp ==='celcius' ? `${dailyforecast[0].values.temperatureMax}`: `${toFahrenheit(dailyforecast[0].values.temperatureMax)}`)}° 
                min {Math.round(settings.temp ==='celcius' ? `${dailyforecast[0].values.temperatureMin}`: `${toFahrenheit(dailyforecast[0].values.temperatureMin)}`)}°,
                {uvHealth(current.values.uvIndex)} uv of {current.values.uvIndex} </p>
        </div>

            { <Forecast dailyforecast={dailyforecast} hourlyforecast={hourlyforecast} currenttime={current.startTime}
            sunrisetime={current.values.sunriseTime} sunsettime={current.values.sunsetTime} settings={settings}/> }
           
            <div className='otherDetails'>
                <h4><img src={`${process.env.PUBLIC_URL}/images/umbrella.png`}/> weather details</h4>
                <ul className="otherdetailslist">
                <li>
                    <img src={`${process.env.PUBLIC_URL}/images/wind.png`} alt='icon'/><span>{settings.speed === 'm' ? `${Math.floor(current.values.windSpeed)}m/s`: `${Math.floor(toKmPerHour(current.values.windSpeed))}km/h`} -  {formatwinddirection(current.values.windDirection)} wind</span> 
                {formatwind(current.values.windSpeed)}</li>
                <li>
                    <img src={`${process.env.PUBLIC_URL}/images/humidity.png`} alt='icon'/><span>{Math.round(current.values.humidity)}% humidity</span>
                {formathumidity(current.values.humidity)}</li>
                <li>
                    <img src={`${process.env.PUBLIC_URL}/images/visibility.png`} alt='icon'/><span> {settings.distance === 'km' ? `${Math.floor(current.values.visibility)}km`: `${Math.floor(toMiles(current.values.visibility))} mi`} visbility</span> 
                {formatvisibility(current.values.visibility)}</li>
                <li>
                    <img src={`${process.env.PUBLIC_URL}/images/pressure.png`} alt='icon'/><span>{Math.round(current.values.pressureSurfaceLevel)}mb pressure</span>
                {formatPressure(current.values.pressureSurfaceLevel)}</li>
                <li> 
                    <img src={getmoonDetails[current.values.moonPhase].image} alt='icon'/><span>{getmoonDetails[current.values.moonPhase].text}</span> moon phase </li>
                <li>
                    <img src={`${process.env.PUBLIC_URL}/images/precipitation.png`} alt='icon'/><span>  {current.values.precipitationAccumulation}mm accumulation</span>
                {formatprep(current.values.precipitationAccumulation)}</li>
                </ul>
            </div>
           
            <div className="astro-container">
                <h4> <img src={`${process.env.PUBLIC_URL}/images/${isday ? 'sun': 'moon'}.png`}/> {isday ? 'day track': 'night track'}</h4>   
                <div className='astro'>
                    <div className="astro-position" style={{backgroundColor: `${isday ? '#ffffffb3': '#000000b3'}`}}>
                    <img src={isday ? `${process.env.PUBLIC_URL}/images/icons/sun.png`: getmoonDetails[current.values.moonPhase].image} style={{left: `${astroposition.x}%`, top: `${astroposition.y}%` }} alt="sun"/>
                    </div>
                    <div className='astrobackground' ></div>
                    <div className='astro-time'>
                        <p id='sunrise'><span>{isday ? 'sunrise': 'sunset'}</span> <br/>{formatTime(astrotime.first)}</p>
                        <p id="suntime"><span>current-time</span> <br/>{formatTime(current.startTime)}</p>
                        <p id='sunset'><span>{isday ? 'sunset': 'sunrise'}</span> <br/>{formatTime(astrotime.last)}</p>
                    </div>
                   
                </div>
            </div>
        </div> : <div className="no-weather">getting things ready</div>}
        </>
    )
}




const requestInfo = {
    apikey: process.env.REACT_APP_WEATHER_API,
    location: '',
    fields: ['weatherCode','temperature', 'temperatureApparent', 'humidity', 'windSpeed', 'windDirection', 'precipitationProbability', 'precipitationType', 
        'visibility', 'uvIndex', 'moonPhase', 'precipitationAccumulation','temperatureMax', 'temperatureMin', 'pressureSurfaceLevel', 'sunriseTime', 'sunsetTime'],
    timesteps: ['current', '1h', '1d'],
    units: 'metric',
    startTime: 'now',
    endTime: 'nowPlus120h',
    timezone: 'auto'
  }

//<img src={isday ? getcodeDetails[current.values.weatherCode].iconday: getcodeDetails[current.values.weatherCode].iconnight} alt='icon'/> 
// <img src={`${process.env.PUBLIC_URL}/images/location.png`} alt="l"/> 

//const airqaulitychart = ['good', 'moderate', 'unhealthy for sensitive group', 'unhealthy', 'very unhealthy', 'hazardous']
