import { getSettings, saveSettings } from "./localstoragehelper";

const defaultsettings = {
    temperature: 'celcius',
    speed: 'km/h',
    distance: 'metres',
    autorefreshduration: 3,
    radiusthreshold: 10000 
};

const savedefaultSettings = ()=>{
    saveSettings(defaultsettings)
    return defaultsettings
}

let settings = getSettings() || savedefaultSettings;



export const updatesettingsdata  = (details)=>{
    saveSettings(details)
    settings = details
}




export const settingsunits = {
    temperature: {
        units: ['celcius', 'fahrenheit'],
    },
    speed: {
        units: ['km/h', 'm/s', 'mph', 'knots']
    },
    distance: {
        units: ['metres', 'kilometers', 'miles']
    },
    autorefreshduration: {
        units: [1, 2, 3, 6, 12, 24, 48]
    },
    radiusthreshold: {
        units: [1000, 2000, 5000, 10000, 20000, 40000, 80000]
    }
}

//units update
export const temperatureUnit = (temp)=>{
    if(settings.temperature ==='fahrenheit'){
        return  `${Math.round((temp * 9/5) + 32)}°`
    }
    return `${Math.round(temp)}°`;
}
export const temperatureUnitChart = (temp)=>{
    if(settings.temperature ==='fahrenheit'){
        return  Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp)
}
/*const temperatureUnitDecimal = (temp)=>{
    if(settings.temp ==='fahren'){
        return  `${Math.round(((temp * 9/5) + 32) * 10)/10}°`
    }
    return `${Math.round(temp)}°`;
}*/

export const speedUnit = (spd)=>{
    switch(settings.speed){
        case 'm/s': return `${Math.round(spd * 10 / 36)}m/s`;
        case 'mph': return `${Math.round(spd * 0.621371)}mph`;
        case 'knots': return `${Math.round(spd * 0.539957)}knots`;
        default : return `${Math.round(spd)}km/h`
    }

}
export const distanceUnit = (dst) =>{
    switch(settings.distance){
        case 'kilometers': return `${Math.round(dst / 1000)}km`;
        case 'miles' : return `${Math.round(dst * 1609.344)}mi`;
        default: return `${Math.round(dst)}m`
    }

}
export const getLastsettings = ()=>{
  return settings
}
export const getAutoAge = ()=>{
    return settings.autorefreshduration
}
export const getThreshold = ()=>{
    return settings.radiusthreshold
}

export const resetSettings = ()=>{
    saveSettings(defaultsettings)
    settings = defaultsettings
    return defaultsettings
}
