import React, { useEffect, useState, useRef} from "react";
import { getcodecondition, getcodeIconChart} from "../weatherConfig";
import { XAxis, YAxis, ResponsiveContainer, Tooltip, Line, LineChart } from 'recharts';
import { formatday, formatLocalDate, calculateAstro} from "../dateConfig";
import { temperatureUnit, temperatureUnitChart } from "../settingsConfig";
import './Forecast.css';


export default function Forecast({dailyforecast, currenttime, isDay, handleRefresh }){
    const [dailychartdata, setdaillychartdata] = useState([]);
    const [chartheight, setchartheight] = useState(230);
    const [astrotime, setastrotime] = useState({ first: 0, last: 0 })
    const [astroposition, setastroposition] = useState({x: 0,y: 0})
    const curveRef = useRef()
    
    useEffect(()=>{
        const calculateastro = ()=>{
        const astrodata = calculateAstro(dailyforecast.sunrise[0], dailyforecast.sunset[0], currenttime, isDay);

           if(curveRef.current){
             const pathLength = curveRef.current.getTotalLength();
             const point = curveRef.current.getPointAtLength((astrodata.progress /100) * pathLength)
             setastroposition({x: point.x, y: point.y})
           }
            setastrotime({first: astrodata.first, last: astrodata.last})
        }
        if(currenttime &&  dailyforecast.sunrise && dailyforecast.sunset){
            calculateastro();
        }
    },[currenttime, isDay, dailyforecast])
    
    useEffect(()=>{
        const handleSize = ()=>{
            if (window.innerWidth < 768) setchartheight(220);
            
            
        };
        window.addEventListener('resize', handleSize);
        handleSize();
        return ()=>{
            window.removeEventListener('resize', handleSize)
        
        }
    },[])


    // summaries
    const precipitationSummary = ()=>{
        const precipitationSum = dailyforecast.precipitation_sum;
        const dates = dailyforecast.time;
        const precipitationDays = precipitationSum.map((value, index)=> ({index: index, prep: value})).filter(day => day.prep > 0)
        if(precipitationDays.length > 3){
            return `wet days a head from ${formatday(dates[precipitationDays[0].index], currenttime)}`;
        }else if(precipitationDays.length > 0){
            const firstprepday = precipitationDays[0];
            const amount  = firstprepday.prep;
            const day = formatday(dates[firstprepday.index], currenttime)
            let chance ;
            if(amount < 0.3){
                chance = 'low chance'
            }else if(amount < 1){
                chance = 'possible'
            }else{
               chance = 'expected'
            }
            return `${chance} ${(day === 'Yesterday'|| day === 'Today' || day === 'Tomorrow') ? day : `on ${day}`}`
        }else{
            return 'dry days a head'
        }
    }

    const actvitySummary = ()=>{
        if(dailyforecast.precipitation_sum[0] === 0  && dailyforecast.temperature_2m_max[0] >=15 && dailyforecast.temperature_2m_max[0] <=25 && 
            dailyforecast.uv_index_max <= 7) {
            return 'hike or picnic'
        }
        if(dailyforecast.precipitation_sum[0] > 1){
            return 'best for indoor activites'
        }
        return 'no activity to recommend'
    }

    const cautionSummary = ()=>{
        if(dailyforecast.precipitation_sum[0] >= 10) return 'extreme precipitation';
        if(dailyforecast.uv_index_max[0] > 7) return 'high uv, limit outdoor';
        if(dailyforecast.temperature_2m_min[0] < -5) return 'extreme cold, stay warm';
        if(dailyforecast.temperature_2m_max[0] > 35) return 'extreme hot, stay hydrated';
        return 'good day'
    }



    useEffect(()=>{
        let myarray = [];
        dailyforecast.time.forEach((dt, index)=>{
            const details = `${formatday(dt, currenttime)} ${temperatureUnit(dailyforecast.temperature_2m_max[index])}/${temperatureUnit(dailyforecast.temperature_2m_min[index])}`;
            //const temp =  Math.round(settings.temp === 'celcius' ? dt.values.temperature: toFahrenheit(dt.values.temperature));
            const temp = temperatureUnitChart(dailyforecast.temperature_2m_max[index]);
            const icon = dailyforecast.weather_code[index];
            const prep = dailyforecast.precipitation_probability_max[index]
            myarray.push({day: details, temp: temp, icon: icon, prep: prep})
        })
        setdaillychartdata(myarray)
    }, [dailyforecast, currenttime])


    const CustomDot = (props)=>{
        const {cx, cy, payload} = props;
        //const cleanedValue = payload.temp.toString().replace(/^0+/, '');
        return(
            <g style={{backgroundColor: 'blue'}} fill="blue">
            <image x={cx-20} y={cy- 100} width={60} height={60} href={getcodeIconChart(payload.icon)}/>
            <circle cx={cx} cy={cy} r={3} fill="#ededed"/>
            <text x={cx} y={cy -10} textAnchor="middle" fill="#ededed" fontSize={'0.9em'}>{payload.temp}°</text>
            </g>
        )
    }
    const CustomXasis = ({x, y, payload})=>{
        //const cleanedValue = payload.temp.toString().replace(/^0+/, '');
        return(
            <g transform={`translate(${x}, ${y})`}>
            {dailychartdata.find(t => t.day === payload.value).prep > 0 &&<g>
            <image x={-15} y={-5} width={20} height={20} href="/images/drop.png"/>
            <text x={5} y={10} fill="#00b7ff">{dailychartdata.find(t => t.day === payload.value).prep}%</text>
            </g>}
            <text x={-15} y={60} dy={10} fill="#ededed" textAnchor="start">{payload.value}</text>
            <text x={-15} y={75} dy={10} fill="#0ac0b1" textAnchor="start" fontSize={'0.9em'}>{ getcodecondition(dailychartdata.find(t => t.day === payload.value).icon)}</text>
            </g>
        )
    }

    
    
    const scrollchart = (direction)=>{
       const chartcontainer = document.querySelector('.temp-chart-container');
       if(chartcontainer){
        const scrolldistance = window.innerWidth / 3
        const scrollamount = direction === 'right' ? scrolldistance: -scrolldistance;
        chartcontainer.scrollBy({left: scrollamount, behavior: 'smooth'})
       }
    }


    return(
        <div className='forecast-container'>
        <div className="forecast-title">
        <h3><img src={`${process.env.PUBLIC_URL}/images/forecast.png`} alt="f"/>Forecast next 7 days | <span>{formatLocalDate(currenttime)}</span></h3>
        <button onClick={handleRefresh}><img src={`${process.env.PUBLIC_URL}/images/reload.png`} alt="refresh"/></button>
        </div>

        <div className="summary-container">
          <h4> <img src={`${process.env.PUBLIC_URL}/images/summary.png`} alt="ico"/> summary</h4>
          <div className="summaries">
          <div className="precip-summary">
            <h5><img src={`${process.env.PUBLIC_URL}/images/umbrella.png`} alt="ico"/>precipitation</h5>
            <p>{precipitationSummary()}</p>
          </div>
          <div className="activity-summary">
            <h5> <img src={`${process.env.PUBLIC_URL}/images/activity.png`} alt="ico"/>activity</h5>
            <p>{actvitySummary()}</p>
          </div>
          <div className="caution-summary">
            <h5> <img src={`${process.env.PUBLIC_URL}/images/caution.png`} alt="ico"/>caution</h5>
            <p>{cautionSummary()}</p>
          </div>
          </div>
        </div>
        <div className="daily-forecast">
        <h4><img src={`${process.env.PUBLIC_URL}/images/day.png`} alt="ico"/>day by day</h4>
        <div className="temp-chart-container">
        <div className="thee-temp-chart">
        <ResponsiveContainer width={'100%'} height={chartheight}  {...{overflow: 'visible'}}>
            <LineChart data={dailychartdata} margin={{left: 20, top: 80, right: 90, bottom: 70}}  {...{overflow: 'visible'}}>
            <XAxis dataKey={'day'} stroke="#ffffffb3" strokeWidth={0.8} axisLine={false} interval={0} textAnchor="middle"
            tick={<CustomXasis/>} tickLine={false} />

            <YAxis axisLine={false} hide={true} stroke="#ffffffb3" tickLine={false} />
            <Tooltip content={null} cursor={false}/>
            {/*<CartesianGrid strokeDasharray={'3 3'} vertical={true} horizontal={false} stroke="#ffffff66" strokeWidth={0.5}/>*/}
            <Line type={'monotone'} dataKey={'temp'}  dot={<CustomDot/>}   stroke="#ededed" strokeWidth={3}
            activeDot={false}/>
            </LineChart>
        </ResponsiveContainer>
        </div>
        </div>
        <div className="scroll-chart">
            <button onClick={()=>scrollchart('left')}>{'<'}</button>
            <p>scroll or swipe</p>
            <button onClick={()=>scrollchart('right')}>{'>'}</button>
        </div>
        </div>

       <div className="astro-container">
            <h4><img src={`${process.env.PUBLIC_URL}/images/astro.png`} alt="ico"/> astro track | <span>{isDay ? 'day-time': 'night-time'}</span></h4>
            <div className="astro-time">
            <p id='sunrise'><span>{isDay ? 'sunrise': 'sunset'}</span> <br/>{astrotime.first}</p>
            <div className="astro-position">
               <svg width={'100%'} height={'100%'} viewBox="0 0 400 100" preserveAspectRatio="none">
                <defs>
                    {isDay ? <linearGradient id="astro-gradient" x1={'0%'} x2={'0%'} y1={'0%'} y2={'100%'}>
                        <stop offset={'0%'} stopColor="#ffffff" stopOpacity={0.3}/>
                        <stop offset={'50%'} stopColor="#ffffff" stopOpacity={0.1}/>
                        <stop offset={'70%'} stopColor="#ffffff" stopOpacity={0}/>
                    </linearGradient> : <linearGradient id="astro-gradient" x1={'0%'} x2={'0%'} y1={'0%'} y2={'100%'}>
                        <stop offset={'0%'} stopColor="#191970" stopOpacity={0.5}/>
                        <stop offset={'50%'} stopColor="#191970" stopOpacity={0.1}/>
                        <stop offset={'70%'} stopColor="#191970" stopOpacity={0}/>
                    </linearGradient>}
                </defs>
               <path ref={curveRef} d='M20 80 Q 200 -60, 380 80' fill="url(#astro-gradient)" />
               <image href={`/images/${isDay ? 'sun': 'star'}.png`} width={20} height={20}  x={astroposition.x -10} y={astroposition.y -10}/>
            </svg>
            </div>
            <p id='sunset'><span>{isDay ? 'sunset': 'sunrise'}</span> <br/>{astrotime.last}</p>
            </div>
        </div>
</div>
    )
}

