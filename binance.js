import crypto from 'crypto';
import fetch from 'node-fetch'

// const crypto = require('crypto')
// const fetch = require('node-fetch')
const api_key = '3aceb9dfacc4f0ae2dca00f1d2eec8ad7567a491372cd0f2e2d4c2734d720f59'
const api_secret = 'd5b9b2e9d980da320b306676dd8afe3635e706110a5fa96a0e096ede3ff0c235'
const baseURL = 'https://testnet.binancefuture.com'
const headerAPIKey = {
    'X-MBX-APIKEY': ''
}

const generateHMACSignatures = (queryString) => {
    const hashingAlgo = 'sha256';
    const hmac = crypto.createHmac(hashingAlgo, api_secret); 
    const hashed = hmac.update(queryString);
    const hexhashed = hashed.digest('hex');
    return hexhashed;
}
