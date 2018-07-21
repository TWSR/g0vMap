var express = require('express');
var router = express.Router();
var ctrl_api = require('../controllers/ctrl_api')

router.get('/road', ctrl_api.getRoadInfo);

router.get('/user', ctrl_api.getUser);

module.exports = router;