import React from "react";
import { Footer } from './Tools'
import './About.css'

export default function About(){
    return(
        <div className="aboutCont">
            <div className="aboutContent">
            <img src={`${process.env.PUBLIC_URL}/images/me.jpg`} alt='me'/>
            <h2>Austine Mark - web/app developer</h2>
            <p>This WeatherApp is a showcase of React expertise and API integration,
                 demonstrating my proficiency in modern web development.
                 With a sleek and responsive design, the app provides real-time weather
                  updates using external APIs <a href="https://weatherapi.com">weatherapi</a>, 
                 allowing users to stay informed about current conditions and forecasts worldwide. 
                 This WeatherApp reflects a commitment to user-centric design, 
                 offering an intuitive interface and seamless navigation.<br/> <br/> For more projects showcasing Austine Mark's skills, 
                visit <a href="https://austinemark.com">my website</a> and
                 experience the blend of functionality, aesthetics, and technical excellence firsthand.</p>
            </div>
            <Footer/>
        </div>
    )
}