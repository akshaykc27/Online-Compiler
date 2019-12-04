const express = require('express');
const router = express.Router();
const controller = require('../controller/controller')
router.post('/compileCode',controller.codeController);

module.exports = router;