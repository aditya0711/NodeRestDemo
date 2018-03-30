"use strict";


module.exports = function(sequelize, DataTypes) {
  var BhavCopy = sequelize.define("stock", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    SYMBOL : {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    SERIES: DataTypes.STRING,
    OPEN: DataTypes.FLOAT,
    HIGH: DataTypes.FLOAT,
    CLOSE: DataTypes.FLOAT,
    LAST: DataTypes.FLOAT,
    LOW: DataTypes.FLOAT,
    PREVCLOSE: DataTypes.FLOAT,
    TOTTRDQTY: DataTypes.STRING,
    TOTTRDVAL: DataTypes.STRING,
    TOTALTRADES: DataTypes.STRING,
    TIMESTAMP: DataTypes.STRING,
    ISIN: DataTypes.STRING,
  });
  return BhavCopy;
};