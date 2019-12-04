const codeService = require('../services/codeService');
const logger = require('../config/logger');


exports.codeController = (req, res) => {
    try {
        let response = {};
        req.checkBody('code', 'Code can not be empty').notEmpty();
        req.checkBody('lang', 'Language can not be empty').notEmpty();
        let errors = req.validationErrors();
        if (errors) {
            response.status = false;
            response.message = errors[0].msg;
            return res.status(422).send(response);
        } else {
            let codeData = {
                "code": req.body.code,
                "input": req.body.input,
                "inputRadio": req.body.inputRadio,
                "lang": req.body.lang
            }
            const loadCode = new Promise((resolve, reject) => {
                codeService.compileCode(codeData).then(data => {
                    resolve(data)
                }).catch(err =>
                    reject(err)
                )
            })
            loadCode.then(codeDetails => res.status(200).send(codeDetails)).catch(err => {
                res.status(500).send({ "message": "something went wrong" })
            })
        }
    } catch (error) {
        logger.error(`ERROR: in controller ${error}`);
    }


}