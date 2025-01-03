import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getcodeDetails, toFahrenheit, convertlocaltime, truncateSentense, formatDate, truncateTextSentense } from "../weatherConfig";
import Weather from "./Weather";
import './Locations.css'

export default function Locations({settings}){
  const [savedlocations, setsavedlocations] = useState(JSON.parse(localStorage.getItem('savedlocations')) || []);
  const [weatherdata, setweatherdata] = useState(JSON.parse(localStorage.getItem('savedlocations')));
  const [darkmode, setdarkmode] = useState(true);
  const [resstatus, setrestatus] = useState(false);
  const [issearch, setsearch] = useState(false);
  const [searchresponse, setsearchresponse] = useState(null);
  const [cityName, setCityName] = useState('');
  const [searchresults, setsearchresults] = useState([]);
  const searchRef = useRef(null);
  const inputref = useRef(false);
  const locationApi = process.env.REACT_APP_LOCATION_IQ;
  
  useEffect(()=>{
    if(settings.mode === 'dark'){
      setdarkmode(true)
    }else{
      setdarkmode(false)
    }
  }, [settings.mode])
  
  useEffect(()=>{
    document.addEventListener('mousedown', handleClickoutside);
    return ()=>{document.removeEventListener('mousedown',handleClickoutside)}
  }, []);

  useEffect(()=>{
    if(issearch){
     inputref.current.focus();
    }
  }, [issearch, setsearch]);
   
  const refresh = ()=>{
    setweatherdata([])
    setrestatus('refreshing')
    savedlocations.map(async(loc)=>{
        const data = await fetchweather(loc.lat, loc.lon);
        if(data){
          let daily, current;
          data.timelines.forEach(timeline =>{
            if(timeline.timestep === '1d'){
              daily = timeline.intervals
            }else if(timeline.timestep === 'current'){
              current = timeline.intervals[0]
            }
          })
          const newdt = {name: loc.name, country: loc.country, daily: daily, current: current}
          setweatherdata(prevState=> [...prevState, newdt])
          localStorage.setItem('savedlocationsweather', JSON.stringify(weatherdata))
        }
    })
    setrestatus(false)
  }
  
  const locationadded = async(loc)=>{
    const data = await fetchweather(loc.lat, loc.lon);
    if(data){
      let daily, current;
      data.timelines.forEach(timeline =>{
        if(timeline.timestep === '1d'){
          daily = timeline.intervals
        }else if(timeline.timestep === 'current'){
          current = timeline.intervals[0]
        }})
      
      const newdt = {name: loc.name, country: loc.country, daily: daily, current: current}
      setweatherdata(prevState => [...prevState, newdt])
      localStorage.setItem('savedlocationsweather', JSON.stringify(weatherdata))
    }
  }
  
  const handleClickoutside = (event)=>{
    if(searchRef.current && !searchRef.current.contains(event.target)){
      setsearch(false)
    }
  }
  

  const searchLocation = async (e) =>{
      e.preventDefault();
      try{
        setsearchresponse('finding location...')
        const response = await axios.get(`https://us1.locationiq.com/v1/search?key=${locationApi}&q=${encodeURIComponent(cityName)}&format=json`);
        const data = await response.data;
        if(data && data.length > 0){
          setsearchresults(data);
          setsearchresponse(false)
        }else{
          setsearchresponse('no locations found')
        }

      }catch(err){
        console.error('error with location search:', err)
        setsearchresponse("can't find location")
      }
  }

  const addLocation = (location)=> {
      const nameparts = location.display_name.split(',');
      const name = nameparts[0]?.trim();
      const country = nameparts[nameparts.length - 1]?.trim();
      const newLocation = {
        name: name,
        country: country,
        lat: Math.floor(location.lat * 1000) / 1000,
        lon: Math.floor(location.lon * 1000) / 1000
      }
      const updatedLocations = [...savedlocations, newLocation];
      setsavedlocations(updatedLocations);
      localStorage.setItem('savedlocations', JSON.stringify(updatedLocations));
      setsearchresults([]);
      setCityName('')
      setsearch(false)
      locationadded(newLocation)
  }

  const removeLocation = (name) => {
    const updatedLocations = savedlocations.filter(loc => loc.name !== name);
    const updatedWeatherdata = weatherdata.filter(weather => weather.name !== name);
    setsavedlocations(updatedLocations);
    setweatherdata(updatedWeatherdata)
    localStorage.setItem('savedlocations', JSON.stringify(updatedLocations));
    localStorage.setItem('savedlocationsweather', JSON.stringify(updatedWeatherdata))
  };
  return (
    <div className="favCont">
      <div className="favTop">
        <p>{savedlocations.length} {savedlocations.length > 1 ? 'locations': 'location'} {savedlocations.length < 3 ? '|' : ''} </p>
        {savedlocations.length < 3 && <button onClick={()=> setsearch(true)} id="addlocation">add new</button>}
      </div>
          {resstatus &&<p id="favresponse">{resstatus}</p>}
      {issearch && <div ref={searchRef} className="addCont" style={{backgroundColor: `${darkmode ? 'rgb(29, 63, 88, 0.97)': 'rgb(195, 203, 214, 0.97)'}`}}>
        <div className='addContent' style={{borderBottom: `${darkmode ? '#eef3f9' : '#100c0d'} 1px dotted`}}>
          <button onClick={()=> setsearch(false)}><img src={`${process.env.PUBLIC_URL}/images/back.png`} alt="cancel"/></button>
          <form  className='searchform' onSubmit={searchLocation}>
          <input type='search' placeholder='city...' onChange={(e)=> setCityName(e.target.value)} value={cityName} ref={inputref}  maxLength={50} required/>
          {cityName && <button onClick={()=>{setCityName('')}} type='button' style={{borderLeft: `${darkmode ? '#eef3f9' : '#100c0d'} 1px dotted`}}>X</button>}
          </form>
        </div>
        <div className="searchresults">
          {searchresponse ? <p id="searchresponse">{searchresponse}</p> :<p id="searchresponse"> locations appear here to choose from</p>}
          <ul className="searchlist">
            {searchresults.map(result => (<li key={result.place_id} onClick={() => addLocation(result)}>
              <span>+</span> {result.display_name}
            </li>))}
          </ul>
        </div>
      </div>}
       
    </div>
  );
};

export function FetchWeather({location}){
   const [responsestatus, setresponsestatus] = useState(false);
   const [weatherData, setWeatherData] = useState(false);

   useEffect(()=>{
    const getWeather = async(lat, lon) =>{
      try {
        responsestatus('refreshing')
          requestInfo.location = `${lat}, ${lon}`;
          const response = await axios.get('https://api.tomorrow.io/v4/timelines', {
              headers: {'Content-Type': 'application/json'},
              params: requestInfo,
      
          })
          if(response.status === 200){
              setWeatherData(response.data);
              setresponsestatus('updated')
              localStorage.setItem('savedWeather', JSON.stringify(response.data))
          }
      } catch (error) {
         console.error('error with weather api', error)
          setresponsestatus('error')
      }finally{
        setTimeout(()=>{setresponsestatus(false)}, 2000)
      }
  }
  getWeather()
   },[])
  return(
    <div className="weather">
      <div className="weatherResponse">refreshing</div>
      <Weather weatherData={weatherData} locationName={location} />
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








// style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/icons/cities.jpg)`}}
