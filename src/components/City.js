import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Search from "./Search";
import WeatherDetails from "./Weather";
import { Footer } from './Tools'
import './Main.css'

export default function City(){
  const {city} = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [resStatus, setresStatus] = useState(null);
  const apikey = process.env.REACT_APP_API_KEY

  useEffect(()=>{
    const fetchWeatherData = async (city) => {
        setWeatherData(null)
        setLoading(true);
        setresStatus("Fetching location data");
    
        try {
          const { data } = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${encodeURIComponent(city)}&days=7`);
          setWeatherData(data);
          setLoading(false);
          setresStatus(null);
        } catch (error) {
          setresStatus("Error fetching data, try refreshing the page!!");
          setLoading(false);
        }
      };
    fetchWeatherData(city)
  },[])

  return(
    <div className="cityCont">
        <Search />
        {resStatus && <div className='responseCont'>
            <p id='responseStatus'>{resStatus}</p>
            {loading &&<div className='loadingCont'>
                <div className='dot-1'></div>
                <div className='dot-2'></div>
                <div className='dot-3'></div>
            </div>}</div>}
        {weatherData && <WeatherDetails weatherData={weatherData} />}
        <Footer/>
    </div>
  )
}