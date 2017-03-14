
var months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];


function timeStamp(date) {
output = {
  unix: null,
  natural: null
};

  if(date.match(/[a-z]/ig)){
    output.unix = new Date(date)/1000;
    output.natural = date;
    if(isNaN(output.unix)){
      output.unix = null;
      output.natural = null;
    }
  }else {
    datePassed = new Date(date * 1000);
    output.unix = Number(date);
    output.natural = months[datePassed.getMonth()] + " "+ datePassed.getDate() + " " + datePassed.getFullYear();
  }
  return output;
};


module.exports = timeStamp;
