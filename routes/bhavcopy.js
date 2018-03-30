var express = require('express');
var router = express.Router();
const fs = require('fs');
var request = require('request');
var models = require('../models');
var csv2sql = require('csv2sql-stream');
var wget = require('wget-improved');
const _ = require('lodash');
const {Writable} = require('stream');

var bhavCopyDate = '01MAR2018';
let bhavCopyModel = models.sequelize.define(`${bhavCopyDate}_stock`, {
  id: {
    type: models.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  SYMBOL : {
    type: models.Sequelize.STRING,
    primaryKey: true,
  },
  SERIES: models.Sequelize.STRING,
  OPEN: models.Sequelize.FLOAT,
  HIGH: models.Sequelize.FLOAT,
  CLOSE: models.Sequelize.FLOAT,
  LAST: models.Sequelize.FLOAT,
  LOW: models.Sequelize.FLOAT,
  PREVCLOSE: models.Sequelize.FLOAT,
  TOTTRDQTY: models.Sequelize.STRING,
  TOTTRDVAL: models.Sequelize.STRING,
  TOTALTRADES: models.Sequelize.STRING,
  TIMESTAMP: models.Sequelize.STRING,
  ISIN: models.Sequelize.STRING,
}, {
  timestamps: false
});

router.get('/download/:date', function(req, res){
  return new Promise(function(resolve, reject){
    if(!_.isNil(req)){
      if(!_.isNil(req.params.date))
      var date = req.params.date;
      var bhavcopyUrl = `https://www.nseindia.com`;
      var options = {
        protocol: 'http',
        host: `www.nseindia.com`,
        path: `/content/historical/EQUITIES/2018/MAR/cm${date}bhav.csv.zip`,
        method: 'GET',
        // proxy: {
        //   protocol: 'http',
        //   headers: {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36'}
        // },
        gunzip: true
      }
      console.log(JSON.stringify(options))
      return wget.request(options, function(res){
        var content = '';
        if (res.statusCode === 200) {
          res.on('error', function(err) {
            console.log(err);
            resolve(err)
          });
          res.on('data', function(chunk) {
            content += chunk;
            resolve(content)

          });
          res.on('end', function() {
            console.log(content);
          });
        } else {
          console.log('Server respond ' + res.statusCode);
        }
      })
      // return wget(bhavcopyUrl)
    }
  })

})

// router.get('/', function(req, res, next) {
//   csv2sql.transform("STOCKS", fs.createReadStream(`./cm${bhavCopyDate}bhav.csv`)).pipe(new Writable({
//       write(chunk, encoding, callback) {
//         output = chunk.toString();
//         output = output.replace('STOCKS', `${bhavCopyDate}_stocks`);
//
//         bhavCopyModel.sync();
//         models.sequelize.query(output, {type: models.sequelize.QueryTypes.INSERT})
//           .then(function (res) {
//             // console.log(res);
//             callback();
//           })
//       }
//     }))
// });

//
// router.get('/update', function(req, res) {
//   return new Promise(function (resolve, reject) {
//     console.log(this);
//     bhavCopyModel.findAll({where: {SERIES: 'EQ'}}).then(function (res) {
//       res.forEach(function(stock, index){
//         var hello = models.sequelize.define(stock.SYMBOL, {
//           SYMBOL: models.Sequelize.STRING,
//           CLOSE: models.Sequelize.FLOAT,
//           TIMESTAMP: models.Sequelize.STRING
//         })
//         hello.sync();
//         hello.create({ SYMBOL: stock.SYMBOL, CLOSE: stock.CLOSE, TIMESTAMP: stock.TIMESTAMP })
//           .then(function(res){
//             console.log("RESULT" + JSON.stringify(res))
//           }).catch(function(err){
//             console.log(err);
//         })
//       })
//     })
//   })
// })
//

module.exports = router;
