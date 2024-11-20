import React, { useEffect, useState } from "react";
import { getcodeDetails, toFahrenheit, formatTimeEpoch, truncateTextSentense, formatDate} from "../weatherConfig";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './Forecast.css';


export default function Forecast({dailyforecast, hourlyforecast, currenttime , settings}){
    const [hourychartdata, sethourlychartdata] = useState([]);
    const [chartheight, setchartheight] = useState(350);

    
    useEffect(()=>{
        const handleSize = ()=>{
            if(window.innerWidth <768) setchartheight(200)
            
        };
        window.addEventListener('resize', handleSize);
        handleSize();
        return ()=>{
            window.removeEventListener('resize', handleSize)
        
        }
    },[])

    useEffect(()=>{
        let myarray = [];
        hourlyforecast.forEach(dt=>{
            const time = formatTimeEpoch(dt.startTime);
            const temp = dt.values.temperature;
            const prep = settings.temp === 'celcus' ? dt.values.precipitationProbability: toFahrenheit(dt.values.precipitationProbability);
            myarray.push({time: time, temp: temp, prep: prep})
        })
        sethourlychartdata(myarray)
    }, [hourlyforecast, settings.temp])

    return(
        <>
        <div className='hourlyDetails'>
        <h4> <img src={`${process.env.PUBLIC_URL}/images/time.png`}/> today hourly</h4>
        <div className="hourlychart">
        <ResponsiveContainer width={'100%'} height={chartheight}>
        <LineChart  data={hourychartdata}>
        {/*<CartesianGrid strokeDasharray="5 3"/>*/}
        <XAxis dataKey="time"  fill="#ffffff" stroke="#ffffff"/>
        <YAxis  fill="#ffffff" stroke="#ffffff"/>
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="temp" stroke="#ffffff"  />
      </LineChart>
      </ResponsiveContainer>
      </div>
        <div className="hourlyprep">
            <h5>expect precipitation around</h5>
            <div>
            {hourlyforecast.map(hour =>(
                <>
                {hour.values.precipitationProbability > 0 && <p key={hour.startTime} className="hourDetails">
                    {formatTimeEpoch(hour.startTime, currenttime)} <span>{formatDate(hour.startTime)}</span>
                    <img src={getcodeDetails[hour.values.weatherCode].iconday} alt='icon'/>
                    {hour.values.precipitationProbability}%
                </p>}
                </>
            ))}
            </div>
        </div>
    </div>
        <div className='dailyDetails'>
            <h4> <img src={`${process.env.PUBLIC_URL}/images/time.png`}/> daily forecast</h4>
            <ul className='dailyList'>
                {dailyforecast.map(day=>(
                    <li key={day.startTime} className='dayDetails'>
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



