import * as binance from './binance.js'
import * as db from './database.js'

import express from 'express';
const app = express();

let counter = 0;
const period = 20000;
const interval = 1000;
let side = "BUY";
const asset = "ETHUSDT";
const orderType = "MARKET"; 
const quantity = "1";

const executeOneTrade = () => {

    const outcome = binance.enterTrade(asset,side, orderType, quantity).then(res=>{
        
        let status = ""
        if(side === "BUY"){
            side = "SELL";
            status = "BUY order executed";
        }else{
            side = "BUY";
            status = "SELL order executed";
        }
        return status
    })
    .catch(err=>{
        return `failed to execute ${side} order`;
    })
    return outcome;
}

const oneOrTwoTrades = () => {
    // If trade is first or last
    if(counter === 0 || counter === period/interval){
        console.log("----FIRST----")
        executeOneTrade().then(res=>{
            console.log(res)
        })
    }else{ // If trade is middle
        console.log("----MIDDLE----")
        executeOneTrade().then(res=>{
            
            console.log(res);
            executeOneTrade().then(res=>{
                console.log(res)
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }
}

const storeTransactionForCurrentRun = (asset) => {
    return binance.transactionHistory(asset).then(res=>{
        const numberOfTrades = (period/interval+1-2)*2+2
        const trades = res.slice(-numberOfTrades);
        return db.insertTransactions(trades)
        .then(res=>{
            return true
        })
    })
}

const calculateAndStoreTotalProfitAndLoss = () => {
    return db.storeTradingPeriodPerformance(period/interval*2);
}


app.get('/execute',(req,res)=>{
    const int = setInterval(() => {        
        oneOrTwoTrades()
        counter+=1;
        console.log("counter: ",counter);
        if(counter > period/interval) {
            storeTransactionForCurrentRun(asset).then(res=>{
                calculateAndStoreTotalProfitAndLoss();    
            })
            clearInterval(int);
        };
    }, interval);   
})

app.listen(3000,()=>{
    console.log("Listening on port 3000....")
})

