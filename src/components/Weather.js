import React, { useState, useEffect } from "react";
import Forecast from "./Forecast";
import { getcodeDetails, toFahrenheit, toKmPerHour, toMiles,  uvHealth, convertlocaltime,
        formatwind, formatTime, formatvisibility } from "../weatherConfig";
import './Weather.css'
import { useLocation, useNavigate } from "react-router-dom";
import { getWeatherData ,saveWeatherData, isWeatherDataExpired } from "./localstoragehelper";
import axios from "axios";
import { Helmet } from "react-helmet";

export default function Weather({ currenttoken, setcurrenttoken, settings }){
    const locationState = useLocation();
    const navigate = useNavigate();

    const {location, iscurrent} = locationState.state;
    const [current, setcurrent] = useState(null);
    const [hourlyforecast, sethourlyforecast] = useState(null);
    const [dailyforecast, setdailyforecast] = useState(null);
    const [responsestatus, setresponse] = useState(false);
    const [iserror, seterror] = useState(false);
    
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
                setresponse('refreshing')
                try {
                    requestInfo.location = `${location.lat}, ${location.lon}`;

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
                     seterror(true)
                   
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
          if(iscurrent){
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
                const currenttime =  new Date(current.startTime.slice(0, -6));
                const sunrisetime = new Date(current.values.sunriseTime.slice(0, -1));
                const sunsetime = new Date(current.values.sunsetTime.slice(0, -1));
                return currenttime >= sunrisetime && currenttime < sunsetime;
            }
            if(checkday()){
                setisday(true)
            } 
            let totalMinutes, minutesSinceSunrise, last, first, localtime;
            setastroposition({x: 0, y: 0})
            if(isday){
                localtime = new Date(current.startTime.slice(0, -6)).getTime();
                first = new  Date(current.values.sunriseTime.slice(0, -1)).getTime();
                last = new Date(current.values.sunsetTime.slice(0, -1)).getTime();
                totalMinutes = (last - first);
                minutesSinceSunrise = (localtime - first);
                const progress = (minutesSinceSunrise /totalMinutes) * 100;
                const x = progress ;
                const y = x<= 50 ? 50 - x : x - 50;
                setastroposition({ x, y})
            }else{
                first = new Date(current.values.sunsetTime.slice(0, -1)).getTime();
                last = new Date(current.values.sunriseTime.slice(0, -1)).getTime();
                const x = 50
                const y = 1
                setastroposition({x, y})
            
            }
            setastrotime({first, last})
        
        }

    if(current && current.values.sunriseTime && current.values.sunrisetime){
        astrocheck()
    }
    },[current, setcurrent])


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
        {(current && hourlyforecast && dailyforecast) ? <div className='weatherDetails'
        style={{backgroundImage: `url(${isday ? getcodeDetails[current.values.weatherCode].backgroundday :getcodeDetails[current.values.weatherCode].backgroundnight })`}}>
           {/*<div className="weather-background"></div>*/}
           <div className='currentCondition'>
            <p id='currentlocation'>{iscurrent && <img src={`${process.env.PUBLIC_URL}/images/currentlocation.png`} alt="c"/>}{location.name}</p>
            <div className="current-end">
            <div className="current-details">
                <p id='currenttemp'>{Math.round(settings.temp ==='celcius' ? `${current.values.temperature}`: `${toFahrenheit(current.values.temperature)}`)}<sup>°</sup> <sub></sub></p>
                <p id="currentcondition"> {getcodeDetails[current.values.weatherCode].text}</p>
            </div>
            <div className="day-conditions">
                <div>
                <p id="feels-like"><img src={`${process.env.PUBLIC_URL}/images/currentlocation.png`} alt="ico"/>feels like<span>{settings.temp ==='celcius' ? `${current.values.temperatureApparent}`: `${toFahrenheit(current.values.temperatureApparent)}`}°</span></p>
                <p id="day-temprange"><img src={`${process.env.PUBLIC_URL}/images/temperature.png`} alt="c"/>{Math.round(settings.temp ==='celcius' ? `${dailyforecast[0].values.temperatureMax}`: `${toFahrenheit(dailyforecast[0].values.temperatureMax)}`)}° 
                / {Math.round(settings.temp ==='celcius' ? `${dailyforecast[0].values.temperatureMin}`: `${toFahrenheit(dailyforecast[0].values.temperatureMin)}`)}°</p>
                <p id="dayconditions" style={{color: `${uvHealth(current.values.uvIndex)}`}}> <img src={`${process.env.PUBLIC_URL}/images/uv.png`} alt="c"/>uv <span>{current.values.uvIndex}</span> </p>
                </div>
                <div>
                    <p><img src={`${process.env.PUBLIC_URL}/images/wind.png`} alt='icon'/>{formatwind(current.values.windSpeed)} 
                    <span>{settings.speed === 'm' ? `${Math.floor(current.values.windSpeed)}m/s`: `${Math.floor(toKmPerHour(current.values.windSpeed))}km/h`}</span></p>
                    <p><img src={`${process.env.PUBLIC_URL}/images/humidity.png`} alt='icon'/><span>{Math.round(current.values.humidity)}% </span></p>
                    <p><img src={`${process.env.PUBLIC_URL}/images/visibility.png`} alt='icon'/><span>{settings.distance === 'km' ? `${Math.floor(current.values.visibility)}km`: `${Math.floor(toMiles(current.values.visibility))} mi`}</span>
                        {formatvisibility(current.values.visibility)}</p>
                </div>
            </div>
            </div>
            
               
        </div>

            { <Forecast dailyforecast={dailyforecast} hourlyforecast={hourlyforecast} currenttime={current.startTime}
            sunrisetime={current.values.sunriseTime} sunsettime={current.values.sunsetTime} settings={settings}/> }
           
            <div className="astro-container">
                <h4> <img src={`${process.env.PUBLIC_URL}/images/${isday ? 'sun': 'moon'}.png`} alt="ic"/> {isday ? 'day track': 'night track'}</h4>   
                <div className='astro'>
                    <div className="astro-position" style={{backgroundColor: `${isday ? '#ffffff80': '#00000080'}`}}>
                    <img src={`${process.env.PUBLIC_URL}/images/icons/${isday ?  'sun': 'moon'}.png`} style={{left: `${astroposition.x}%`, top: `${astroposition.y}%` }} alt="sun"/>
                    </div>
                    <div className='astro-time'>
                        <p id='sunrise'><span>{isday ? 'sunrise': 'sunset'}</span> <br/>{formatTime(astrotime.first)}</p>
                        <p id="suntime"><span>current-time</span> <br/>{convertlocaltime(current.startTime)}</p>
                        <p id='sunset'><span>{isday ? 'sunset': 'sunrise'}</span> <br/>{formatTime(astrotime.last)}</p>
                    </div>
                   
                </div>
            </div>
        </div> : <div className="no-weather"><img src={`${process.env.PUBLIC_URL}/images/cool.png`} alt="i"/> {iserror ? "things did't work out" : 'getting things ready...'}</div>}
        </>
    )
}




const requestInfo = {
    apikey: process.env.REACT_APP_WEATHER_API,
    location: '',
    fields: ['weatherCode','temperature', 'temperatureApparent', 'humidity', 'windSpeed' , 'precipitationProbability', 'precipitationType', 
        'visibility', 'uvIndex' ,'temperatureMax', 'temperatureMin' , 'sunriseTime', 'sunsetTime'],
    timesteps: ['current', '1h', '1d'],
    units: 'metric',
    startTime: 'now',
    endTime: 'nowPlus96',
    timezone: 'auto'
  }

