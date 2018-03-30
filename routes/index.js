var express = require('express');
var router = express.Router();
const fs = require('fs');
var request = require('request');
var models = require('../models');
var csv2sql = require('csv2sql-stream');
const moment = require('moment');
const {Writable} = require('stream');
const _ = require('lodash');
const csv = require('csvtojson');

var bhavCopyDate = '01MAR2018';
let bhavCopyModel = models.sequelize.define(`${bhavCopyDate}_stock`, {
  SYMBOL : {
    type: models.Sequelize.STRING,
    primaryKey: true,
  },
  SERIES:{
    type: models.Sequelize.STRING,
    primaryKey: true,
  },
  OPEN: models.Sequelize.FLOAT,
  HIGH: models.Sequelize.FLOAT,
  CLOSE: models.Sequelize.FLOAT,
  LAST: models.Sequelize.FLOAT,
  LOW: models.Sequelize.FLOAT,
  PREVCLOSE: models.Sequelize.FLOAT,
  TOTTRDQTY: models.Sequelize.STRING,
  TOTTRDVAL: models.Sequelize.STRING,
  TOTALTRADES: models.Sequelize.STRING,
  TIMESTAMP: models.Sequelize.DATEONLY,
  ISIN: models.Sequelize.STRING,
}, {
  timestamps: false
});

var synced = false;

router.get('/', function(req, res, next) {
  csv()
    .fromFile(`./cm${bhavCopyDate}bhav.csv`)
    .on('json',(obj)=>{
      if(!_.isNil(obj) && obj.SERIES === 'EQ') {
        bhavCopyModel.upsert({
          SYMBOL: obj.SYMBOL,
          SERIES: obj.SERIES,
          LOW: obj.LOW,
          CLOSE: obj.CLOSE,
          OPEN: obj.OPEN,
          HIGH: obj.HIGH,
          LAST: obj.LAST,
          PREVCLOSE: obj.PREVCLOSE,
          TOTTRDQTY: obj.TOTTRDQTY,
          TOTTRDVAL: obj.TOTTRDVAL,
          TIMESTAMP: moment(obj.TIMESTAMP).format('YYYY-MM-DD'),
          TOTALTRADES: obj.TOTALTRADES,
          ISIN: obj.ISIN
        })
      }
    })
    .on('done',(error)=>{
      console.log('end')
    })

  // csv2sql.transform("STOCKS", fs.createReadStream(`./cm${bhavCopyDate}bhav.csv`))
  //   .pipe(new Writable({
  //     write(chunk, encoding, callback) {
  //       synced = false;
  //       output = chunk.toString();
  //       output = output.replace('STOCKS', `${bhavCopyDate}_stocks`);
  //
  //       if(!synced){
  //         bhavCopyModel.sync();
  //         synced = true;
  //       }
  //       models.sequelize.query(output, {type: models.sequelize.QueryTypes.INSERT})
  //         .then(function (res) {
  //           // console.log(res);
  //           callback();
  //         })
  //     }
  //   }))
});


router.get('/update', function(req, res) {
  return new Promise(function (resolve, reject) {
    console.log(this);
    bhavCopyModel.findAll({where: {SERIES: 'EQ'}}).then(function (res) {
      res.forEach(function(stock, index){
        var hello = models.sequelize.define(stock.SYMBOL, {
          SYMBOL: models.Sequelize.STRING,
          CLOSE: models.Sequelize.FLOAT,
          TIMESTAMP: {
            type: models.Sequelize.DATEONLY,
            primaryKey: true,
        },
        })
        hello.sync();
        hello.create({ SYMBOL: stock.SYMBOL, CLOSE: stock.CLOSE, TIMESTAMP: stock.TIMESTAMP })
          .then(function(res){
            console.log("RESULT" + JSON.stringify(res))
          }).catch(function(err){
            console.log(err);
        })
      })
    })
  })
})


module.exports = router;
