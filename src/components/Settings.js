import React from 'react';
import { Helmet } from 'react-helmet';
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
    return(
        <div className="settingCont">
            <Helmet><title>nimbusnow settings</title>
            <meta name="description" content='change weather settings like the temperature value, speed unit and distance unit to what suits you'/>
            <meta name="keywords" content='change weather settings, celcuis to fahrenheit'/>
            <meta property='og:title' content='nimbusnow settings'/>
            <meta property="og:description" content='change weather settings like the temperature value, speed unit and distance unit to what suits you'/>
            <meta property='og:url' content='https://numbusnow.austinemark.com/weather/settings' />
            <meta property="twitter:title" content='nimbusnow settings'/>
            <meta property="twitter:description" content='change weather settings like the temperature value, speed unit and distance unit to what suits you' />
            </Helmet>
            <div className='settings-background' style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/back.jpg)`}}><div></div></div>
            <div className="settingscontent">
                <h3>unit settings</h3>
                <p id="tempunit">temperature unit: <span>{settings.temp === 'celcius' ? '℃': '℉'}</span> 
                <span id="changeunit" onClick={changetemp}>change to {settings.temp === 'celcius' ? '℉': '℃'}</span></p>
                <p id="speedunit">speed unit: <span>{settings.speed === 'm' ? 'm/s': 'km/h'}</span> 
                <span id="changeunit" onClick={changespeed}>change to {settings.speed === 'm' ? 'km/h': 'm/s'}</span></p>
                <p id="tempunit">distance unit: <span>{settings.distance === 'km' ? 'kilometres': 'miles'}</span> 
                <span id="changeunit" onClick={changedistance}>change to {settings.distance === 'km' ? 'miles': 'kilometres'}</span></p>
            </div>
        
            <div className="aboutcontent">
            <h3>Austine Mark - Software developer</h3>
            {/*<img src={`${process.env.PUBLIC_URL}/images/me.jpg`} alt='me'/>
            <h4>austine mark software developer</h4>*/}
            <p>Nimbusnow is a showcase of my React expertise and API integration,
                 demonstrating my proficiency in modern web development.
                 With a sleek and responsive design, the app provides real-time weather
                  updates using external APIs, 
                 allowing users to stay informed about current conditions and forecasts worldwide. 
                 Nimbusnow reflects a commitment to user-centric design, 
                 offering an intuitive interface and seamless navigation.<br/> <br/> For more projects showcasing Austine Mark's skills, 
                visit <a href="https://austinemark.com">my website</a> and
                 experience the blend of functionality, aesthetics, and technical excellence firsthand.</p>
            </div>
            <footer className="myfooter">
            <ul className="socialLinks">
                <li><a href='https://github.com/austinemark001'> <img src={`${process.env.PUBLIC_URL}/images/github.png`} alt='git'/> </a></li> 
                <li><a href='https://x.com/Austine19251417?t=XC13lUeb9F9VZrc50dxVqQ&s=09'> <img src={`${process.env.PUBLIC_URL}/images/x.png`} alt='x'/></a></li>
                <li><a href='https://www.linkedin.com/in/austine-mark-abb7282aa'><img src={`${process.env.PUBLIC_URL}/images/linkedin.png`} alt='ln'/></a></li>
            </ul>
            <p id="creator">created by austine mark - <a href="https://austinemark.com">see others</a></p>
    </footer>
        </div>
    )
}
