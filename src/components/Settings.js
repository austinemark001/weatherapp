import React from 'react';
import './Settings.css'

export default function Settings({settings, setsettings}){

    const changetemp = ()=>{
        if(settings.temp === 'celcius'){
            setsettings(prev=>{ const updated = {...prev, temp: 'fahren' }; 
                localStorage.setItem('settings', JSON.stringify(updated)); return updated})
        }else{

            setsettings(prev=>{ const updated = {...prev, temp: 'celcius' }; 
                localStorage.setItem('settings', JSON.stringify(updated)); return updated})
        }
    }

    const changespeed = ()=>{
        if(settings.speed === 'm'){

            setsettings(prev=>{ const updated = {...prev, speed: 'km' }; 
                localStorage.setItem('settings', JSON.stringify(updated)); return updated})
        }else{
           
            setsettings(prev=>{ const updated = {...prev, speed: 'm' }; 
                localStorage.setItem('settings', JSON.stringify(updated)); return updated})
        }
    }
    const changedistance = ()=>{
        if(settings.distance === 'km'){
           
            setsettings(prev=>{ const updated = {...prev, distance: 'm' }; 
                localStorage.setItem('settings', JSON.stringify(updated)); return updated})
        }else{
            
            setsettings(prev=>{ const updated = {...prev, distance: 'km' }; 
                localStorage.setItem('settings', JSON.stringify(updated)); return updated})
        }
    }
    const changemode = ()=>{
        if(settings.mode === 'dark'){
           
            setsettings(prev=>{ const updated = {...prev, mode: 'light' }; 
                localStorage.setItem('settings', JSON.stringify(updated)); return updated})
        }else{
            
            setsettings(prev=>{ const updated = {...prev, mode: 'dark' }; 
                localStorage.setItem('settings', JSON.stringify(updated)); return updated})
        }
    }
    return(
        <div className="settingCont">
            <div className="settingscontent">
                <h3>unit settings</h3>
                <p id="tempunit">temperature unit: <span>{settings.temp === 'celcius' ? '℃': '℉'}</span> 
                <span id="changeunit" onClick={changetemp}>change to {settings.temp === 'celcius' ? '℉': '℃'}</span></p>
                <p id="speedunit">speed unit: <span>{settings.speed === 'm' ? 'm/s': 'km/h'}</span> 
                <span id="changeunit" onClick={changespeed}>change to {settings.speed === 'm' ? 'km/h': 'm/s'}</span></p>
                <p id="tempunit">distance unit: <span>{settings.distance === 'km' ? 'kilometres': 'miles'}</span> 
                <span id="changeunit" onClick={changedistance}>change to {settings.distance === 'km' ? 'miles': 'kilometres'}</span></p>
                <h3>theme settings</h3>
                <p id="modetheme">theme: <span>{settings.mode === 'dark' ? 'dark': 'light'}</span> 
                <span id="changeunit" onClick={changemode}>change to {settings.mode === 'dark' ? 'light': 'dark'}</span></p>
            </div>
        
            <div className="aboutcontent">
            <h3>about developer</h3>
            <img src={`${process.env.PUBLIC_URL}/images/me.jpg`} alt='me'/>
            <h4>austine mark software developer</h4>
            <p>This WeatherApp is a showcase of React expertise and API integration,
                 demonstrating my proficiency in modern web development.
                 With a sleek and responsive design, the app provides real-time weather
                  updates using external APIs, 
                 allowing users to stay informed about current conditions and forecasts worldwide. 
                 This WeatherApp reflects a commitment to user-centric design, 
                 offering an intuitive interface and seamless navigation.<br/> <br/> For more projects showcasing Austine Mark's skills, 
                visit <a href="https://austinemark.com">my website</a> and
                 experience the blend of functionality, aesthetics, and technical excellence firsthand.</p>
            </div>
            <footer className="myfooter">
            <ul className="socialLinks">
                <li><a href='https://github.com/austinemark001'> <img src={`${process.env.PUBLIC_URL}/images/${settings.mode === 'dark' ? 'github' : 'githubdark'}.png`} alt='git'/> </a></li> 
                <li><a href='https://www.facebook.com/profile.php?id=100081241973286'> <img src={`${process.env.PUBLIC_URL}/images/${settings.mode === 'dark' ? 'facebook': 'facebookdark'}.png`} alt='fb'/></a></li>
                <li><a href='https://www.instagram.com/mark.a.101?igsh=YzljYTk1ODg3Zg=='> <img src={`${process.env.PUBLIC_URL}/images/${settings.mode ==='dark' ? 'instagram':'instagramdark'}.png`} alt='ig'/></a></li>
                <li><a href='https://x.com/Austine19251417?t=XC13lUeb9F9VZrc50dxVqQ&s=09'> <img src={`${process.env.PUBLIC_URL}/images/${settings.mode ==='dark' ? 'x':'xdark'}.png`} alt='x'/></a></li>
                <li><a href='https://www.linkedin.com/in/austine-mark-abb7282aa'><img src={`${process.env.PUBLIC_URL}/images/${settings.mode ==='dark' ? 'linkedin':'linkedindark'}.png`} alt='ln'/></a></li>
            </ul>
            <p id="creator">created by austine mark - <a href="https://austinemark.com">visit my website</a></p>
    </footer>
        </div>
    )
}
