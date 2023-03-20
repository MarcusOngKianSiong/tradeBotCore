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

export const storeTradingPeriodPerformance = (numberOfTransactions) => {

    // Retrieve the value from order_history
    return getLatestTransactionData(numberOfTransactions).then(res=>{


        // Convert it to date format
        const beginTime = new Date(res[0].timestamp);
        const endTime = new Date(res[res.length-1].timestamp);

        // Convert to ISOString format
        const beginningTimeStamp = beginTime.toISOString();
        const endingTimeStamp = endTime.toISOString();

        let totalPnL = 0;
        // Get Total PNL;
        // console.log(res);

        res.forEach(transact=>{
            totalPnL += parseFloat(transact.realisedpnl);
            // console.log(`${toISOString(transact.timestamp)}`);
        })

        const values = `('${res[0].asset}',${numberOfTransactions},${res.length/2},to_timestamp('${beginningTimeStamp}','YYYY-MM-DDTHH24:MI:SS.MS'),to_timestamp('${endingTimeStamp}','YYYY-MM-DDTHH24:MI:SS.MS'),${totalPnL})`;
        console.log(values)

        // // console.log(values)
        return client.query(`insert into trading_period_performance (asset,num_transactions, num_trades, from_timestamp, to_timestamp, total_pnl) values ${values}`).then(res=>{
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