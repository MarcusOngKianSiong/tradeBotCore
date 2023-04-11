import * as db from './database.js'
import * as binance from './binance.js';

// binance.transactionHistory('ETHUSDT')
// .then(res=>{
//         console.log(res[res.length-1])
// })
// // db.getLatestTransactionData(1).then(res=>{
// //         console.log(res[res.length-1])
// // })

// let dateAndTime = new Date(1679320826630)
// let date = `${dateAndTime.getFullYear()}-${dateAndTime.getMonth()+1}-${dateAndTime.getDate()}`;
// let time = `${dateAndTime.getHours()}:${dateAndTime.getMinutes()}:${dateAndTime.getSeconds()}`;
// console.log(dateAndTime)
// console.log(date, time)

db.getLatestTransactionData(10).then(res=>{
        const item = res[9]
        const dater = new Date(item.date)
        console.log(dater);
})

