import React, { useEffect, useState } from "react";
import { getcodeDetails, getprecipDetails, truncateTextSentense, formatwind, uvHealth, formatvisibility} from "../weatherConfig";
import { XAxis, YAxis, ResponsiveContainer, Tooltip, Line, LineChart, CartesianGrid} from 'recharts';
import { formattime, formatday, formathour, formatLocalDate, filterdate, addhour , formatSunriseSet} from "../dateConfig";
import './Forecast.css';


export default function Forecast({dailyforecast, hourlyforecast, currenttime, astrodet, curveRef, temperatureUnit, temperatureUnitChart, 
    distanceUnit, speedUnit, settings}){
    const [hourychartdata, sethourlychartdata] = useState([]);
    const [chartheight, setchartheight] = useState({x: 300, y: 40, w: 20});
    const [prepresult, setprepresult] = useState([]);
    const [dailyExtend, setdailyExtend] = useState(false);

    
    useEffect(()=>{
        const handleSize = ()=>{
            if(window.innerWidth > 437 && window.innerWidth < 768) setchartheight((prev)=>({...prev,x:170,y: 30}));
            if (window.innerWidth < 437) setchartheight((prev)=>({...prev,x:170,y: 27, w: 15}));
            
            
        };
        window.addEventListener('resize', handleSize);
        handleSize();
        return ()=>{
            window.removeEventListener('resize', handleSize)
        
        }
    },[])

    useEffect(()=>{
        const newArray = hourlyforecast.filter(
            (hour)=> hour.values.precipitationProbability > 1
        )
        const result= [];
        let block = [];
        newArray.forEach((interval, index)=>{
            const precipitationProbability = interval.values.precipitationProbability;
            const current = filterdate(interval.startTime);
            const next = newArray[index + 1] ? filterdate(newArray[index + 1].startTime): null
            if(precipitationProbability > 0){
                block.push(interval);
                if(!next || formattime(addhour(current, 1)) !== formattime(next)){
                    const first = block[0];
                    const startTime = first.startTime;
                    const duration = block.length;
                    const percentage = first.values.precipitationProbability
                    const precipitationType = getprecipDetails(first.values.precipitationType)
                    const description = duration > 1 ?
                    `${duration}hrs ${precipitationType} outlook from ${formathour(startTime, currenttime)} (${percentage}% chance)
                     ${formatday(startTime, currenttime).toLocaleLowerCase()}`:
                    `${percentage}%  ${precipitationType} chance at ${formathour(startTime)} 
                    ${formatday(startTime, currenttime).toLocaleLowerCase()}`

                    result.push(description);
                    block = []
                }
            }
        })
        setprepresult(result)
       
    }, [hourlyforecast, currenttime])

    useEffect(()=>{
        let myarray = [];
        hourlyforecast.forEach(dt=>{
            const time = formathour(dt.startTime, currenttime);
            //const temp =  Math.round(settings.temp === 'celcius' ? dt.values.temperature: toFahrenheit(dt.values.temperature));
            const temp = temperatureUnitChart(dt.values.temperature);
            const icon = dt.values.weatherCode;
            myarray.push({time: time, temp: temp, icon: icon})
        })
        sethourlychartdata(myarray)
    }, [hourlyforecast, currenttime])


    const CustomDot = (props)=>{
        const {cx, cy, payload} = props;
        //const cleanedValue = payload.temp.toString().replace(/^0+/, '');
        return(
            <g>
            <image x={cx-10} y={cy-50} width={chartheight.w} height={chartheight.w} href={`/images/icons/${payload.icon}.png`}/>
            <circle cx={cx} cy={cy} r={3} fill="#ededed"/>
            <text x={cx} y={cy -10} textAnchor="middle" fill="#ededed" fontSize={'0.9em'}>{payload.temp}°</text>
            </g>
        )
    }
    
    
    const scrollchart = (direction)=>{
       const chartcontainer = document.querySelector('.chart-container');
       if(chartcontainer){
        const scrolldistance = window.innerWidth / 3
        const scrollamount = direction === 'right' ? scrolldistance: -scrolldistance;
        chartcontainer.scrollBy({left: scrollamount, behavior: 'smooth'})
       }
    }

    const scrolldaily = (direction)=>{
        const chartcontainer = document.querySelector('.daily-forecast');
        if(chartcontainer){
         const scrolldistance = window.innerWidth / 2;
         const scrollamount = direction === 'right' ? scrolldistance: -scrolldistance;
         chartcontainer.scrollBy({left: scrollamount, behavior: 'smooth'})
        }
     }

    return(
        <div className='forecast-container'>
        <h3><img src={`${process.env.PUBLIC_URL}/images/forecast.png`} alt="f"/>Forecast | <span>{formatLocalDate(currenttime)}</span></h3>
        <div className='daily-container'>
            <h4> <img src={`${process.env.PUBLIC_URL}/images/daily.png`} alt="dy"/> next 5 days</h4>
            <div className="daily-forecast">
            <div className='daily-forecast-list'>
                {dailyforecast.map(day=>(
                    <div key={day.startTime} className='day-forecast-details' onClick={()=>setdailyExtend(day)}>
                        <div className="day-start">
                        <p id='day-main'>{formatday(day.startTime, currenttime)}</p>
                        <div className="day-detail">
                        {/*<p><img src={`${process.env.PUBLIC_URL}/images/temperature.png`} alt='icon'/>{Math.round(settings.temp ==='celcius' ? `${day.values.temperatureMax}`: `${toFahrenheit(day.values.temperatureMax)}`)}
                        /{Math.round(settings.temp ==='celcius' ? `${day.values.temperatureMin}`:`${toFahrenheit(day.values.temperatureMin)}`)}°</p>*/}
                        <p><img src={`${process.env.PUBLIC_URL}/images/temperature.png`} alt='icon'/>
                       {temperatureUnit(day.values.temperatureMax)}/{temperatureUnit(day.values.temperatureMin)}</p>
                        <p id="day-condition">{truncateTextSentense(getcodeDetails[day.values.weatherCode].text)}</p>
                        </div>
                        </div>
                        <div className="day-end"><img src={getcodeDetails[day.values.weatherCode].iconday} alt='icon' id="day-icon"/>
                        <p id='rainChance'><img src={`${process.env.PUBLIC_URL}/images/drop.png`} alt='icon'/>{day.values.precipitationProbability}%</p>
                        </div>
                    </div>
                ))}
            </div>
            </div>
            <div className="daily-scroll"><button onClick={()=>scrolldaily('left')}>{'<'}</button><p>scroll or swipe</p><button onClick={()=>scrolldaily('right')}>{'>'}</button></div>
        </div>
        <div className="hourly-container">
            <h4><img src={`${process.env.PUBLIC_URL}/images/hourly.png`} alt="hr"/> today hourly</h4>
        <div className="hourly-chart">
            <h5>temperature range {settings.temp === 'celcius' ? '℃' : '℉'}</h5>
        <div className="chart-container">
            <div className="thee-chart">
        <ResponsiveContainer width={'100%'} height={chartheight.x} style={{overflow: 'visible'}} {...{overflow: 'visible'}}>
            <LineChart data={hourychartdata} margin={{left: 13, top: 50, right: 13, bottom: 10}} {...{overflow: 'visible'}}>
            <XAxis dataKey={'time'} stroke="#ffffffb3"/>
            <YAxis axisLine={false} hide={true} stroke="#ffffffb3" tickLine={false} />
            <Tooltip/>
            <CartesianGrid strokeDasharray={'3 3'} vertical={true} horizontal={false} stroke="#ffffff66" strokeWidth={0.5}/>
            <Line type={'monotone'} dataKey={'temp'} data={hourychartdata} dot={<CustomDot/>} fill='url(#tempGradient)' stroke="#4ce0af"/>
            </LineChart>
        </ResponsiveContainer>
        </div>
      </div>
      <div className="chart-scroll"><button onClick={()=>scrollchart('left')}>{'<'}</button><p>scroll or swipe</p><button onClick={()=>scrollchart('right')}>{'>'}</button></div>
      </div>
        </div>
    
        <div className="prep-container">
        <h4><img src={`${process.env.PUBLIC_URL}/images/prep.png`} alt="ico"/> precipitation forecast</h4>
        <div className="prep-forecast-list">
        {prepresult.map((hour, index) =>(
            <p key={index} >{hour}</p>
        ))}
        </div>
        </div>

        <div className="astro-container">
            <h4><img src={`${process.env.PUBLIC_URL}/images/astro.png`} alt="ico"/> astro track | <span>{astrodet.isday ? 'day-time': 'night-time'}</span></h4>
            <div className="astro-time">
            <p id='sunrise'><span>{astrodet.isday ? 'sunrise': 'sunset'}</span> <br/>{astrodet.first}</p>
            <div className="astro-position">
                {/*<div className="astro-track"></div>
                <img src={`${process.env.PUBLIC_URL}/images/icons/sun.png`} alt="ico" style={{left: `${astrodet.pos}%`}} id="astro-item"/>*/}
               <svg width={'100%'} height={'100%'} viewBox="0 0 400 100" preserveAspectRatio="none">
                <defs>
                    {astrodet.isday ? <linearGradient id="astro-gradient" x1={'0%'} x2={'0%'} y1={'0%'} y2={'100%'}>
                        <stop offset={'0%'} stopColor="#ffffff" stopOpacity={0.3}/>
                        <stop offset={'50%'} stopColor="#ffffff" stopOpacity={0.1}/>
                        <stop offset={'70%'} stopColor="#ffffff" stopOpacity={0}/>
                    </linearGradient> : <linearGradient id="astro-gradient" x1={'0%'} x2={'0%'} y1={'0%'} y2={'100%'}>
                        <stop offset={'0%'} stopColor="#191970" stopOpacity={0.3}/>
                        <stop offset={'50%'} stopColor="#191970" stopOpacity={0.1}/>
                        <stop offset={'70%'} stopColor="#191970" stopOpacity={0}/>
                    </linearGradient>}
                </defs>
               <path ref={curveRef} d='M20 80 Q 200 -60, 380 80' fill="url(#astro-gradient)" />
               <image href={`/images/${astrodet.isday ? 'sun': 'moon'}.png`} width={20} height={20}  x={astrodet.pos.x -10} y={astrodet.pos.y -10}/>
            </svg>
            </div>
            <p id='sunset'><span>{astrodet.isday ? 'sunset': 'sunrise'}</span> <br/>{astrodet.last}</p>
            </div>
        </div>
   {dailyExtend && <div className="day-extended">
        <button onClick={()=>setdailyExtend(false)}>X</button>
        <p><span>{formatday(dailyExtend.startTime, currenttime)}</span> - {truncateTextSentense(getcodeDetails[dailyExtend.values.weatherCode].text)}</p>
        <p><img src={`${process.env.PUBLIC_URL}/images/temperature.png`} alt="ico"/> 
        temperature range {temperatureUnit(dailyExtend.values.temperatureMax)}/{temperatureUnit(dailyExtend.values.temperatureMin)}</p>
        <p>precipiation  chance <span>{dailyExtend.values.precipitationProbability}%
            {dailyExtend.values.precipitationProbability > 0 ? `(${getprecipDetails(dailyExtend.values.precipitationType)})`: ''} </span></p>
        <div>
            <p><img src={`${process.env.PUBLIC_URL}/images/visibility.png`} alt="ico"/> 
            visibility-{distanceUnit(dailyExtend.values.visibility)} <span>{formatvisibility(dailyExtend.values.visibility)}</span></p>
           <p><img src={`${process.env.PUBLIC_URL}/images/wind.png`} alt="ico"/>  
           wind- {speedUnit(dailyExtend.values.windSpeed)} <span>{formatwind(dailyExtend.values.windSpeed)}</span></p>
           <p style={{color: `${uvHealth(dailyExtend.values.uvIndex)}`}}><img src={`${process.env.PUBLIC_URL}/images/uv.png`} alt="ico"/> uv - {dailyExtend.values.uvIndex}</p>
        </div>
        <p><img src={`${process.env.PUBLIC_URL}/images/astro.png`} alt="ico"/> sunrise- <span>{formatSunriseSet(dailyExtend.values.sunriseTime, currenttime)}</span>
        sunset- <span>{formatSunriseSet(dailyExtend.values.sunsetTime, currenttime)}</span></p>
    </div>}
</div>
    )
}
