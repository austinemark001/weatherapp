import React from 'react';
import { Helmet } from 'react-helmet';
import './Settings.css';
import { getLastsettings, settingsunits , updatesettingsdata, resetSettings} from '../settingsConfig';
import { useState, useEffect } from 'react';

export default function Settings(){
    const [settings, setsettings] = useState({});
    const [showchangeCard, setshowchangeCard] = useState(false);
    const [currentSetting, setcurrentSettings] = useState(null);
    const [activeValue, setactiveValue] = useState(null);

    useEffect(()=>{
        setsettings(getLastsettings())
    }, [])

    const handelOpenChangeCard = (settingsKey) =>{
        setcurrentSettings(settingsKey);
        setactiveValue(settings[settingsKey]);
        setshowchangeCard(true);
    }
    const handlesaveChange = (newvalue)=>{
        setactiveValue(newvalue)
        let newsettings = settings;
        newsettings[currentSetting] = isNaN(newvalue) ? newvalue : parseInt(newvalue);
        updatesettingsdata(newsettings)
        setsettings(newsettings)
        setshowchangeCard(false)
    }
    const handlereset = ()=>{
        setsettings(resetSettings())
    }

    const configtitle = (key)=>{
        switch(key){
            case 'autorefreshduration': return ' auto refresh weather after?';
            case 'radiusthreshold' : return 'auto change location after?';
            default: return key
        }
    }
    const configUnits = (key, unit)=>{
        switch(key){
            case 'autorefreshduration': return `${unit} hour`;
            case 'radiusthreshold' : return `${unit / 1000} kilometres`;
            default: return unit
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
            <div className="settings-list">
                {Object.entries(settings).map(([key, value])=>(
                    <div key={key} className='setting'>
                        <div>
                            <h4>{configtitle(key)}</h4>
                            <p>{configUnits(key, value)}</p>
                        </div>
                        <button onClick={() =>handelOpenChangeCard(key)}>change</button>
                    </div>
                ))}
             <button onClick={handlereset} className='reset-settings'> <img src={`${process.env.PUBLIC_URL}/images/reset.png`} alt='ico'/>reset setting</button>
            </div>

            {showchangeCard && <div className='settings-change-card'>
                <h4>change {configtitle(currentSetting)}</h4>
                <div className='settings-change-units'>
                {settingsunits[currentSetting]?.units ? (
                    settingsunits[currentSetting].units.map((unit)=> (
                        <label key={unit}>
                            <input type='radio' value={unit} checked={activeValue === unit} onChange={(e)=> handlesaveChange(e.target.value)}/>
                            {configUnits(currentSetting, unit)}
                        </label>
                    ))
                ): <p>no value to change</p>}
                </div>
                <button onClick={()=>setshowchangeCard(false)}>cancel</button>
            </div>}

        
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
            <p id="creator">created by austine mark - <a href="https://austinemark.com">see others</a></p>
    </footer>
        </div>
    )
}
