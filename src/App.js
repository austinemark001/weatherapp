import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Weather from './components/Weather';
import Settings from './components/Settings';
import './App.css'


function App() {
  const [checkLocationtoken, setcheckLocationtoken] = useState(true);
  
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" exact element= {<Home checkLocationtoken={checkLocationtoken} setcheckLocationtoken={setcheckLocationtoken} />}/>
        <Route path="/weather" element={<Weather />} />
        <Route path="/settings" element={<Settings />}/>
        <Route path='*' Component={NoPage} />
      </Routes>
    </>
  );
}


function Header(){
  const location = useLocation();
  return(
      <>
      <header className="myheader">
        {location.pathname === '/weather' && <h1 id='title-weather'>{location.state.current && <sup><img src={`${process.env.PUBLIC_URL}/images/currentlocation.png`} alt='o'/></sup>} 
        {location.state.name ? location.state.name : 'unknown location'}</h1>}
        {location.pathname === '/' &&  <h1 id='title-home'>Nimbus Now <img src={`${process.env.PUBLIC_URL}/images/umbrella1.png`} alt='i'/></h1>}
        {location.pathname === '/settings' && <h1 id='title-settings'><img src={`${process.env.PUBLIC_URL}/images/setting.png`} alt='i'/>Settings</h1>}
        <div className='header-links'>
        <Link id='toplinkfirst' className='toplink' to='/'><img src={`${process.env.PUBLIC_URL}/images/locations.png`} alt='locations'/></Link>
        <Link to="/settings" id='toplinklast' className='toplink'><img src={`${process.env.PUBLIC_URL}/images/settings.png`} alt='settings'/></Link>
        </div>
      </header>
      </>
  )
}



function NoPage(){
  return(
    <div className="noPage">
        <h2 id="nopageInfo">Welcome to nimbus now <img src={`${process.env.PUBLIC_URL}/images/umbrella5.png`} alt='i'/></h2>
        <p>best weather app to exist. Current, hourly forecast, daily forecast and astro details</p>
        <Link to="/" id="nopageLink"> <img src={`${process.env.PUBLIC_URL}/images/drop.png`} alt='i'/>get weather data</Link>
    </div>
  )
}


export default App;
