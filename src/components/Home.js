import './Home.css'
import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getSavedLocations, saveLocation, saveCurrentLocation, clearLocations, getCurrentLocation, removeLocation } from './localstoragehelper';


export default function Home({ currenttoken }){
    const navigate = useNavigate();
    const [locations, setlocations] = useState([]);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [issearch, setsearch] = useState(false)
    const [searchQuery, setsearchQuery] = useState();
    const [searchresponse, setsearchresponse] = useState(false);
    const [searchresults, setsearchresults] = useState([]);
    const [resStatus, setresStatus] = useState(null);
    const locationApi = process.env.REACT_APP_LOCATION_IQ;

    const searchRef = useRef(null);
    const inputref = useRef(false);

    useEffect(() => {
        setlocations(getSavedLocations());
        fetchCurrentLocation();
      }, []);
      
    const fetchCurrentLocation = async () => {
        const lastcurrent = getCurrentLocation();
        if(lastcurrent){
          setCurrentLocation(lastcurrent)
        }
        if(currenttoken){
        setresStatus('checking location change')
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              if(!lastcurrent || calculateDistance(lastcurrent.lat, lastcurrent.lon, latitude, longitude)){
              try {
                // Reverse geocoding using LocationIQ
                const response = await axios.get(
                  `https://us1.locationiq.com/v1/reverse.php?key=${locationApi}&lat=${latitude}&lon=${longitude}&format=json`
                );
                const newLocation = {
                  name: response.data.address.city || response.data.address.town || 'Unknown Location',
                  lat: response.data.lat,
                  lon: response.data.lon,
                  id: `${response.data.lat},${response.data.lon}`, // Unique ID for the location
                };
      
                  setCurrentLocation(newLocation);
                  saveCurrentLocation(newLocation);
                  setresStatus('changed')

              } catch (error) {
                console.error('Error fetching current location:', error);
                setresStatus('error')
              }finally{
                setTimeout(()=>{setresStatus(false)}, 2000)
              }
            }
            },
            (error) => {
              setresStatus('geo error')
              console.error('Geolocation error:', error)
            }
          );
          setTimeout(()=>{setresStatus(false)}, 3000)
      }
      };

    const searchLocation = async (e) =>{
        e.preventDefault();
        try{
          setsearchresponse('finding location...')
          const response = await axios.get(`https://us1.locationiq.com/v1/search?key=${locationApi}&q=${encodeURIComponent(searchQuery)}&format=json`);
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
    

    const handlesaveclick = (loc)=>{
      saveLocation(loc)
      setsearch(false)
      const newLocs = getSavedLocations();
      setlocations(newLocs)
      navigate('/weather', {state: {location: newLocs.find(loca => loca.lat === loc.lat), iscurrent: false}})
    }
    const handleclearall = ()=>{
      clearLocations()
      setlocations([])
      setCurrentLocation(null)
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

    useEffect(()=>{
      document.addEventListener('mousedown', handleClickoutside);
      return ()=>{document.removeEventListener('mousedown',handleClickoutside)}
    }, []);
  
    useEffect(()=>{
      if(issearch){
       inputref.current.focus();
      }
    }, [issearch, setsearch]);

    const handleClickoutside = (event)=>{
      if(searchRef.current && !searchRef.current.contains(event.target)){
        setsearch(false)
      }
    }

    const handleremove = async(loc)=>{
      setresStatus('removing')
      const response =  await removeLocation(loc);
      if(response){
        setlocations(response);
        setresStatus('removed');
      }else{
        setresStatus('error')
      }
      setTimeout(()=>setresStatus(false), 2000)
    }

    return(
        <div className="homecontainer">
           <h1>Nimbus Now <img src={`${process.env.PUBLIC_URL}/images/umbrella1.png`} alt='i'/></h1>
           {resStatus && <div className='home-response'>{resStatus}</div>}
           <div className='home-background' style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/back.jpg)`}}><div></div></div>
           <h2>Current location</h2>
           {currentLocation && <div className='current-name' onClick={()=> navigate('/weather',{ state: {location: currentLocation, iscurrent: true}})}>
           <img src={`${process.env.PUBLIC_URL}/images/currentlocation.png`} alt='+'/> {currentLocation.name}
            </div>}
            <div className='saved-locations-container'>
            <h2 className='saved-locations-title'>Saved {locations.length > 1 ? 'locations': 'location'}  {locations.length} 
                {locations.length < 10 && <> | <button onClick={()=> setsearch(true)} id="addlocation">+add new</button></>}</h2>
            <ul className='saved-locations'>
                {locations.map(loc => (
                    <li key={loc.id} >
                      <p onClick={()=> navigate('/weather', {state: {location: loc, iscurrent: false}})}>
                      <img src={`${process.env.PUBLIC_URL}/images/location.png`} alt='+'/> {loc.name}, {loc.country}</p>
                      <img src={`${process.env.PUBLIC_URL}/images/delete.png`} alt='-' id='removeloc' onClick={()=>handleremove(loc)}/></li>
                ))}
            </ul>
            </div>
            {issearch && <div ref={searchRef} className="addCont">
                <div className='addContent' style={{borderBottom:  '#eef3f9 1px dotted'}}>
                <button onClick={()=> setsearch(false)}><img src={`${process.env.PUBLIC_URL}/images/back.png`} alt="cancel"/></button>
                <form  className='searchform' onSubmit={searchLocation}>
                <input type='search' placeholder='city...' onChange={(e)=> setsearchQuery(e.target.value)} value={searchQuery} ref={inputref}  maxLength={50} required/>
                {searchQuery && <button onClick={()=>{setsearchQuery('')}} type='button' style={{borderLeft: '#eef3f9 1px dotted'}}>X</button>}
                </form>
                </div>
                <div className="searchresults">
                {searchresponse ? <p id="searchresponse">{searchresponse}</p> :<p id="searchresponse"> locations appear here to choose from</p>}
                <ul className="searchlist">
                    {searchresults.map(result => (<li key={result.place_id} onClick={()=> handlesaveclick(result)}>
                    <img src={`${process.env.PUBLIC_URL}/images/location.png`} alt='+'/> {result.display_name}
                    </li>))}
                </ul>
                </div>
            </div>}
        {locations && <button className='clearlocations' onClick={handleclearall}><img src={`${process.env.PUBLIC_URL}/images/remove.png`} alt='-'/> remove all locations</button>}
        </div>
    )
}





