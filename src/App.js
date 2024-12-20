import React, {useState, useRef, useEffect} from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Weather from './components/Weather';
import Settings from './components/Settings';
import './App.css'


function App() {
  const [currenttoken, setcurrenttoken] = useState(true);
  const [settings, setsettings] = useState([]);
  useEffect(()=>{
    if(!localStorage.getItem('settings')){
       localStorage.setItem('settings', JSON.stringify(initialunits))
    }
    const settingstore = JSON.parse(localStorage.getItem('settings'))
    setsettings(settingstore)
  }, [])

  

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" exact element= {<Home />}/>
        <Route path="/weather" element={<Weather settings={settings} currenttoken={currenttoken} setcurrenttoken={setcurrenttoken}/>} />
        <Route path="/settings" element={<Settings settings={settings} setsettings={setsettings}/>}/>
        <Route path='*' Component={NoPage} />
      </Routes>
    </>
  );
}


function Header(){
  const [isMenu, setMenu] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const handleClickoutside = (event)=>{
    if(menuRef.current && !menuRef.current.contains(event.target)){
      setMenu(false)
    }
  }
  useEffect(()=>{
    document.addEventListener('mousedown', handleClickoutside);
    return ()=>{document.removeEventListener('mousedown',handleClickoutside)}
  }, [])
  return(
      <>
      <header className="myheader">
        <Link id='toplinkfirst' className='toplink' to='/'><img src={`${process.env.PUBLIC_URL}/images/locations.png`} alt='locations'/></Link>
        <Link to="/settings" id='toplinklast' className='toplink'><img src={`${process.env.PUBLIC_URL}/images/settings.png`} alt='settings'/></Link>
      </header>
      </>
  )
}



function NoPage(){
  return(
    <div className="noPage">
        <h2 id="nopageInfo">Welcome to nimbus now</h2>
        <p>your  may be asked to  allow  my web app use location in order to fetch help your current location data</p>
        <Link to="/" id="nopageLink">Get weather data</Link>
    </div>
  )
}

const initialunits = {
  temp: 'celcius',
  speed: 'm',
  distance: 'km',
}

export default App;
