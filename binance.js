import crypto from 'crypto';
import fetch from 'node-fetch'

const api_key = '3aceb9dfacc4f0ae2dca00f1d2eec8ad7567a491372cd0f2e2d4c2734d720f59'
const api_secret = 'd5b9b2e9d980da320b306676dd8afe3635e706110a5fa96a0e096ede3ff0c235'
const baseURL = 'https://testnet.binancefuture.com'
const headerAPIKey = {
    'X-MBX-APIKEY': ''
}

export const generateHMACSignatures = (queryString) => {
    const hashingAlgo = 'sha256';
    const hmac = crypto.createHmac(hashingAlgo, api_secret); 
    const hashed = hmac.update(queryString);
    const hexhashed = hashed.digest('hex');
    return hexhashed;
}


export const transactionHistory = (asset) => {
    const link = '/fapi/v1/userTrades?';
    const query = `symbol=${asset}&timestamp=${Date.now()-1000}`;
    const HMAC = generateHMACSignatures(query);
    headerAPIKey['X-MBX-APIKEY'] = api_key;
    return fetch(baseURL+link+query+`&signature=${HMAC}`,{method: 'get', headers: headerAPIKey})
    .then(res=>{
       return res.json()
    })
    .then(res=>{
        return res;
    })
}

export const enterTrade = (symbol, side, orderType, quantity) => {
    const path = `/fapi/v1/order?`;
    const query = `symbol=${symbol}&side=${side}&type=${orderType}&quantity=${quantity}&timestamp=${Date.now()-1000}`;
    const HMAC = generateHMACSignatures(query);
    headerAPIKey['X-MBX-APIKEY'] = api_key;
    return fetch(baseURL+path+query+`&signature=${HMAC}`,{method: 'post', headers: headerAPIKey})
    .then(res=>{
       return res.json();
    })
    .then(res=>{
        console.log(res.side)
        return {status: true};
    })
    .catch(err=>{
        return {status: false}
    })
}
    


//    transactionHistory("ETHUSDT").then(res=>{
//         const latestTrades = res.slice(-20);
//         let counter = 0;
//         latestTrades.forEach(item=>{
//             counter+=1
//             console.log(counter,":",item.side)
//         })
//         // res.forEach(element => {
            
//         //     // console.log(date.getDay()+'-'+integer(date.getMonth())+1+'-'+date.getFullYear())
//         // //     if(element.time>1678522858400){
//         // //         console.log(element)
//         // //     }    
//         // });
        
//    })
    


// enterTrade("ETHUSDT","SELL","MARKET","1")

    // const enterTrade = () => {
    
    // }
    
    // transactionHistory()
// console.log(generateHMACSignatures('hello'))