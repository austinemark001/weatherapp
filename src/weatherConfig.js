const getcodeDetails = {

    1000: {text: 'clear', iconday: `${process.env.PUBLIC_URL}/images/icons/1000_day.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/1000_night.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/clearday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/clearnight.jpg`
     },
    1100: {text: 'mostly clear', iconday: `${process.env.PUBLIC_URL}/images/icons/1100_day.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/1100_night.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/mostlyclearday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/mostlyclearnight.jpg`
    },
    1101: {text: 'partly cloudy',iconday: `${process.env.PUBLIC_URL}/images/icons/1101_day.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/1101_night.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/partlycloudyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/partlycloudynight.jpg`
   },
   1102: {text: 'mostly cloudy', iconday: `${process.env.PUBLIC_URL}/images/icons/1102_day.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/1102_night.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/mostlycloudyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/mostlycloudynight.jpg`
    },
    1001: {text: 'cloudy', iconday: `${process.env.PUBLIC_URL}/images/icons/1001.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/1001.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/overcastday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/overcastnight.jpg`
    },
    2000: {text: 'fog', iconday: `${process.env.PUBLIC_URL}/images/icons/2000.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/2000.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/fogday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/fognight.jpg`
    },
    2100: {text:'mist', iconday: `${process.env.PUBLIC_URL}/images/icons/2100.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/2100.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/fogday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/fognight.jpg`
    },
    4000: {text: 'drizzle', iconday: `${process.env.PUBLIC_URL}/images/icons/4000.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/4000.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/lightrainday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/lightrainnight.jpg`
    },
    4001: {text: 'rain', iconday: `${process.env.PUBLIC_URL}/images/icons/4001.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/4001.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/rainday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/rainnight.jpg`
    },
    4200: {text: 'light rain', iconday: `${process.env.PUBLIC_URL}/images/icons/4200.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/4200.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/lightrainday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/lightrainnight.jpg`
    },
    4201: {text: 'heavy rain', iconday: `${process.env.PUBLIC_URL}/images/icons/4201.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/4201.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/rainday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/rainnight.jpg`
    },
    5000: {text: 'snow', iconday: `${process.env.PUBLIC_URL}/images/icons/5000.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/5000.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/snowday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/snownight.jpg`
    },
    5001: {text: 'flurries', iconday: `${process.env.PUBLIC_URL}/images/icons/5001.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/5001.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/snowday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/snownight.jpg`
    },
    5100: {text: 'light snow', iconday: `${process.env.PUBLIC_URL}/images/icons/5100.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/5100.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/snowday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/snownight.jpg`
    },
    5101: {text: 'heavy snow', iconday: `${process.env.PUBLIC_URL}/images/icons/5101.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/5101.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/snowday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/snownight.jpg`
    },
    6000: {text: 'freezing drizzle', iconday: `${process.env.PUBLIC_URL}/images/icons/6000.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/6000.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/lightrainday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/lightrainnight.jpg`
    },
    6001: {text: 'freezing rain', iconday: `${process.env.PUBLIC_URL}/images/icons/6001.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/6001.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/rainday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/rainnight.jpg`
    },
    6200: {text: 'light freezing rain', textnight: 'clear', iconday: `${process.env.PUBLIC_URL}/images/icons/6200.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/6200.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/lightrainday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/lightrainnight.jpg`
    },
    6201: {text: 'heavy freezing rain', iconday: `${process.env.PUBLIC_URL}/images/icons/6201.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/6201.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/rainday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/rainnight.jpg`
    },
    7000: {text: 'ice pellets', iconday: `${process.env.PUBLIC_URL}/images/icons/7000.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/7000.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/snowday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/snownight.jpg`
    },
    7101: {text: 'heavy ice pellets', iconday: `${process.env.PUBLIC_URL}/images/icons/7101.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/7101.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/snowday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/snownight.jpg`
    },
    7102: {text: 'light ice pellets', iconday: `${process.env.PUBLIC_URL}/images/icons/7102.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/7102.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/snowday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/snownight.jpg`
    },
    8000: {text: 'thunderstorm', iconday: `${process.env.PUBLIC_URL}/images/icons/8000.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/8000.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/thunderday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/thundernight.jpg`
    }
}

