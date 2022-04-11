const axios = require('axios');
const { find } = require('../models/crypto');
const Crypto = require("../models/crypto")

exports.getCrypto_Exchange = async (req, res) => {

    try {
        const { currency_from, amount_one, currency_to } = req.body
        //saving the live price to the database 
        if (amount_one != '') {
            let result = await axios.get(`http://api.coinlayer.com/api/live?access_key=${process.env.KEY}&target=${currency_to}&symbols=${currency_from}`)
           
            await Crypto.create({
                currency_from,
                currency_to,
                amount_one,
                amount_two: result.data.rates[currency_from] * amount_one,
                type: 'Live Price'
            })
            //emitting an event when ever a live price is been initiated it should be posted to all clients. so basically we are emiting the historical data to the client at real time
            let crypto = await Crypto.find()
            req.io.emit('add-crypto', crypto)
            return res.status(200).json({ data: result.data, success: true })

        }

    } catch (e) {
        console.log(e)
        return res.json({ data: "Something went wrong please try again.. and ensure you have a strong network connection", success: false })
    }
}
exports.postCrypto_Exchange = async (req, res) => {
    try {
        //posting the exchanged transaction to the database
        const {
            currency_from,
            currency_to,
            amount_one,
            amount_two
        } = req.body
        if (amount_one === 0 && amount_two === 0) {
            return res.json({ data: "invalid number", success: false })
        }

        let savedCrypto = await Crypto.create({
            currency_from,
            currency_to,
            amount_one,
            amount_two,
            type:'Exchanged'
        })
        if (savedCrypto) {
            //emitting an event when ever a transaction is made it should be posted to all clients
            let crypto = await Crypto.find()
            req.io.emit('add-crypto', crypto)
            return res.status(200).json({ data: "Transaction exchanged successfully", success: true })
        }

    } catch(e) {
       
        return res.status(401).json({ data: "Something went wrong please try again.. and ensure you have a strong network connection", success: false })

    }
}

exports.displayCrypto_Exchange = async (req, res) => {
    try {
        //fetching the historical data
        const crypto = await Crypto.find({})
        res.status(200).json({ data: crypto, success: true })
    } catch (error) {
        res.status.json({ data: "Opps something went wrong", success: false })

    }
}