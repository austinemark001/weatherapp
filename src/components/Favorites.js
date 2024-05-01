import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Search from "./Search";
import { Footer } from './Tools'
import './Main.css'

const WeatherCard = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [resStatus, setresStatus] = useState(null);

  const apikey = process.env.REACT_APP_API_KEY

  useEffect(() => {
    setLoading(true)
    setresStatus("fetching favorite data..")
    const fetchWeatherData = async () => {
      try {
        const {data}= await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${city}`);
        setWeatherData(data);
        setLoading(false)
        setresStatus(false)
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false)
        setresStatus("error fetching data try reloading page")
      }
    };

    fetchWeatherData();
  }, [city]);

  return (
    <>
     {resStatus && <div className='responseCont'>
            <p id='responseStatus'>{resStatus}</p>
            {loading &&<div className='loadingCont'>
                <div className='dot-1'></div>
                <div className='dot-2'></div>
                <div className='dot-3'></div>
            </div>}</div>}
      {weatherData && 
        <Link className="favorite" to={`/city/${city}`}>
          <h4 id="favoriteName">{weatherData.location.name}, {weatherData.location.country}</h4>
          <p id="favoriteTemp">{truncate(weatherData.current.temp_c)}<span>°C</span></p>
          <img src={weatherData.current.condition.icon} alt="icon" id="favoriteIcon"/>
          <p id="favoriteText">{weatherData.current.condition.text}</p> 
      </Link>}
  </>
  );
};

const FavoritesWeather = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("austineWeatherFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  return (
    <div className="favoritesCont">
      <Search />
      <ul className="favoritesList">
      {(favorites.length < 1) && <p id="noFavorites">No favorite city added </p>}
      {favorites.map((city) => (
        <WeatherCard key={city} city={city} />
      ))}</ul>
     <Footer/>
    </div>
  );
};


const truncate =(inputnumber)=>{
  return Math.floor(inputnumber)
}
export default FavoritesWeather;
