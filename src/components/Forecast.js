import React, { useEffect, useState } from "react";
import { getcodeDetails, getprecipDetails, toFahrenheit, convertlocaltime, formatTimeEpoch, truncateTextSentense, formatDate} from "../weatherConfig";
import { XAxis, YAxis, ResponsiveContainer, Tooltip, Line, LineChart, CartesianGrid} from 'recharts';
import { format, parseISO, addHours, isSameDay } from 'date-fns';
import './Forecast.css';


export default function Forecast({dailyforecast, hourlyforecast, currenttime , settings}){
    const [hourychartdata, sethourlychartdata] = useState([]);
    const [chartheight, setchartheight] = useState({x: 300, y: 40, w: 20});
    const [prepresult, setprepresult] = useState([]);

    
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
            const current = parseISO(interval.startTime);
            const next = newArray[index + 1] ? parseISO(newArray[index + 1].startTime): null
            if(precipitationProbability > 0){
                block.push(interval);
                if(!next || addHours(current, 1).getTime() !== next.getTime()){
                    const first = block[0];
                    const startTime = parseISO(first.startTime)
                    const duration = block.length;
                    const percentage = first.values.precipitationProbability
                    const precipitationType = getprecipDetails(first.values.precipitationType)
                    const description = duration > 1 ?
                    `${duration}hrs ${precipitationType} outlook from ${format(startTime, 'h a')} (${percentage}% chance)
                     ${isSameDay(startTime, parseISO(currenttime))? 'today': 'tomorrow'}`:
                    `${percentage}%  ${precipitationType} chance at ${format(startTime, 'h a')} 
                    ${isSameDay(startTime, parseISO(currenttime))? 'today': 'tomorrow'}`

                    result.push(description);
                    block = []
                }
            }
        })
        setprepresult(result)
       
    }, [hourlyforecast])

    useEffect(()=>{
        let myarray = [];
        hourlyforecast.forEach(dt=>{
            const time = formatTimeEpoch(dt.startTime, currenttime);
            const temp =  Math.round(settings.temp === 'celcius' ? dt.values.temperature: toFahrenheit(dt.values.temperature));
            const icon = dt.values.weatherCode;
            myarray.push({time: time, temp: temp, icon: icon})
        })
        sethourlychartdata(myarray)
    }, [hourlyforecast, settings.temp])


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

    return(
        <>
        <div className='hourlyDetails'>
        <h4> <img src={`${process.env.PUBLIC_URL}/images/time.png`} alt="hr"/> today hourly | <span>{convertlocaltime(currenttime)}</span></h4>
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
          <Line type={'monotone'} dataKey={'temp'} data={hourychartdata} dot={<CustomDot/>} fill='url(#tempGradient)' stroke="#ff7300"/>
        </LineChart>
      </ResponsiveContainer>
      </div>
      </div>
      <div className="chart-scroll"><button onClick={()=>scrollchart('left')}>{'<'}</button><p>scroll or swipe</p><button onClick={()=>scrollchart('right')}>{'>'}</button></div>
      </div>
        <div className="hourlyprep">
            <h5><img src={`${process.env.PUBLIC_URL}/images/umbrella.png`} alt="ico"/> precipitation forecast</h5>
            <div>
            {prepresult.map((hour, index) =>(
                <p key={index}>{hour}</p>
            ))}
            </div>
        </div>
    </div>
        <div className='dailyDetails'>
            <h4> <img src={`${process.env.PUBLIC_URL}/images/time.png`} alt="dy"/> next 5 days</h4>
            <ul className='dailyList'>
                {dailyforecast.map(day=>(
                    <li key={day.startTime} className='dayDetails'>
                        <div className="day-start">
                        <p id='day-main'>{formatDate(day.startTime, currenttime)}</p>
                        <div className="day-detail">
                        <p><img src={`${process.env.PUBLIC_URL}/images/temperature.png`} alt='icon'/>{Math.round(settings.temp ==='celcius' ? `${day.values.temperatureMax}`: `${toFahrenheit(day.values.temperatureMax)}`)}
                        /{Math.round(settings.temp ==='celcius' ? `${day.values.temperatureMin}`:`${toFahrenheit(day.values.temperatureMin)}`)}°</p>
                        <p id="day-condition">{truncateTextSentense(getcodeDetails[day.values.weatherCode].text)}</p>
                        </div>
                        </div>
                        <div className="day-end"><img src={getcodeDetails[day.values.weatherCode].iconday} alt='icon' id="day-icon"/>
                        <p id='rainChance'><img src={`${process.env.PUBLIC_URL}/images/drop.png`} alt='icon'/>{day.values.precipitationProbability}%</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        </>
    )
}

//dot={{r: 2, fill: '#ff7300', stroke: '#ff7300'}}
/*<ResponsiveContainer width={'100%'} height={chartheight.x} style={{overflow: 'visible'}} {...{overflow: 'visible'}}>
        <AreaChart data={hourychartdata} margin={{left: 10, top: 50, right: 10, bottom: 0}} {...{overflow: 'visible'}}>
          <defs>
          <linearGradient id="tempGradient" x1='0' y1='0' x2={'0'} y2={'1'}>
            <stop offset={'0'} stopColor="#ffffffb3" stopOpacity={0.4}/>
            <stop offset={'50%'} stopColor="#ffffff33" stopOpacity={0.1}/>
        </linearGradient>
          </defs>
          <XAxis dataKey={'time'} stroke="#ffffffb3"/>
          <YAxis axisLine={false} hide={true} stroke="#ffffffb3" tickLine={false} />
          <Tooltip/>
          <CartesianGrid strokeDasharray={'3 3'} vertical={true} horizontal={false} stroke="#ffffff66" strokeWidth={0.5}/>
          <Area type={'monotone'} dataKey={'temp'} data={hourychartdata} stroke="#ff7300" fill="url(#tempGradient)" dot={<CustomDot/>} />
          <Line type={'monotone'} dataKey={'icon'} dot={<CustomIcon/>}/>
        </AreaChart>
      </ResponsiveContainer>*/

