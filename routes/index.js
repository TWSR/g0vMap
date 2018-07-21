var express = require('express');
var router = express.Router();
const logger = require('log4js').getLogger("initial_map");
/* GET home page. */
router.get('/', function(req, res, next) {
    logger.info('initail map from ' + req._remoteAddress);
    res.render('map', { title: 'TWSR g0v' });
});
router.get('/gmap', function(req, res, next) {
    logger.info('initail Gmap from ' + req._remoteAddress);
    res.render('Gmap', { title: 'TWSR g0v' });
});

module.exports = router;