

//weather code details
    const codeDetails = {
        'clear': {
            codes: [0], icon: 'clear.png', iconnight: 'clear-night.png',
            background: 'clear.jpg', backgroundnight: 'clear-night.jpg'
        },
        'mostly clear': {
            codes: [1], icon: 'clear.png', iconnight: 'clear-night.png',
            background: 'clear.jpg', backgroundnight: 'clear-night.jpg'
        },
        'partly cloudy': {
            codes: [2], icon: 'p-cloudy.png', iconnight: 'p-cloudy-night.png',
            background: 'p-cloudy.jpg', backgroundnight: 'p-cloudy-night.jpg'
        },
        'cloudy': {
            codes: [3], icon: 'cloudy.png', iconnight: 'cloudy.png',
            background: 'cloudy.jpg', backgroundnight: 'cloudy-night.jpg'
        },
        'fog': {
            codes: [45, 48], icon: 'fog.png', iconnight: 'fog.png',
            background: 'fog.jpg', backgroundnight: 'fog-night.jpg'
        },
        'drizzle': {
            codes: [51, 53, 55, 56, 57], icon: 'drizzle.png', iconnight: 'drizzle.png',
            background: 'rain.jpg', backgroundnight: 'rain-night.jpg'
        },
        'rain': {
            codes: [61, 63, 65, 66, 67], icon: 'rain.png', iconnight: 'rain.png',
            background: 'rain.jpg', backgroundnight: 'rain-night.jpg'
        },
        
        'snow': {
            codes: [71, 73, 75, 77], icon: 'snow.png', iconnight: 'snow.png',
            background: 'snow.jpg', backgroundnight: 'snow-night.jpg'
        }
        ,'rain showers': {
            codes: [80, 81, 82], icon: 'rain.png', iconnight: 'rain.png',
            background: 'rain.jpg', backgroundnight: 'rain-night.jpg'
        },'snow showers': {
            codes: [85, 86], icon: 'snow.png', iconnight: 'snow.png',
            background: 'snow.jpg', backgroundnight: 'snow-night.jpg'
        },
        'thunderstorm': {
            codes: [95, 96, 99], icon: 'thunderstorm.png', iconnight: 'thunderstorm.png',
            background: 'thunderstorm.jpg', backgroundnight: 'thunderstorm-night.jpg'
        },
    
    }

const getcodecondition =(code)=>{
    for (let condition in codeDetails) {
        if(codeDetails[condition].codes.includes(code)){
            return condition
        }
    }
    return 'uknown'
}
const getcodebackground =(code, isday)=>{
    for (let condition in codeDetails) {
        if(codeDetails[condition].codes.includes(code)){
            return `${process.env.PUBLIC_URL}/images/backgrounds/${isday ? codeDetails[condition].background : codeDetails[condition].backgroundnight}`
        }
    }
    return `${process.env.PUBLIC_URL}/images/backgrounds/clearnight.jpg`
}
const getcodeIcon =(code, isday)=>{
    for (let condition in codeDetails) {
        if(codeDetails[condition].codes.includes(code)){
            return `${process.env.PUBLIC_URL}/images/icons/${isday ? codeDetails[condition].iconday : codeDetails[condition].iconnight}`
        }
    }
    return `${process.env.PUBLIC_URL}/images/icons/mclearnight.png`
}
const getcodeIconChart =(code)=>{
    for (let condition in codeDetails) {
        if(codeDetails[condition].codes.includes(code)){
            return `images/icons/${codeDetails[condition].icon}`
        }
    }
    return 'images/icons/mclearnight.png'
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
    if(wind < 3) return 'calm';
    if(wind < 30) return 'breeze';
    if(wind < 20) return 'windy';
    if(wind < 70) return 'stormy';
    if(wind >= 118) return 'hurricane';
}
const formatvisibility = (vis)=>{
    if(vis >= 10) return 'excellent';
    if(vis >= 5) return 'good';
    if(vis >= 1) return 'moderate';
    if(vis >= 0.5) return 'poor';
    return 'very poor'
}

const formatwinddirection = (deg)=>{
    if(deg >= 337 || deg < 22.5) return 'north';
    if(deg >= 22.5 && deg < 67.5) return 'northeast';
    if(deg >= 67.5 && deg < 112.5) return 'east';
    if(deg >= 112.5 && deg < 157.5) return 'Southeast';
    if(deg >= 157.5 && deg < 202.5) return 'south';
    if(deg >= 202.5 && deg < 247.5) return 'southwest';
    if(deg >=  247.5 && deg < 292.5) return 'west';
    if(deg >= 292.5 && deg < 337.5) return 'northwest';
}


const truncateTextSentense = (sent)=>{
    if(sent.length > 10){
        return sent.slice(0, 10) + '...';
    }
    return sent
}



export {getcodecondition, getcodebackground, getcodeIcon, getcodeIconChart, getprecipDetails, getmoonDetails, truncateSentense, getfirstpart, uvHealth, formatvisibility,
    formatwind, formatwinddirection, truncateTextSentense }



