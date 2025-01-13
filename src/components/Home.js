import './Home.css'
import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getLocations, saveLocation, clearLocations, getshortweathers, removeLocation } from '../localstoragehelper';
import { getcodeIcon, getcodecondition } from '../weatherConfig';
import { getThreshold } from '../settingsConfig';
import { getTimeDifference } from '../dateConfig';


export default function Home({ checkLocationtoken, setcheckLocationtoken }){
    const navigate = useNavigate();
    const [locations, setlocations] = useState([]);
    const [shortweathers, setshortweathers] = useState({});
    const [issearch, setsearch] = useState(false)
    const [searchQuery, setsearchQuery] = useState();
    const [searchresponse, setsearchresponse] = useState(false);
    const [searchresults, setsearchresults] = useState([]);
    const [resStatus, setresStatus] = useState(null);
    const [geoDenied, setgeoDenied] = useState(false);
    const locationApi = process.env.REACT_APP_LOCATION_IQ;

    const searchRef = useRef(null);
    const inputref = useRef(false);
    const  RADIUS_THRESHOLD = getThreshold() || 5000;


    useEffect(() => {
       const existingLocations = getLocations()
        setlocations(sortedLocations(existingLocations));
        setshortweathers(getshortweathers())

    const checkLocation = async () => {
        const lastcurrent = existingLocations.find(loc => loc.current === true);
              const geo_location = await getgeolocation();
              if(geo_location){
              if(!lastcurrent || calculateDistance(lastcurrent.lat, lastcurrent.lon, geo_location.latitude, geo_location.longitude)){
                const response = await  updatecurrentlocation(geo_location.latitude, geo_location.longitude)
                if(response === true){
                  setcheckLocationtoken(false)
                  setresStatus('location changed')
                }
                setTimeout(()=> setresStatus(false), 2000)
            }
          }

      }
        if(checkLocationtoken){
        checkLocation();
        }
    },[])

    const getgeolocation =  async ()=>{
       try{
       const position = await new Promise((resolve, reject)=>{navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve(position.coords),
        (error) => reject(error)
       )}); return position
        }catch(error){
        console.error('Geolocation error:', error)
        if(error.code === 1) setgeoDenied(true);
          return null
       }

    }

 
  const updatecurrentlocation = async (latitude, longitude)=>{
    try {
      const response = await axios.get(
        `https://us1.locationiq.com/v1/reverse.php?key=${locationApi}&lat=${latitude}&lon=${longitude}&format=json`
      );
      saveLocation(response.data, true)
      setlocations(sortedLocations(getLocations()))
      return true

    } catch (error) {
      console.error('Error fetching current location:', error);
      return false
    }
  }

    const searchLocation = async (e) =>{
        e.preventDefault();
        try{
          setsearchresponse('. . .')
          const response = await axios.get(`https://us1.locationiq.com/v1/search?key=${locationApi}&q=${encodeURIComponent(searchQuery)}&format=json`);
          const data = await response.data;
          if(data && data.length > 0){
            setsearchresults(data);
            setsearchresponse('select one from list')
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
      const newLocs = getLocations();
      setlocations(newLocs)
      console.log(newLocs)
      navigate('/weather', {state: newLocs.find(loca => loca.id === loc.place_id)})
    }
    const handleclearall = ()=>{
      clearLocations()
      setlocations([])
    }

    const sortedLocations = (locs)=>{
      const sortedlocations = [...locs].sort((a, b)=> b.current - a.current)
      return sortedlocations
    }
    
    const calculateDistance = (lat1, lon1, lat2, lon2)=>{
        /*const lat1dp = Math.floor(lat1 * 10)/10;
        const lon1dp = Math.floor(lon1 * 10)/10;
        const lat2dp = Math.floor(lat2 * 10)/10;
        const lon2dp = Math.floor(lon2 * 10)/10;
        const latdif = Math.abs(lat2dp - lat1dp);
        const londif = Math.abs(lon2dp - lon1dp)

        return latdif > 0.01 || londif > 0.01*/
        const toRadians = (deg) => (deg * Math.PI) / 180;
        const R = 6371000
        const dLat = toRadians(lat2 -lat1);
        const dLon = toRadians(lon2, lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c) > RADIUS_THRESHOLD
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
      setresStatus('. . .')
      const response =  await removeLocation(loc);
      if(response){
        setlocations(sortedLocations(response));
        setresStatus('removed');
      }else{
        setresStatus('error')
      }
      setTimeout(()=>setresStatus(false), 2000)
    }
    const handleRefreshClick = async()=>{
       setresStatus('. . .')
       const geolocation = await getgeolocation();
       if(geolocation){
        const response = await updatecurrentlocation(geolocation.latitude, geolocation.longitude);
        if(response){
          setresStatus('updated')
        }else{
          setresStatus('failed')
        }
       }else{
        setresStatus('location error')
       }
       setTimeout(()=> setresStatus(false), 2000)
    }

    return(
        <div className="homecontainer">
          <h1>Nimbus Now <img src={`${process.env.PUBLIC_URL}/images/umbrella1.png`} alt='i'/></h1>
           {resStatus && <div className='home-response'>{resStatus}</div>}
           {geoDenied && <p className='geo-denied'><img src={`${process.env.PUBLIC_URL}/images/warning.png`} alt='o'/> geolocation is not allowed, update browser settings for site to access auto current</p>}
           <div className='home-background' style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/back.jpg)`}}><div></div></div>
           {locations && <div className='locations-container'>
            <div> <div className='locations-top'>
              <div className='locations-top-first'>
               <h2>{locations.length}  {locations.length > 1 ? 'locations': 'location'}</h2>
               {locations.length < 31 &&<button onClick={()=> setsearch(true)} id="add-location"><img src={`${process.env.PUBLIC_URL}/images/add.png`} alt='+'/></button>}
              </div>
              <div className='locations-top-last'>
              <button onClick={handleRefreshClick}><img src={`${process.env.PUBLIC_URL}/images/reload.png`} alt='o'/></button>
              {locations.length > 2 && <button onClick={handleclearall}><img src={`${process.env.PUBLIC_URL}/images/clear.png`} alt='-'/></button>}</div>
              </div>
              </div>

               
              <div className='locations'>
                {locations.map(loc => (
                    <div key={loc.id} className='location' >
                      <div className='location-summary'  onClick={()=> navigate('/weather', {state: loc})}>
                      <h4>{loc.name}
                      <span>{loc.current && <img src={`${process.env.PUBLIC_URL}/images/currentlocation.png`} alt='!'/>}{loc.current ? 'current' : loc.country}</span>
                      </h4>
                      {shortweathers[loc.id] ? <div className='location-short-weather'>
                       <p><img src={getcodeIcon(shortweathers[loc.id].code)} alt='icon'/>
                          {getcodecondition(shortweathers[loc.id].code)}</p>
                        <p id='last-fetched'>{getTimeDifference(shortweathers[loc.id].timestamp)}</p>
                      </div> : <p id='no-short-weathers'>location added</p>}
                      </div>
                      <div className='location-remove'>
                        <img src={`${process.env.PUBLIC_URL}/images/delete.png`} alt='-' id='removeloc' onClick={()=>handleremove(loc)}/>
                      </div>
                    </div>
                ))}
            </div>
            </div>}
            {issearch && <div ref={searchRef} className="addCont">
                <div className='addContent'>
                <button onClick={()=> setsearch(false)}><img src={`${process.env.PUBLIC_URL}/images/back.png`} alt="cancel"/></button>
                <form  className='searchform' onSubmit={searchLocation}>
                <input type='search' placeholder='city...' onChange={(e)=> setsearchQuery(e.target.value)} value={searchQuery} ref={inputref}  maxLength={50} required/>
                {searchQuery && <button onClick={()=>{setsearchQuery('')}} type='button' id='delete-search-text'>X</button>}
                </form>
                </div>
                <div className="searchresults">
                {searchresponse ? <p id="searchresponse">{searchresponse}</p> :<p id="searchresponse"> locations will appear here to choose from</p>}
                <ul className="searchlist">
                    {searchresults.map(result => (<li key={result.place_id} onClick={()=> handlesaveclick(result)}>
                    <img src={`${process.env.PUBLIC_URL}/images/location.png`} alt='+'/> {result.display_name}
                    </li>))}
                </ul>
                </div>
            </div>}
       
        </div>
    )
}





