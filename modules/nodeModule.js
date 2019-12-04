const exec = require('child_process').exec;
const fs = require('fs');
const cuid = require('cuid');
const logger = require('../config/logger');

exports.stats = false;

exports.compileNode = (code, fn) => {

    var fileName = cuid.slug();
    path = `temp`;
    console.log(path);


    fs.writeFile(`${path}/${fileName}.js`, code, err => {
        if (err)
            logger.error('ERROR: ' + err);
        else {
            logger.info('INFO: ' + fileName + '.js created');
            let command = `cd ${path}; node ${fileName}.js`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    if (error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1) {
                        let out = { error: 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.' };
                        fn(out);
                    }
                    else {
                        logger.error('INFO: ' + fileName + '.js contained an error while executing');
                        var out = { error: stderr };
                        fn(out);
                    }
                }
                else {
                    logger.info('INFO: ' + fileName + '.js successfully executed !');
                    var out = { output: stdout };
                    fn(out);
                }
            })
        }
    })
}