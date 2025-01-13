import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
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
 
  return(
      <>
      <header className="myheader">
        <Link id='toplinkfirst' className='toplink' to='/'><img src={`${process.env.PUBLIC_URL}/images/locations3.png`} alt='locations'/></Link>
        <Link to="/settings" id='toplinklast' className='toplink'><img src={`${process.env.PUBLIC_URL}/images/settings1.png`} alt='settings'/></Link>
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
