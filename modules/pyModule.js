const exec = require('child_process').exec;
const fs = require('fs');
const cuid = require('cuid');
const logger = require('../config/logger');


exports.compilePython = (code, fn) => {

    let fileName = cuid.slug();
    path = 'temp/';

    fs.writeFile(path + fileName + '.py', code, err => {
        if (err)
            logger.error('ERROR: '.red + err);
        else {
            logger.info(`INFO: ${fileName}.py created`);
            let command = `cd ${path}; python ${fileName}.py`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    if (error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1) {
                        let out = { error: 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.' };
                        fn(out);
                    }
                    else {
                        if (exports.stats) {
                            logger.error(`INFO: ${fileName}.py contained an error while executing`);
                        }
                        let out = { error: stderr };
                        fn(out);
                    }
                }
                else {
                    if (exports.stats) {
                        logger.info(`INFO: ${fileName}.pysuccessfully executed !`);
                    }
                    let out = { output: stdout };
                    fn(out);
                }
            });
        }
    });
}

// exports.compilePythonWithInput = function (envData, code, input, fn) {
//     var fileName = cuid.slug();
//     path = './temp/';

//     fs.writeFile(path + fileName + '.py', code, function (err) {
//         if (exports.stats) {
//             if (err)
//                 console.log('ERROR: '.red + err);
//             else
//                 console.log('INFO: '.green + fileName + '.py created');
//         }
//         if (!err) {

//             fs.writeFile(path + fileName + 'input.txt', input, function (err) {
//                 if (exports.stats) {
//                     if (err)
//                         console.log('ERROR: '.red + err);
//                     else
//                         console.log('INFO: '.green + fileName + 'input.txt created');
//                 }
//                 if (!err) {
//                     var command = 'python ' + path + fileName + '.py < ' + path + fileName + 'input.txt ';
//                     exec(command, function (error, stdout, stderr) {
//                         if (error) {
//                             if (error.toString().indexOf('Error: stdout maxBuffer exceeded.') != -1) {
//                                 var out = { error: 'Error: stdout maxBuffer exceeded. You might have initialized an infinite loop.' };
//                                 fn(out);
//                             }
//                             else {
//                                 if (exports.stats) {
//                                     console.log('INFO: '.green + fileName + '.py contained an error while executing');
//                                 }
//                                 var out = { error: stderr };
//                                 fn(out);
//                             }
//                         }
//                         else {
//                             if (exports.stats) {
//                                 console.log('INFO: '.green + fileName + '.py successfully executed !');
//                             }
//                             var out = { output: stdout };
//                             fn(out);
//                         }
//                     });
//                 }
//             });
//         }
//     });
// }