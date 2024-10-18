import React, {useEffect, useState, useRef} from "react";
import { useSwipeable } from "react-swipeable";
import { getcodeDetails, toFahrenheit, formatTimeEpoch, truncateTextSentense, formatDate} from "../weatherConfig";
import './Forecast.css';


export default function Forecast({dailyforecast, hourlyforecast, currenttime, sunrisetime, sunsettime, settings}){
    const [scrollPosition, setScrollPosition] = useState(0);
    const scrollRef = useRef(null);
    const [darkmode, setdarkmode] = useState(true);

    useEffect(()=>{
        if(settings.mode === 'dark'){
          setdarkmode(true)
        }else{
          setdarkmode(false)
        }
      }, [settings.mode])

    const ishourday = (hourtime)=>{
        const hourTime = new Date(hourtime).getHours();
        const sunriseTime = new Date(sunrisetime).getHours();
        const sunsetTime = new Date(sunsettime).getHours();
        return hourTime >= sunriseTime && hourTime <= sunsetTime;

    }

    //handle scrolls
    const handleScroll = ()=>{
        const scrollLeft = scrollRef.current.scrollLeft;
        const scrollWidth = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        const scrolled = (scrollLeft / scrollWidth) * 100;
        setScrollPosition(scrolled)
    }
    const scrollLeft = ()=>{
        scrollRef.current.scrollBy({left: -100, behavior: 'smooth'})
    }
    const scrollRight = ()=>{
        scrollRef.current.scrollBy({left: 100, behavior: 'smooth'})
    }

    const handlers = useSwipeable({
        onSwipedLeft: ()=> scrollRight(),
        onSwipedRight: ()=> scrollLeft(),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    })
    

    return(
        <>
        <div className='hourlyDetails'>
        <h4> <img src={`${process.env.PUBLIC_URL}/images/${darkmode ? 'time': 'timedark'}.png`}/> today hourly</h4>
        <button id="hourprev" onClick={scrollLeft}><img src={`${process.env.PUBLIC_URL}/images/prev.png`} alt='prev'/></button>
        <ul {...handlers}  className={`hourlyList ${darkmode  ? 'hourdark' : 'hourlight'}`} style={{overflowX: 'auto'}} ref={scrollRef} onScroll={handleScroll}>
            {hourlyforecast.map(hour =>(
                <li key={hour.startTime} className="hourDetails">
                    <p id='hourTime'>{formatTimeEpoch(hour.startTime, currenttime)}</p>
                    <img src={ishourday(hour.startTime) ? getcodeDetails[hour.values.weatherCode].iconday : getcodeDetails[hour.values.weatherCode].iconnight } alt='icon' id='hourIcon'/>
                    <p id='hourText'>{Math.round(settings.temp ==='celcius' ? `${hour.values.temperature}`: `${toFahrenheit(hour.values.temperature)}`)}° {hour.values.precipitationProbability > 0 ? <><img src={`${process.env.PUBLIC_URL}/images/drop.png`} alt='icon'/>
                    {hour.values.precipitationProbability}%</>: ''}</p>
                </li>
            ))}
        </ul>
        <button id='hournext' onClick={scrollRight}><img src={`${process.env.PUBLIC_URL}/images/next.png`} alt='next'/></button>
        <div className="hourlylistbar" style={{position: 'relative', backgroundColor: `${darkmode ? '#0000004d': '#ffffff4d'}`}}>
            <div style={{backgroundColor: `${darkmode ? '#4b3a70': '#8cbd89'}`, width: `${scrollPosition}%`, height: '100%', transition: 'width 0.3s'}}/>
        </div>
    </div>
        <div className='dailyDetails'>
            <h4> <img src={`${process.env.PUBLIC_URL}/images/${darkmode ? 'time': 'timedark'}.png`}/> daily forecast</h4>
            <ul className='dailyList'>
                {dailyforecast.map(day=>(
                    <li key={day.startTime} className={`dayDetails ${darkmode ? 'daydark': 'daylight'}`}>
                        <p id='dayMain'>{formatDate(day.startTime)}</p>
                        <p id='dayTempRange'><img src={`${process.env.PUBLIC_URL}/images/temperature.png`} alt='icon'/>{Math.round(settings.temp ==='celcius' ? `${day.values.temperatureMax}`: `${toFahrenheit(day.values.temperatureMax)}`)}
                        /{Math.round(settings.temp ==='celcius' ? `${day.values.temperatureMin}`:`${toFahrenheit(day.values.temperatureMin)}`)}°</p>
                        <p id='dayText'><img src={getcodeDetails[day.values.weatherCode].iconday} alt='icon'/>{truncateTextSentense(getcodeDetails[day.values.weatherCode].text)}</p>
                        <p id='rainChance'><img src={`${process.env.PUBLIC_URL}/images/drop.png`} alt='icon'/>{day.values.precipitationProbability}%</p>
                    </li>
                ))}
            </ul>
        </div>
        </>
    )
}



