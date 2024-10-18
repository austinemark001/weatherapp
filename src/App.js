import React, {useState, useRef, useEffect} from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Favorites from './components/Favorites';
import Settings from './components/Settings';
import './App.css'


function App() {
  const [iscurrent, setcurrent] = useState(true);
  const [settings, setsettings] = useState([]);
  useEffect(()=>{
    if(!localStorage.getItem('settings')){
       localStorage.setItem('settings', JSON.stringify(initialunits))
    }
    const settingstore = JSON.parse(localStorage.getItem('settings'))
    setsettings(settingstore)
    console.log(settingstore)
    if(!settingstore.mode){
      setsettings(prev=>({...prev, mode: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark': 'light'}))
    }
  }, [])

  
  useEffect(()=>{
    document.body.className = settings.mode
    if(settings.mode === 'light'){
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#f7f1ed')
    }else{
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#001b2e')
    }
  },[settings.mode])
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" exact element= {<Home iscurrent={iscurrent} setcurrent={setcurrent} settings={settings}/>}/>
        <Route path="/favorites" element={<Favorites settings={settings}/>} />
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
        {location.pathname ==='/' ? <Link id='toplinkfirst' className='toplink' to='/favorites'>my locations</Link>: <Link id='toplinkfirst' className='toplink' to='/'>current location</Link>}
        <Link to="/settings" id='toplinklast' className='toplink'> settings</Link>
      </header>
      </>
  )
}



function NoPage(){
  return(
    <div className="noPage">
        <h2 id="nopageInfo">Welcome to My Weather App</h2>
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
