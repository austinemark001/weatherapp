const getcodeDetails = {

    1000: {text: 'clear', iconday: `${process.env.PUBLIC_URL}/images/icons/1000_day.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/1000_night.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/clearday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/clearnight.jpg`
     },
    1100: {text: 'mostly clear', iconday: `${process.env.PUBLIC_URL}/images/icons/1100_day.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/1100_night.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/clearday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/clearnight.jpg`
    },
    1101: {text: 'partly cloudy',iconday: `${process.env.PUBLIC_URL}/images/icons/1101_day.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/1101_night.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/cloudyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/cloudynight.jpg`
   },
   1102: {text: 'mostly cloudy', iconday: `${process.env.PUBLIC_URL}/images/icons/1102_day.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/1102_night.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/cloudyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/cloudynight.jpg`
    },
    1001: {text: 'cloudy', iconday: `${process.env.PUBLIC_URL}/images/icons/1001.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/1001.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/cloudyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/cloudynight.jpg`
    },
    2000: {text: 'fog', iconday: `${process.env.PUBLIC_URL}/images/icons/2000.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/2000.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/fogyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/fogynight.jpg`
    },
    2100: {text:'mist', iconday: `${process.env.PUBLIC_URL}/images/icons/2100.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/2100.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/fogyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/fogynight.jpg`
    },
    4000: {text: 'drizzle', iconday: `${process.env.PUBLIC_URL}/images/icons/4000.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/4000.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/rainyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/rainynight.jpg`
    },
    4001: {text: 'rain', iconday: `${process.env.PUBLIC_URL}/images/icons/4001.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/4001.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/rainyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/rainynight.jpg`
    },
    4200: {text: 'light rain', iconday: `${process.env.PUBLIC_URL}/images/icons/4200.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/4200.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/rainyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/rainynight.jpg`
    },
    4201: {text: 'heavy rain', iconday: `${process.env.PUBLIC_URL}/images/icons/4201.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/4201.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/rainyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/rainynight.jpg`
    },
    5000: {text: 'snow', iconday: `${process.env.PUBLIC_URL}/images/icons/5000.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/5000.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/snowyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/snowynight.jpg`
    },
    5001: {text: 'flurries', iconday: `${process.env.PUBLIC_URL}/images/icons/5001.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/5001.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/snowyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/snowynight.jpg`
    },
    5100: {text: 'light snow', iconday: `${process.env.PUBLIC_URL}/images/icons/5100.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/5100.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/snowyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/snowynight.jpg`
    },
    5101: {text: 'heavy snow', iconday: `${process.env.PUBLIC_URL}/images/icons/5101.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/5101.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/snowyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/snowynight.jpg`
    },
    6000: {text: 'freezing drizzle', iconday: `${process.env.PUBLIC_URL}/images/icons/6000.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/6000.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/rainyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/rainynight.jpg`
    },
    6001: {text: 'freezing rain', iconday: `${process.env.PUBLIC_URL}/images/icons/6001.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/6001.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/icons/rainyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/icons/rainynight.jpg`
    },
    6200: {text: 'light freezing rain', textnight: 'clear', iconday: `${process.env.PUBLIC_URL}/images/icons/6200.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/6200.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/rainyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/rainynight.jpg`
    },
    6201: {text: 'heavy freezing rain', iconday: `${process.env.PUBLIC_URL}/images/icons/6201.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/6201.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/rainyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/rainynight.jpg`
    },
    7000: {text: 'ice pellets', iconday: `${process.env.PUBLIC_URL}/images/icons/7000.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/7000.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/snowyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/snowynight.jpg`
    },
    7101: {text: 'heavy ice pellets', iconday: `${process.env.PUBLIC_URL}/images/icons/7101.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/7101.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/snowyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/snowynight.jpg`
    },
    7102: {text: 'light ice pellets', iconday: `${process.env.PUBLIC_URL}/images/icons/7102.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/7102.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/snowyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/snowynight.jpg`
    },
    8000: {text: 'thunderstorm', iconday: `${process.env.PUBLIC_URL}/images/icons/8000.png`,
        iconnight: `${process.env.PUBLIC_URL}/images/icons/8000.png`,
        backgroundday: `${process.env.PUBLIC_URL}/images/backgrounds/rainyday.jpg`, backgroundnight: `${process.env.PUBLIC_URL}/images/backgrounds/rainynight.jpg`
    }
}

