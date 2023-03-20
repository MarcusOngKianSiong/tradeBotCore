// example timestamp: 1679320826630

export function convertBinanceTimestampToDate(timestamp){
    const dateAndTime = new Date(timestamp);
    dateAndTime.setHours(dateAndTime.getHours()+8);
    const singaporeDateAndTime = dateAndTime.toISOString();
    const data = singaporeDateAndTime.split("T")
    return data[0]
}

export function convertBinanceTimestampToTime(timestamp){
    const dateAndTime = new Date(timestamp);
    dateAndTime.setHours(dateAndTime.getHours()+8);
    const singaporeDateAndTime = dateAndTime.toISOString();
    const data = singaporeDateAndTime.split("T");
    return data[1].replace('Z','');
}

// convertBinanceTimestampToDate(1679320826630);
// console.log(convertBinanceTimestampToTime(1679320826630))