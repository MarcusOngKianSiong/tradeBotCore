const sendOrderToBinance = () => {
    return new Promise((resolve,reject)=>{
        resolve({success: true})
    })
}


let counter = 0;
const period = 10000;
const interval = 1000;
let side = "BUY";


const executeOneTrade = () => {

    const outcome = sendOrderToBinance().then(res=>{
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

