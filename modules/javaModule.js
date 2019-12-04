const exec = require('child_process').exec;
const fs = require('fs');
const cuid = require('cuid');
const logger = require('../config/logger');

exports.compileJava = (code, fn) => {
    let dirName = cuid.slug();
    let path = `temp/${dirName}`
    logger.info( `path is ${path}`);

    fs.mkdir(path, 0777, err => {
        if (err) {
            logger.warn(err.toString());
        }
        else {
            fs.writeFile(path + "/Main.java", code, err => {
                if (err) {
                    logger.warn("ERROR:", err)
                }
                else {
                    logger.info("Main.java created successfully");
                    let command = `cd ${path}; javac Main.java`
                    exec(command, (error, stdout, stderr) => {
                        if (error) {
                            logger.warn("ERROR: while compiling Main.java");
                            let output = { error: stderr };
                            fn(output);
                        }
                        else {
                            logger.info("compiled a java file successfully");
                            let command = `cd ${path}; java Main`;
                            exec(command, (error, stdout, stderr) => {
                                if (error) {
                                    if (error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1) {
                                        var out = { error: 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.' };
                                        fn(out);
                                    }
                                    else {
                                        logger.info('INFO:' + path + '/Main.java contained an error while executing');
                                        var out = { error: stderr };
                                        fn(out);
                                    }
                                }
                                else {
                                    logger.info('INFO: '+ path + '/Main.java successfully compiled and executed !');
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