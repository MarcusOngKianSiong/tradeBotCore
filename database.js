import pg from 'pg'
import * as binance from './binance.js'

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
       const item = `('${trade.symbol}',${trade.price},${trade.commission},${trade.realizedPnl} ,'${trade.side}',to_timestamp(${trade.time})),` 
       valuesString+=item;
    })
    valuesString = valuesString.slice(0,-1);

    const query = `insert into order_history (asset, price, commission, realisedpnl, side, timestamp) values ${valuesString};`

    return client.query(query).then(res=>{
        return true
    })
    .catch(err=>{
        return false
    })
}

const getLatestTransactionData = (numberOfTransactions) => {
    // Getting the values from the bottom of the list
    return client.query(`select * from order_history;`)
    .then(res=>{
        const rows = res.rows
        const latestTransactions = rows.splice(-numberOfTransactions);
        return latestTransactions;
    })
}


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