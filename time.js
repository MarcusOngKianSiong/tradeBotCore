// example timestamp: 1679320826630


export function convertBinanceTimestampToDateAndTime(timestamp){
    const dateAndTime = new Date(timestamp);
    dateAndTime.setHours(dateAndTime.getHours()+8);
    const singaporeDateAndTime = dateAndTime.toISOString();
    const data = singaporeDateAndTime.split("T")
    data[1] = data[1].replace('Z','')
    return data
}

// what is returned from psql is in zulu time format
export function convertDateFromPSQLIntoSingaporeDate(date){
    date.setHours(date.getHours()+8)
    const singaporeDate = date.toISOString();
    return singaporeDate.split("T")[0]
    
}



// export function convertBinanceTimestampToTime(timestamp){
//     const dateAndTime = new Date(timestamp);
//     dateAndTime.setHours(dateAndTime.getHours()+8);
//     const singaporeDateAndTime = dateAndTime.toISOString();
//     const data = singaporeDateAndTime.split("T");
//     return ;
// }


console.log(convertBinanceTimestampToDateAndTime(1679320826630))
// convertBinanceTimestampToDate(1679320826630);
// console.log(convertBinanceTimestampToTime(1679320826630))