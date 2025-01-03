import { format, parseISO, isToday, isYesterday, isTomorrow, getTime, isSameHour, addHours, addMinutes, addDays, 
     getHours, getMinutes, isAfter, isBefore, differenceInMinutes, isSameDay} from "date-fns";

/*function removeOffset(inputdate){
   try{
        const newDate  = inputdate.slice(0, -6);
        return parseISO(newDate);
   }catch(err){
    console.error(err)
   return '2025-01-01T00:00:00'
   }
}*/

export function filterdate(inputdate){
    try{
        let newDate = inputdate;
        const regex = /([+-]\d{2}:\d{2}|Z)$/
        if(regex.test(inputdate)){
            newDate = inputdate.replace(regex, '')      
        }
        return parseISO(newDate)
    }catch(err){
     console.error(err)
     return '2025-01-01T00:00:00'
    }
 }

/*function removeZulu(inputdate){
    try{
        const newDate = inputdate.slice(0, -1)
        return parseISO(newDate);
    }catch(err){
    console.error(err)
    return '2025-01-01T00:00:00'
    }
}*/


//return the day
export function formatday(inputdate, currentdate){
    try{
        const filtered1 = filterdate(inputdate);
        const  filtered2 = filterdate(currentdate);
        
        if(isToday(filtered1, {comparisonDate: filtered2})){
            return 'Today';
        }else if(isYesterday(filtered1, {comparisonDate: filtered2})){
            return 'Yesterday';
        }else if(isTomorrow(filtered1, {comparisonDate: filtered2})){
            return 'Tomorrow';
        }else{
            return format(filtered1, 'EEEE')
        }
    
    }catch(err){
        console.error(err)
        return 'day'
    }
}

// return to local date string such as 'sun 13:00 pm'
export function formatLocalDate(inputdate){
    try{
        const date = format(filterdate(inputdate), 'EEE hh:mm a').toLocaleLowerCase();
        return date;
    }catch(err){
        console.error(err)
        return 'sun 12:00am'
    }
}

 // return hour

export function formathour(inputdate, currentdate){
    try{
        const inputdatefiltered = filterdate(inputdate);
        const currentdatefiltered = filterdate(currentdate);
        if(isSameHour(inputdatefiltered, currentdatefiltered)){
            return 'now'
        }else{
            return format(inputdatefiltered, 'h a').toLocaleLowerCase()
        }
    }catch(err){
        console.error(err)
        return '12am'
    }
 }

// return string time
export function formatStringTime(inputdate){
    try{
        const inputfiltered = filterdate(inputdate)
        return format(inputfiltered, 'hh:mm a').toLocaleLowerCase()
    }catch(err){
        console.error(err)
        return '12:00 am'
    }
}

export function formatZuluTime(inputdate){
    try{
        return format(inputdate, 'hh:mm a').toLocaleLowerCase()
    }catch(err){
        console.error(err)
        return '12:00 am'
    }
}

//return time for astro

export function formattime(inputdate){
    try{
        return getTime(inputdate)
    }catch(err){
        console.error(err)
        return '2025-01-01T00:00:00'
    }

}


// add hours 

export function addhour(inputdate, amt){
    try{
        return addHours(inputdate, amt)
    }catch(err){
        console.error(err)
        return '00'
    }
}

//adjust time with zulu

export function adjustZuluTime(inputdate, currentdate){
    try{
        let filteredcurrent = '-00:00';
        const filteredinput = filterdate(inputdate);
        if(/[+-]\d{2}:\d{2}/.test(currentdate)){
            filteredcurrent = currentdate.slice(-6);
        }
        const adddedhours = addHours(filteredinput, parseInt(filteredcurrent.slice(0, 3)))
        const addedminutes = addMinutes(adddedhours, parseInt(`${filteredcurrent.slice(0, 1)}${filteredcurrent.slice(-2)}`));
        return addedminutes;
    }catch(err){
        console.error(err)
        return '2025-01-01T00:00:00'
    }
}

//add day 

export function addday(inputdate, num){
    try{
        const filteredinput = filterdate(inputdate)
        const addeddays = addDays(filteredinput, parseInt(num))
        return addeddays

    }catch(err){
        console.error(err)
        return '2025-01-01T00:00:00'
    }
}

//is same day

export function checksameday(day, day1){
    try{
       const same = isToday(filterdate(day), {comparisonDate: filterdate(day1)})
        return same   
    }catch(err){
        console.error(err)
        return true
    }
}

//astro track calc

function adjustTime (inputdate, currentdate){
    /*const filteredcurrent = filterdate(currentdate)*/
    const match = currentdate.match(/[+-]\d{2}:\d{2}$/)
    if(match){
        const offset = match[0]
        const [hours, minutes] = offset.split(':').map(Number)
        const totalminutes = hours * 60 + minutes;
        const newDate = addMinutes(filterdate(inputdate), totalminutes)
        return newDate
    }else{
        return filterdate(inputdate)
    }
}

function getTimeMinutes(date){
    return getHours(date)* 60 + getMinutes(date)
}

export function calculateAstro(first, last, currenttime){
    try{
    const currenttime_filtered  = filterdate(currenttime);
    const localFirst = adjustTime(first, currenttime)
    const localLast = adjustTime(last, currenttime)
    let percentage, lasthour, firsthour;
    
    const isDay = isAfter(currenttime_filtered, localFirst) && isBefore(currenttime_filtered, localLast)
    if(isDay){
        const daytotalminutes = differenceInMinutes(localLast, localFirst);
        const dayelapsedminutes = Math.max(0, differenceInMinutes(currenttime_filtered, localFirst))
        percentage = Math.min((dayelapsedminutes/daytotalminutes) * 100, 100)
        lasthour = formatZuluTime(localLast)
        firsthour = formatZuluTime(localFirst)

    }else{
        let localRise = localFirst;
        if(isSameDay(localLast, currenttime_filtered)){
            localRise = addDays(localRise, 1)
        }
        const nightTotalMinutes = differenceInMinutes(localRise, localLast);
        let nightelapsedminutes = Math.max(0, differenceInMinutes(currenttime_filtered, localLast));

        if(getTimeMinutes(currenttime_filtered) < getTimeMinutes(localLast)) {
            nightelapsedminutes =  differenceInMinutes(addDays(currenttime_filtered, 1), localLast);
        }
        percentage = Math.min((nightelapsedminutes / nightTotalMinutes) *100, 100);
        lasthour = formatZuluTime(localFirst)
        firsthour = formatZuluTime(localLast)
    }

    return {progress: percentage.toFixed(2), isDay: isDay, last: lasthour, first: firsthour}
}catch(err){
    console.error(err)
    return {progress: 50, isDay: false, last: '06:00 pm', first: '06:00 am'}
}

}


//format sunrise and sunset time

export function formatSunriseSet(inputdate, currentdate){
    try{
        const adjusted = adjustTime(inputdate, currentdate)
        return formatZuluTime(adjusted)
        
    }catch(err){
        console.error(err)
        return '12:00 am'
    }
}

