const winston = require('winston');
const myCustomLevels = {
    colors: {
      blue: 'blue',
      green: 'green',
      yellow: 'yellow',
      red: 'red'
    }
  };
   
var logger = winston.createLogger({
    levels: myCustomLevels.levels,
    transports :[
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});
module.exports = logger 