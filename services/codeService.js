const javaModule = require('../modules/javaModule');
const nodeModule = require('../modules/nodeModule');
const logger = require('../config/logger');

exports.compileCode = body => new Promise((resolve, reject) => {
    try {
        var code = body.code;
        let input = body.input;
        var inputRadio = body.inputRadio;
        var lang = body.lang;
        logger.info(lang + " " + inputRadio)

        if (lang === 'Java') {
            logger.info(" in services if block");
            javaModule.compileJava(code, function (data) {
                logger.info(data)
                resolve(data);
            });
        }
        if(lang === 'NODE'){
            logger.info(" in services if block");
            nodeModule.compileNode(code, function (data) {
                logger.info(data)
                resolve(data);
            });
        }
        else {
            console.log("didnt excute");

        }
    } catch (error) {
        logger.warn("ERROR in services" + error);
    }
})