import './Main.css'
import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios';
import Weather from './Weather';


export default function Home({ iscurrent, setcurrent, settings}){
    /*API KEY()*/
    const [weatherData, setWeatherData] = useState(JSON.parse(localStorage.getItem('savedWeather')));
    const [loactionName, setLocationName] = useState({street: 'city', country: 'country'});
    const [resStatus, setresStatus] = useState(null);
    const locationApi = process.env.REACT_APP_LOCATION_IQ;

    useEffect(() => {
        const savedCurrent = JSON.parse(localStorage.getItem('current'));
        if(savedCurrent){
            const {lat, lon, street, country} = savedCurrent;
            setLocationName({street, country});
            if(iscurrent){
            updateLocation(lat, lon)  
            } 
        }else{
            updateLocation(0, 0)
        }
        
    }, []);
      // handle location search
    
    const updateLocation = async (lat1, lon1)=>{
        setresStatus('refreshing')
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async(position)=>{
                const { latitude, longitude } = position.coords;
            
                const updatedCoords = (latitude, longitude)=>{
                return{
                    lat: Math.floor(latitude * 10000)/10000,
                    lon: Math.floor(longitude * 10000)/10000
                    }
                }
                
               if(calculateDistance(lat1, lon1, latitude, longitude)){
                setresStatus('location change')
               try{
                  const {data} = await axios.get(`https://eu1.locationiq.com/v1/reverse?key=${locationApi}&lat=${latitude}&lon=${longitude}&format=json&`)
                  const address = data.address
                  const {lat, lon} = updatedCoords(latitude, longitude);
                  const current = {
                    lat: lat,
                    lon: lon,
                    street: address.suburb || address.city || address.town || address.village,
                    country: data.address.country
                  }
                  localStorage.setItem('current', JSON.stringify(current))
                  setLocationName({street: current.street, country: current.country})
                  getWeather(lat, lon);
                  setresStatus(false)
               }catch(error){
                   console.error('An error with location iq: ', error)
                   setresStatus('error')
               }finally{
                setTimeout(()=>{
                    setresStatus(false)
                },3000)
               }
            }else{
                    setresStatus('locations match')
                    getWeather(lat1, lon1)
            }
    
            },(error) => {
                console.error("Error getting user location: ",error)
                setresStatus('error')
                setTimeout(()=>{
                    setresStatus(false)
                }, 3000)
            });
            } else { 
                setresStatus('error')  
        };
    }
    
    const getWeather = async(lat, lon) =>{
        try {
            requestInfo.location = `${lat}, ${lon}`;
            const response = await axios.get('https://api.tomorrow.io/v4/timelines', {
                headers: {'Content-Type': 'application/json'},
                params: requestInfo,
        
            })
            if(response.status === 200){
                setWeatherData(response.data);
                setresStatus(null)
                localStorage.setItem('savedWeather', JSON.stringify(response.data))
                setcurrent(false)
            }
        } catch (error) {
           console.error('error with weather api', error)
           throw error
            }
    }

    const calculateDistance = (lat1, lon1, lat2, lon2)=>{
        const lat1dp = Math.floor(lat1 * 10)/10;
        const lon1dp = Math.floor(lon1 * 10)/10;
        const lat2dp = Math.floor(lat2 * 10)/10;
        const lon2dp = Math.floor(lon2 * 10)/10;
        const latdif = Math.abs(lat2dp - lat1dp);
        const londif = Math.abs(lon2dp - lon1dp)

        return latdif > 0.01 || londif > 0.01
    }

    return(
        <div className="homeContainer">
            {resStatus && <div className='responseCont'>
            <p id='responseStatus'>{resStatus}</p>
           </div>}
            {weatherData ? <Weather weatherData={weatherData} locationName={loactionName} settings={settings}/>  : <div className='noweather'>
                <img src={`${process.env.PUBLIC_URL}/images/noweather.png`} alt='weather popup in a few'/></div>}
        </div>
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
