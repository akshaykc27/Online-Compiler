const exec = require('child_process').exec;
const fs = require('fs');
const cuid = require('cuid');
const logger = require('../config/logger');


exports.compileCpp = (code, fn) => {

    let dirName = cuid.slug();
    let path = `temp/${dirName}`;

    fs.mkdir(path, 0777, err => {
        if (err) {
            logger.error(err.toString());
        }
        else {
            fs.writeFile(`${path}/${dirName}.cpp`, code, err => {
                if (err) {
                    logger.error("ERROR:", err)
                }
                else {
                    logger.info(`${dirName}.cpp created successfully`);
                    let command = `cd ${path}; g++ ${dirName}.cpp`;
                    exec(command, (error, stdout, stderr) => {
                        if (error) {
                            logger.error(`ERROR: while compiling ${dirName}.cpp `);
                            let output = { error: stderr };
                            fn(output);
                        }
                        else {
                            logger.info(`Compiled ${dirName}.cpp successfully`);
                            let command = `cd ${path}; ./a.out`;
                            exec(command, (error, stdout, stderr) => {
                                if (error) {
                                    if (error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1) {
                                        var out = { error: 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.' };
                                        fn(out);
                                    }
                                    else {
                                        logger.error(`${dirName}.cpp contained an error while executing`);
                                        var out = { error: stderr };
                                        fn(out);
                                    }
                                }
                                else {
                                    logger.info(`${dirName}.cpp successfully compiled and executed !`);
                                    var out = { output: stdout };
                                    logger.info("output", out);
                                    fn(out);
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}