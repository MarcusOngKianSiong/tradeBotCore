import pg from 'pg'
import * as binance from './binance.js'
import * as time from './time.js'


const client = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'tradingapp',
    password: 'marcus8351',
    port: 5432,
});

client.connect()

// client.query('select * from order_history;').then(res=>{
//     console.log(res.rows)
// })



export const insertTransactions = (transactions) => {

    let valuesString = '';
    transactions.forEach(trade=>{
       const timestamp = trade.time;
       const dateAndTime = time.convertBinanceTimestampToDateAndTime(timestamp);
       const item = `('${trade.symbol}',${trade.price},${trade.commission},${trade.realizedPnl} ,'${trade.side}','${dateAndTime[0]}','${dateAndTime[1]}'),`;
       valuesString+=item;
    })
    valuesString = valuesString.slice(0,-1);

    const query = `insert into order_history (asset, price, commission, realisedpnl, side, date, time) values ${valuesString};`
    
    return client.query(query).then(res=>{
        return true;
    })
    .catch(err=>{
        return false;
    })

}

export const getLatestTransactionData = (numberOfTransactions) => {
    // Getting the values from the bottom of the list
    return client.query(`select * from order_history;`)
    .then(res=>{
        const rows = res.rows
        const latestTransactions = rows.splice(-numberOfTransactions);
        return latestTransactions;
    })
}

export const getAllPerformanceData = () => {
    return client.query(`select * from trading_period_performance;`).then(res=>{
        const formattedDate = []
        res.rows.forEach(period=>{
            period.from_date = time.convertDateFromPSQLIntoSingaporeDate(period.from_date);
            period.to_date = time.convertDateFromPSQLIntoSingaporeDate(period.to_date);
            formattedDate.push(period);
        })
        console.log(formattedDate)
        return formattedDate;
    })
}

export const storeTradingPeriodPerformance = (numberOfTransactions) => {

    // Retrieve the value from order_history
    return getLatestTransactionData(numberOfTransactions).then(res=>{

        
        const startDate = time.convertDateFromPSQLIntoSingaporeDate(res[0].date);
        const endDate = time.convertDateFromPSQLIntoSingaporeDate(res[res.length-1].date);

        // get end date
        const startTime = res[0].time;
        const endTime = res[res.length-1].time;

        

        // // Convert to ISOString format
        // const beginningTimeStamp = beginTime.toISOString();
        // const endingTimeStamp = endTime.toISOString();

        let totalPnL = 0;
        // Get Total PNL;
        // console.log(res);

        res.forEach(transact=>{
            totalPnL += parseFloat(transact.realisedpnl);
            // console.log(`${toISOString(transact.timestamp)}`);
        })

        const values = `('${res[0].asset}',${numberOfTransactions},${res.length/2},'${startDate}','${endDate}','${startTime}','${endTime}',${totalPnL})`;
        console.log(values)

        // // console.log(values)
        return client.query(`insert into trading_period_performance (asset,num_transactions, num_trades, from_date, to_date, from_time, to_time, total_pnl) values ${values}`).then(res=>{
            return true; 
        })
        .catch(err=>{
            console.log(err);
            return false;
        })
    })
}

// storeTradingPeriodPerformance(5)
// .then(res=>{
//     console.log(res)
// })

// binance.transactionHistory("ETHUSDT").then(res=>{

//     const latestTrades = res.slice(-20);
    
//     insertTransactions(latestTrades).then(res=>{
//         console.log("outcome: ",res)
//     })

//     // let valuesString = '';
//     // latestTrades.forEach(trade=>{
//     //    const item = `('${trade.symbol}',${trade.price},${trade.commission},'${trade.side}',to_timestamp(${trade.time})),` 
//     //    valuesString+=item;
//     // })
//     // valuesString = valuesString.slice(0,-1);

//     // const query = `insert into order_history (asset, price, commission, side, timestamp) values ${valuesString};`

//     // client.query(query).then(res=>{
//     //     console.log(res)
//     // })
    
// })




// client.query(`insert into order_history (price,side,timestamp,commission,asset) values(600, 'buy',1679050976,123,'USDT');`)


// export const storeTradeOrder = () => {
//     client.query
// }

client.query(`select * from order_history;`).then(res=>{
    console.log("this: ",time.convertDateFromPSQLIntoSingaporeDate(res.rows[0].date))
    // console.log("THIS:",res.rows[0].date)
    // console.log("time: ",res.rows[0].time)
})