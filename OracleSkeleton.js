// Load Ethereum
const Eth = require('ethjs');
const privateToAccount = require('ethjs-account').privateToAccount;
const provider = 'https://rinkeby.infura.io';
const eth = new Eth(new Eth.HttpProvider(provider));

//provider account
const privateKeyString = "";
const account = privateToAccount(privateKeyString); 

//create contract wrapper 
const futuresABI = [{ }];
const futuresAddress="";
const futures = eth.contract(futuresABI).at(futuresAddress);

/*
Handle Oracle Data
*/

//respond to queryString from futures.Query event
let respondToQuery = function(response){

    futures.oracleCallback(response).then((totalSupply) => {
        if ( err ) throw err;

    });
}

function fetchData(queryString, callback){
    //fetch data, ex Binance futures
    //pass to callback
}

/*
Handle Query events from futures contract
event Query(string queryString, address queryAddress);
*/

// Create the Event filter for solidity event
let filter = futures.contract.Query().new((err, res) => {
    if ( err ) {
        throw err;
    }
});

// Watch the event filter
filter.watch().then((result) => {
    // Sanity check
    if ( result.length != 2 ) {
        throw; 
    }

    // Make sure it is us
    if ( result[1] != account ) {
        throw; 
    }

   fetchData(result[0],respondToQuery); 
});
