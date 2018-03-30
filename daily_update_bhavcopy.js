var express = require('express');
var router = express.Router();
const fs = require('fs');
var models = require('./models');
const moment = require('moment');
const _ = require('lodash');
const csv = require('csvtojson');
var argv = require('minimist')(process.argv.slice(2));

console.log("Date to download Bhavcopy for: ", argv.date);

var bhavCopyDate = argv.date;

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


let update = function() {
  return new Promise(function(resolve, reject) {
    return bhavCopyModel.sync()
      .then(function (result) {
        return csv()
          .fromFile(`./cm${bhavCopyDate}bhav.csv`)
          .on('json', (obj) => {
            if (!_.isNil(obj) && obj.SERIES === 'EQ') {
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
          .on('done', (error) => {
            let promiseArr = [];
            if(_.isNil(error)) {
              return bhavCopyModel.findAll({where: {SERIES: 'EQ'}}).then(function (res) {
                res.forEach(function (stock, index) {
                  var hello = models.sequelize.define(stock.SYMBOL, {
                    SYMBOL: models.Sequelize.STRING,
                    CLOSE: models.Sequelize.FLOAT,
                    TIMESTAMP: {
                      type: models.Sequelize.DATEONLY,
                      primaryKey: true,
                    },
                  })
                  hello.sync();
                  promiseArr.push(hello.create({SYMBOL: stock.SYMBOL, CLOSE: stock.CLOSE, TIMESTAMP: stock.TIMESTAMP}))
                })
                return Promise.all(promiseArr).then(function(res){
                  console.log("Promise.all", JSON.stringify(res))
                })
              })
            } else {
              throw new Error({error: error});
            }
          })
          .then(function(res){
            console.log("last promise: " , res)
          })
      }).catch(function (err) {
        throw new Error({error: err})
      })
  });
}

update();

