const moment = require('moment');

var https = require('https');
var fs = require('fs');

var getDates = function(startDate, endDate) {
  var dates = [],
    currentDate = startDate,
    addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
};
let arr = [];
// Usage
const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
var dates = getDates(new Date(2011,0,1), new Date(2018,2,27));
let obj = {};
dates.forEach(function(date) {
  if( date.getDay() == 6 || date.getDay() == 0 ) {
    // console.log("weekend", date)
  }
  else{
    obj = {year: date.getFullYear(), month: monthNames[date.getMonth()], date: moment(date).format('DDMMMYYYY').toUpperCase()}
    arr.push(obj);
  }
});

console.log(JSON.stringify(arr));
