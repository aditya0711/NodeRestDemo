var express = require('express');
var router = express.Router();
var restify = require('requestify');
var bloc = require('blockapps-js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/bloc', function(req,res, next){
    restify.get("http://strato-dev4.blockapps.net/eth/v1.2/block?number=0")
        .then(function(response) {
                res.send(response)
                console.log(JSON.parse(response.body))
            }
        );

    
})


module.exports = router;
