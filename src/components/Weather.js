import React, { useState, useEffect, useRef } from "react";
import Forecast from "./Forecast";
import { getcodeDetails,  uvHealth, formatwind, formatvisibility } from "../weatherConfig";
import { calculateAstro } from "../dateConfig";
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
    
    //satro usestates
    
    
    if (!location || iscurrent === undefined) {
        console.error("Cannot save weather data for invalid location:", location);
        navigate('/')

    }

    useEffect(() => {
        const fetchWeather = () => {
            const filterdata = (weatherdata)=>{
                const shifted_data = weatherdata.data.timelines ?? [];
                return {
                    current: shifted_data.find(t => t.timestep === 'current')?.intervals[0] ?? [],
                    hourly: shifted_data.find(t=> t.timestep === '1h')?.intervals.slice(0, 24)?? [],
                    daily: shifted_data.find(t => t.timestep === '1d')?.intervals ?? []
                }     
            }

            const feeddata =(filtereddata) =>{
                setcurrent(filtereddata.current);
                sethourlyforecast(filtereddata.hourly);
                setdailyforecast(filtereddata.daily)
            };

            const fetchweatherdata = async()=>{
                setresponse('refreshing')
                if(navigator.onLine){
                try {
                    requestInfo.location = `${location.lat}, ${location.lon}`;

                     const response = await axios.get(
                       'https://api.tomorrow.io/v4/timelines', {
                               headers: {'Content-Type': 'application/json'},
                               params: requestInfo,
                       
                           });
                     
                     // Save the new weather data to localStorage
                     const filteredData = filterdata(response.data)
                     saveWeatherData(location, filteredData);
                     feeddata(filteredData)
                     setresponse('success')
                     if(iscurrent && currenttoken){
                        setcurrenttoken(false);
                     }
                   } catch (error) {
                     console.error('Error fetching weather data:', error);
                     setresponse('error')
                     seterror(true)
                   
                   }
                   finally{
                       setTimeout(()=>{setresponse(false)}, 2000)
                   }
                }else{
                    setresponse('offline')
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
             }
          }else{
            if (isWeatherDataExpired(location)) {
                fetchweatherdata()
          } 
        };
    }
    
        fetchWeather();
      }, [location]);


    
    // astro usestates
    const [isday, setisday] = useState(false);
    const [astrotime, setastrotime] = useState({ first: 0, last: 0 })
    const [astroposition, setastroposition] = useState({x: 0,y: 0})
    const curveRef = useRef()

 
    useEffect(()=>{
        const astrocheck = ()=>{
            const astrodata = calculateAstro(current.values.sunriseTime, current.values.sunsetTime, current.startTime);
            setisday(astrodata.isDay)

           if(curveRef.current){
             const pathLength = curveRef.current.getTotalLength();
             const point = curveRef.current.getPointAtLength((astrodata.progress /100) * pathLength)
             setastroposition({x: point.x, y: point.y})
           }
            setastrotime({first: astrodata.first, last: astrodata.last})
        
        }

    if(current && current.values.sunriseTime && current.values.sunsetTime){
        astrocheck()
    }
    },[current, setcurrent, isday])


    const temperatureUnit = (temp)=>{
        if(settings.temp ==='fahren'){
            return  `${Math.round((temp * 9/5) + 32)}°`
        }
        return `${Math.round(temp)}°`;
    }
    const temperatureUnitChart = (temp)=>{
        if(settings.temp ==='fahren'){
            return  Math.round((temp * 9/5) + 32);
        }
        return Math.round(temp)
    }
    const temperatureUnitDecimal = (temp)=>{
        if(settings.temp ==='fahren'){
            return  `${Math.round(((temp * 9/5) + 32) * 10)/10}°`
        }
        return `${Math.round(temp)}°`;
    }
    
    const speedUnit = (spd)=>{
        if(settings.speed === 'km'){
            return `${Math.round(spd * 3.6)}km/h`
        }
        return `${Math.round(spd)}m/s`
    }
    const distanceUnit = (dst) =>{
        if(settings.distance === 'm'){
            return `${Math.round(dst *0.621371)}mi`
        }
        return `${Math.round(dst)}km`
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
        style={{backgroundImage: `url(${isday ? getcodeDetails[current.values.weatherCode].backgroundday :getcodeDetails[current.values.weatherCode].backgroundnight })`}}>
           <div className='currentCondition'>
            <p id='currentlocation'>{iscurrent && <img src={`${process.env.PUBLIC_URL}/images/currentlocation.png`} alt="c"/>}{location.name}</p>
            <div className="current-end">
            <div className="current-details">
                <p id='currenttemp'>{temperatureUnitChart(current.values.temperature)}<sup>°</sup> <sub></sub></p>
                <p id="currentcondition"> {getcodeDetails[current.values.weatherCode].text}</p>
            </div>
            <div className="day-conditions">
                <div>
                <p id="feels-like"> feels like
                <span>{temperatureUnitDecimal(current.values.temperatureApparent)}</span></p>
                <p id="dayconditions" style={{color: `${uvHealth(current.values.uvIndex)}`}}> uv index<span>{current.values.uvIndex}</span> </p>
                </div>
                <div>
                    <p>{formatwind(current.values.windSpeed)}
                    <span>{speedUnit(current.values.windSpeed)}</span></p>
                    <p> humidity <span>{Math.round(current.values.humidity)}% </span></p>
                    <p> visibility <span>{distanceUnit(current.values.visibility)}</span>
                        {formatvisibility(current.values.visibility)}</p>
                </div>
            </div>
            </div>
            
               
        </div>

            { <Forecast dailyforecast={dailyforecast} hourlyforecast={hourlyforecast} currenttime={current.startTime}
            sunrisetime={current.values.sunriseTime} sunsettime={current.values.sunsetTime} settings={settings} 
            astrodet= {{isday: isday, first: astrotime.first, last: astrotime.last, pos: astroposition}} curveRef={curveRef} 
            temperatureUnit={temperatureUnit} temperatureUnitChart={temperatureUnitChart} distanceUnit={distanceUnit} speedUnit={speedUnit}/> }
           
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
    endTime: 'nowPlus4d',
    timezone: 'auto'
  }

