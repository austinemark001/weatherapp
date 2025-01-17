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
    const [radiusT, setradiusT] = useState(4000)
    const [geoDenied, setgeoDenied] = useState(false);


    const searchRef = useRef(null);
    const inputref = useRef(false);


    useEffect(() => {
       const existingLocations = getLocations()
        setlocations(sortedLocations(existingLocations));
        setshortweathers(getshortweathers() || 3000)
        setradiusT(getThreshold())

    const checkLocation = async () => {
        const lastcurrent = existingLocations.find(loc => loc.current === true);
              const geo_location = await getgeolocation();
              if(geo_location){
              if(!lastcurrent || calculateDistance(lastcurrent.lat, lastcurrent.lon, geo_location.latitude, geo_location.longitude)){
                const response = await  updatecurrentlocation(geo_location.latitude, geo_location.longitude)
                if(response === true){
                  setresStatus('location changed')
                  setTimeout(()=> setresStatus(false), 2000)
                }
            }
          }
          setcheckLocationtoken(false)
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
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
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
          const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5`);
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
      const newLocs = saveLocation(loc)
      setsearch(false)
      setlocations(newLocs)
      /*navigate('/weather', {state: newLocs.find(loca => loca.id === loc.place_id)})*/
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
        const toRadians = (deg) => deg * (Math.PI / 180);
        const R = 6371000
        const lat1R = toRadians(lat1)
        const lat2R = toRadians(lat2)
        const lon1R = toRadians(lon1)
        const lon2R = toRadians(lon2);

        const dLat = lat2R -lat1R;
        const dLon = lon2R -lon1R;
        const a = Math.sin(dLat / 2) **2 + Math.cos(lat1R) * Math.cos(lat2R) * Math.sin(dLon / 2) ** 2
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c
        return distance > radiusT
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
           {resStatus && <div className='home-response'>{resStatus}</div>}
           {geoDenied && <p className='geo-denied'><img src={`${process.env.PUBLIC_URL}/images/warning.png`} alt='o'/> geolocation is not allowed, auto current location disabled</p>}
           <div className='home-background' style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/background.jpg)`}}><div></div></div>
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





