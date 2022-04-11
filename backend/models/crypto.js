const mongoose = require('mongoose')
const cryptoSchema = mongoose.Schema({
    currency_from:{type:String},
    amount_one:{type:Number},
    currency_to:{type:String},
    amount_two:{type:Number},
    type:{type:String},
    date:{type:Date,default:Date.now}
})

var Crypto= module.exports = mongoose.model("Crypto",cryptoSchema)