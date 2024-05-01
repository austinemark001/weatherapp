import React from "react";
import { useState, useEffect } from "react";
import './Tools.css'
import { Link } from "react-router-dom";

function Header(){
    const [isMobile, setIsMobile] = useState(false);
    const[isMenuOPen, setMenuOpen] = useState(false)
    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth < 800);
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Call initially to set the state
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
      const openMenu = ()=>{
        setMenuOpen(true)
      }
      const closeMenu = ()=>{
        setMenuOpen(false)
      }
    return(
        <>
        <header className="myheader">
        <img src={`${process.env.PUBLIC_URL}/images/applogo.png`} alt='icon' id="logo"/>
            <h1>WEATHER APP</h1>
            {!isMobile && <ul className="menubar">
                <li><Link id="navlink" to="/"><img src={`${process.env.PUBLIC_URL}/images/home.png`} alt='icon'/><p>Home</p></Link></li>
                <li><Link id="navlink" to="/favorites"><img src={`${process.env.PUBLIC_URL}/images/favorite.png`} alt='icon'/><p>favorites</p></Link></li>
                <li><Link id="navlink" to="/about"><img src={`${process.env.PUBLIC_URL}/images/about.png`} alt='icon'/><p>about</p></Link></li>
            </ul>}
            {isMobile && <img src={`${process.env.PUBLIC_URL}/images/menu.png`} alt='icon' id="menubut" onClick={openMenu}/>}
            {isMenuOPen && <div className="dropdownCont">
            <button id="closeDropdown" onClick={closeMenu}>X</button>
            <ul className="dropdown">
                <li><Link id="droplink" to="/" onClick={closeMenu}><img src={`${process.env.PUBLIC_URL}/images/home.png`} alt='icon' /><p>Home</p></Link></li>
                <li><Link id="droplink" to="/favorites" onClick={closeMenu}><img src={`${process.env.PUBLIC_URL}/images/favorite.png`} alt='icon'/><p>favorites</p></Link></li>
                <li><Link id="droplink" to="/about" onClick={closeMenu}><img src={`${process.env.PUBLIC_URL}/images/about.png`} alt='icon'/><p>about</p></Link></li>
            </ul></div>}
        </header>
        </>
    )
}

function Footer(){
    return(
        <footer className="myfooter">
        <ul className="socialLinks">
            <li><a href='https://github.com/austinemark001'> <img src={`${process.env.PUBLIC_URL}/images/github.png`} alt='git'/> </a></li> 
            <li><a href='https://www.facebook.com/profile.php?id=100083372384528'> <img src={`${process.env.PUBLIC_URL}/images/facebook.png`} alt='fb'/> </a></li>
            <li><a href='https://wa.me/254111343665?text=Hello%20Austine'> <img src={`${process.env.PUBLIC_URL}/images/whatsapp.png`} alt='up'/> </a></li>
            <li><a href='https://www.youtube.com/@AustineMark001'> <img src={`${process.env.PUBLIC_URL}/images/youtube.png`} alt='yt'/></a></li>
            <li><a href='https://www.linkedin.com/in/austine-mark-abb7282aa'><img src={`${process.env.PUBLIC_URL}/images/linkedin.png`} alt='ln'/></a></li>
            </ul>
            <p id="creator">created by austine mark - <a href="https://austinemark.com">visit my website</a></p>
    </footer>
    )
}

export { Header, Footer};
