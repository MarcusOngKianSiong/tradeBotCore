import * as binance from './binance.js'
import * as db from './database.js'

import express from 'express';
import cors from 'cors'
const app = express();

let counter = 0;
let period = 0;
let interval = 0;
let side = "";
let asset = "";
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

const settingTradingParameters = (per,interv,as,sid) => {
    period = per
    interval = interv
    asset = as
    side = sid.toUpperCase()
    counter = 0;
    return Promise.resolve(true)
}

app.use(cors({
    origin: '*'
}))


app.get('/execute',(req,res)=>{
    const query = req.query;
    settingTradingParameters(query.period,query.interval,query.asset,query.side)
    .then(res=>{

        
        // side = "BUY"
        // asset = "ETHUSDT"
        // interval = 1000
        // period = 10000

        const int = setInterval(() => {        
            oneOrTwoTrades();
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
    .catch(err=>{
        console.log("Error in starting");
    })
    res.send({status: "success"});
    
})

app.get('/getHistoricalTradePeriodPerformance',(req,res)=>{
    db.getAllPerformanceData().then(data=>{
        console.log(data)
        res.send(data)
    })
})

app.get('/test',(req,res)=>{
    const query = req.query;
    console.log(query);
    res.send({"Status": "Success"})
})

app.listen(3001,()=>{
    console.log("Listening on port 3000....")
})

