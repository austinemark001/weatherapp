import React from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Search.css'

export default function Search(){
    const [cityName, setCityName] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCityName(e.target.value);
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        navigate(`/city/${cityName}`)
      };
    return(
        <form className='searchform' onSubmit={handleSubmit}>
        <input type='search' placeholder='enter city name' onChange={handleChange} value={cityName} required/>
        <input type='submit' value="search"/>
    </form>
    )
}