const getmoonDetails ={
    0:{
        text: 'new moon', image: `${process.env.PUBLIC_URL}/images/icons/newmoon.png`
    },
    1:{
        text: 'waxing cresent', image: `${process.env.PUBLIC_URL}/images/icons/waxingcresent.png`
    },
    2:{
        text: ' first quarter', image: `${process.env.PUBLIC_URL}/images/icons/waxingcresent.png`
    },
    3:{
        text: 'waxing gibbous', image: `${process.env.PUBLIC_URL}/images/icons/fullmoon.png`
    },
    4:{
        text: 'full moon', image: `${process.env.PUBLIC_URL}/images/icons/fullmoon.png`
    },
    5:{
        text: 'waning gibbous', image: `${process.env.PUBLIC_URL}/images/icons/fullmoon.png`
    },
    6:{
        text: 'last quarter', image: `${process.env.PUBLIC_URL}/images/icons/waningcresent.png`
    },
    7:{
        text: 'waning cresent', image: `${process.env.PUBLIC_URL}/images/icons/waningcresent.png`
    }
}


const truncateSentense = (sent)=>{
    if(sent.length > 13){
        return sent.slice(0, 13) + '...';
    }
    return sent
}

const getfirstpart = (str)=>{
    return str.split(' ')[0];
}



const uvHealth = (index) =>{
    if(index <=0.5) return 'very low'
    if(index <= 2) return 'low';
    if(index <= 5) return 'moderate';
    if(index <= 7) return 'high';
    if(index <= 10)return 'very high';
        return 'extreme'
}


function formathumidity(hum){
    if(hum < 30) return 'low';
    if(hum < 60) return 'moderate';
    if(hum < 80) return 'high ';
    return 'very high'
    
}

const formatwinddirection = (deg)=>{
    if(deg >= 337 || deg < 22.5) return 'N';
    if(deg >= 22.5 && deg < 67.5) return 'NE';
    if(deg >= 67.5 && deg < 112.5) return 'E';
    if(deg >= 112.5 && deg < 157.5) return 'SE';
    if(deg >= 157.5 && deg < 202.5) return 'S';
    if(deg >= 202.5 && deg < 247.5) return 'SW';
    if(deg >=  247.5 && deg < 292.5) return 'W';
    if(deg >= 292.5 && deg < 337.5) return 'NW';
}

const formatprep = (prep)=>{
    if(prep === 0) return 'no precip';
    if(prep <= 5) return 'light precip';
    if(prep <= 10) return 'moderate precip';
    return 'high precip'
}

const formatvisibility = (vis)=>{
    if(vis >= 10) return 'excellent';
    if(vis >= 5) return 'good';
    if(vis >= 1) return 'moderate';
    if(vis >= 0.5) return 'poor';
    return 'very poor'
}

const formatPressure = (pre)=>{
    if(pre < 1000) return 'low';
    if(pre < 1015) return 'moderate';
    if(pre < 1000) return 'high';
    return 'very high'
}
const formatwind = (wind)=>{
    if(wind < 1) return 'calm';
    if(wind < 10) return 'breeze';
    if(wind < 20) return 'windy';
    if(wind < 33) return 'stormy';
    if(wind >= 33) return 'hurricane force';
}

const formatTime = (epoch) => {
    const date = new Date(epoch);
    return date.toLocaleString('en-US', {hour: "numeric", minute: "numeric", hour12: 'short'})
    
  };

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    
    // Check if the date is today
    if (date.toDateString() === today.toDateString() ) return "today";
    if (date.toDateString() === today.toDateString(today.setDate(today.getDate() +1))) return "tomorrow";
    if (date.toDateString() === today.toDateString(today.setDate(today.getDate() -1))) return "yesterday";
    
    return date.toLocaleString('en-US', {weekday: "short"}).toLocaleLowerCase();
  };

const formatTimeEpoch = (epoch, localtime) => {
    const date = new Date(epoch);
    const hours = date.getHours();
    if(hours === new Date(localtime).getHours()){
        return 'now'
    }
    return date.toLocaleString('en-US', {hour: "numeric", hour12: 'short'}).toLocaleLowerCase()
  };

const truncateTextSentense = (sent)=>{
    if(sent.length > 9){
        return sent.slice(0, 9) + '...';
    }
    return sent
}
const convertlocaltime = (localtime)=>{

    const date = localtime.slice(0, -6)
   
    const newdate = new Date(date)
    const options = {
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
  
    return newdate.toLocaleString('en-US', options).toLowerCase()
  }



//unit conversion
const toFahrenheit = (temp)=>{
    return  Math.round(((temp * 9/5) + 32)*10)/10
}

const toKmPerHour = (spd)=>{
    return Math.round((spd * 3.6)* 100)/100
}
const toMiles = (dst)=>{
    return Math.round((dst *0.621371)* 100)/100
}


export {getcodeDetails, getmoonDetails, truncateSentense, getfirstpart, uvHealth, formathumidity, formatwinddirection, formatprep, formatvisibility,
    formatPressure, formatwind, formatTime, toFahrenheit, toKmPerHour, toMiles, formatDate, formatTimeEpoch, truncateTextSentense, convertlocaltime}
