import './Main.css'
import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios';
import Search from './Search';
import WeatherDetails from './Weather';
import { Footer } from './Tools'


export default function Home(){
    /*API KEY()*/
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [resStatus, setresStatus] = useState(null);
    const apikey = process.env.REACT_APP_API_KEY

    useEffect(() => {
    const getLocation = () => {
        setWeatherData(null)
        setresStatus("setting up your coordinates")
        setLoading(true)
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
        setresStatus("Geolocation is not supported by this browser.");
        }
    };

    const showPosition = async (position) => {
        setLoading(true)
        setresStatus("Fetching your location data")
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        try {
        const { data } = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${latitude},${longitude}&days=7`);
        setWeatherData(data);
        setLoading(false);
        setresStatus(null)
        } catch (error) {
        setresStatus("Error fetching data try refreshing page!!")
        setLoading(false);
        }
    };

    const showError = (error) => {
        setresStatus("Error getting user location: " + error.message);
        setLoading(false);
    };

    getLocation();

    }, []); // Empty dependency array ensures useEffect runs only once on mount
      // handle location search
    
    return(
        <div className="homeContainer">
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

