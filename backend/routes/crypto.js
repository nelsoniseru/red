var express = require('express');
var router = express.Router();
var CryptoExchangeController= require('../controller/cryptoController')


router.post('/crypto-exchange',CryptoExchangeController.getCrypto_Exchange);
router.post('/post-crypto',CryptoExchangeController.postCrypto_Exchange);
router.get('/display-crypto',CryptoExchangeController.displayCrypto_Exchange);

module.exports = router;
