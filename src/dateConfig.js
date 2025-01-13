import { format, parseISO, isToday, isYesterday, isTomorrow, getTime, isSameHour, addHours, addMinutes, addDays, 
     getHours, getMinutes, isAfter, isBefore, differenceInMinutes, isSameDay, differenceInDays,
     formatDistanceToNow,
     differenceInSeconds,
     differenceInMilliseconds} from "date-fns";

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
        const filtered1 = parseISO(inputdate);
        const  filtered2 = parseISO(currentdate);
        
       if(isToday(filtered1, filtered2)){
            return 'Today';
        }else if(isYesterday(filtered1, filtered2)){
            return 'Yesterday';
        }else if(isTomorrow(filtered1, filtered2)){
            return 'Tomorrow';
        }else{
            return format(filtered1, 'EEE')
        }

    
    }catch(err){
        console.error(err)
        return 'day'
    }
}

// return to local date string such as 'sun 13:00 pm'
export function formatLocalDate(inputdate){
    try{
        const date = format(parseISO(inputdate), 'EEE hh:mm a').toLocaleLowerCase();
        return date;
    }catch(err){
        console.error(err)
        return 'sun 12:00am'
    }
}


export function getTimeDifference(inputime){
    try{
    const inputdate = new Date(inputime);
    return formatDistanceToNow(inputdate, {addSuffix: true})
    }catch(err){
        console.error(err)
        return 'uknown time ago'
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
        const inputfiltered = parseISO(inputdate)
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

export function calculateAstro(first, last, currenttime, isDay){
    try{
    let percentage, lasthour, firsthour;
    
    //const isDay = isAfter(currenttime_filtered, localFirst) && isBefore(currenttime_filtered, localLast)
    if(isDay){
        const daytotalminutes = differenceInMinutes(last, first);
        console.log('total minutes:'+ daytotalminutes)
        const dayelapsedminutes = Math.max(0, differenceInMinutes(currenttime, first))
        console.log('elapased minute: '+ dayelapsedminutes)
        percentage = Math.min((dayelapsedminutes/daytotalminutes) * 100, 100)
        lasthour = formatStringTime(last)
        firsthour = formatStringTime(first)

    }else{
        let localRise = first;
        if(isSameDay(last, currenttime)){
            localRise = addDays(localRise, 1)
        }
        const nightTotalMinutes = differenceInMinutes(localRise, last);
        let nightelapsedminutes = Math.max(0, differenceInMinutes(currenttime, last));

        if(getTimeMinutes(currenttime) < getTimeMinutes(last)) {
            nightelapsedminutes =  differenceInMinutes(addDays(currenttime, 1), last);
        }
        percentage = Math.min((nightelapsedminutes / nightTotalMinutes) *100, 100);
        lasthour = formatStringTime(first)
        firsthour = formatStringTime(last)
    }

    return {progress: percentage.toFixed(2), last: lasthour, first: firsthour}
}catch(err){
    console.error(err)
    return {progress: 50, last: '06:00 pm', first: '06:00 am'}
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

//difference in timestamp 

export function checkweatherdiffExpired(lastdate, hours){
    const currenttime = Date.now();
    const elapsed = differenceInMilliseconds(currenttime, lastdate);
    console.log('elapesd: '+ elapsed)
    console.log('total_hours' + hours)
    console.log('testhours'+ hours*3600000)
    return elapsed >= (hours*3600000)
}
