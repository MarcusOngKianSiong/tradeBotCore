const sendOrderToBinance = () => {
    return new Promise((resolve,reject)=>{
        resolve({success: true})
    })
}

import * as binance from './binance.js'

let counter = 0;
const period = 10000;
const interval = 1000;
let side = "BUY";
const asset = "ETHUSDT"
const orderType = "MARKET"
const quantity = "1"

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
    return outcome

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

const int = setInterval(() => {        
    oneOrTwoTrades()
    counter+=1;
    console.log("counter: ",counter);
    if(counter > period/interval) clearInterval(int);
}, interval);




// execution().then(res=>{
    
// })