const getprecipDetails = (precip)=>{
    let text;
    switch(precip){
        case 1:
            text = 'rain'
            break;
        case 2:
            text = 'snow'
         break;
        case 3:
            text = 'cold rain'
            break;
        case 4:
            text =  'sleet'
            break;
        default:
            text = 'rain'
    }
    return text;
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


//weather conditions comment
const uvHealth = (index) =>{
    if(index <= 2) return '#00ff37';
    if(index <= 5) return '#ffe75c';
    if(index <= 7) return '#ffab5c';
    if(index <= 10)return '#ff905c';
        return '#ff675c'
}
const formatwind = (wind)=>{
    if(wind < 1) return 'calm';
    if(wind < 10) return 'breeze';
    if(wind < 20) return 'windy';
    if(wind < 33) return 'stormy';
    if(wind >= 33) return 'hurricane';
}
const formatvisibility = (vis)=>{
    if(vis >= 10) return 'excellent';
    if(vis >= 5) return 'good';
    if(vis >= 1) return 'moderate';
    if(vis >= 0.5) return 'poor';
    return 'very poor'
}


const truncateTextSentense = (sent)=>{
    if(sent.length > 10){
        return sent.slice(0, 10) + '...';
    }
    return sent
}



export {getcodeDetails, getprecipDetails, getmoonDetails, truncateSentense, getfirstpart, uvHealth, formatvisibility,
    formatwind, truncateTextSentense }



/*function formathumidity(hum){
    if(hum < 30) return '#00ff37';
    if(hum < 60) return '#d0ff00';
    if(hum < 80) return '#ff5100';
    return '#ff0000'
    
}

const formatwinddirection = (deg)=>{
    if(deg >= 337 || deg < 22.5) return 'north';
    if(deg >= 22.5 && deg < 67.5) return 'norteast';
    if(deg >= 67.5 && deg < 112.5) return 'east';
    if(deg >= 112.5 && deg < 157.5) return 'Southeast';
    if(deg >= 157.5 && deg < 202.5) return 'south';
    if(deg >= 202.5 && deg < 247.5) return 'southwest';
    if(deg >=  247.5 && deg < 292.5) return 'west';
    if(deg >= 292.5 && deg < 337.5) return 'northwest';
}

const formatprep = (prep)=>{
    if(prep === 0) return 'no precip';
    if(prep <= 5) return 'light precip';
    if(prep <= 10) return 'moderate precip';
    return 'high precip'
}



const formatPressure = (pre)=>{
    if(pre < 1000) return 'low';
    if(pre < 1015) return 'moderate';
    if(pre < 1000) return 'high';
    return 'very high'
}
const formatTime = (epoch) => {
    const date = new Date(epoch);
    return date.toLocaleString('en-US', {hour: "numeric", minute: "numeric", hour12: 'short'})
    
  };

const formatDate = (timestamp, localtime) => {
    if(timestamp && localtime){
    const date = new Date(timestamp.slice(0, -6));
    const today = new Date(localtime.slice(0, -6));
    
    // Check if the date is today
    if (date.toDateString() === today.toDateString() ) return "today";
    if (date.toDateString() === today.toDateString(today.setDate(today.getDate() +1))) return "tomorrow";
    if (date.toDateString() === today.toDateString(today.setDate(today.getDate() -1))) return "yesterday";
    
    return date.toLocaleString('en-US', {weekday: "short"}).toLocaleLowerCase();
  };
  return 'uknown'
}

const formatTimeEpoch = (epoch, localtime) => {
    if(epoch && localtime){
    const date = new Date(epoch.slice(0, -6));
    const date1 = localtime.slice(0, -6);
    const hours = date.getHours();
    if(hours === new Date(date1).getHours()){
        return 'now'
    }
    return date.toLocaleString('en-US', {hour: "numeric", hour12: 'short'}).toLocaleLowerCase();
  }return '12am'
}

const convertlocaltime = (localtime)=>{
    if(localtime){
    const date = localtime.slice(0, -6)
   
    const newdate = new Date(date)
    const options = {
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
    return newdate.toLocaleString('en-US', options).toLowerCase()
    }return 'unknown'
  }

const adjustTimewithTimezone = (datewithZ, dateWithOffset)=>{
    if(datewithZ, dateWithOffset){
    const timezoneOffset = dateWithOffset.slice(-6);
    const zremoved = datewithZ.slice(0, -1);
    const date = new Date(zremoved)
    date.setHours(date.getHours()+ parseInt(timezoneOffset.slice(0, 3)))
    date.setMinutes(date.getMinutes() + parseInt(`${timezoneOffset.slice(0, 1)}${timezoneOffset.slice(-2)}`))
    return date.toISOString();
    }else{
        return '2024-12-31T00:00:00Z'
    }
}
*/
