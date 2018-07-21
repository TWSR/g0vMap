var path = require('path');
var Sequelize = require('sequelize');
var db_conn = require('../config/db');

const sequelize = new Sequelize(db_conn.connectInfo.database, db_conn.connectInfo.user, db_conn.connectInfo.password, {
    host: db_conn.connectInfo.host,
    dialect: 'mysql',
    define: { timestamps: false },
    logging: false
});

const Road = sequelize.import("../models/Road")

exports.getUser = function(req, res, next) {
    Road.findAll({
            attributes: [
                [sequelize.literal('distinct `user`'), 'user'],
            ]
        })
        .then(users => {
            res.json(users)
        })
}

exports.getRoadInfo = function(req, res, next) {
    //res.sendFile(path.join(__dirname, '../public/testData', '20180122-180232客運.json'))
    Road.findAll()
        .then((roadInfos) => {
            let output = roadInfos.map((roadInfo) => {
                //let result = roadInfo.get({plain: true})

                let result = {}
                result.smooth_index = roadInfo.get('smooth_index')
                result.time = roadInfo.get('time')
                result.uuid = roadInfo.get('uuid')
                result.source = roadInfo.get('source')
                result.remark = roadInfo.get('remark')
                result.user = roadInfo.get('user')
                result.vehicle_type = roadInfo.get('vehicle_type')
                result.id = roadInfo.get('id')

                try {
                    result.lat = (roadInfo.get('latlng')) ? roadInfo.get('latlng').coordinates[0] : null
                    result.lng = (roadInfo.get('latlng')) ? roadInfo.get('latlng').coordinates[1] : null
                    result.points = (roadInfo.get('points')) ? roadInfo.get('points').coordinates : null
                    result.imgpath = roadInfo.get('img')
                } catch (err) {};
                if (result.points == null) {
                    var points = [];
                    var temp_str = result.remark.replace("LineString(", "");
                    temp_str = temp_str.replace(")", "");
                    var temp = temp_str.split(',');
                    temp.forEach(element => {
                        var latlng = element.split(' ');
                        points.push([latlng[0], latlng[1]])
                    });
                    result.points = points
                }
                //delete result.latlng
                return result
            })
            res.json(output)
        })
};

//25.089166"N 121.46013888"E
//24.948888"N 121.61652777"E
exports.getRoadInfoTP = function(req, res, next) {
    var geom = sequelize.fn('ST_GEOMFROMTEXT', `LINESTRING(25.089166 121.36013888,25.089166 121.61652777,24.948888 121.61652777,24.948888 121.36013888,25.089166 121.36013888)`);
    var contains = sequelize.fn('ST_CONTAINS',
        sequelize.fn('POLYGON', geom),
        sequelize.col('latlng')
    );

    Road.findAll({
            where: contains,
            attributes: [
                'smooth_index', 'time', 'uuid', 'source', 'remark', 'user', 'vehicle_type', 'id', 'latlng', 'points', 'img'
            ]
        })
        .then((roadInfos) => {
            let output = roadInfos.map((roadInfo) => {
                //let result = roadInfo.get({plain: true})

                let result = {}
                result.smooth_index = roadInfo.get('smooth_index')
                result.time = roadInfo.get('time')
                result.uuid = roadInfo.get('uuid')
                result.source = roadInfo.get('source')
                result.remark = roadInfo.get('remark')
                result.user = roadInfo.get('user')
                result.vehicle_type = roadInfo.get('vehicle_type')
                result.id = roadInfo.get('id')

                try {
                    result.lat = (roadInfo.get('latlng')) ? roadInfo.get('latlng').coordinates[0] : null
                    result.lng = (roadInfo.get('latlng')) ? roadInfo.get('latlng').coordinates[1] : null
                    result.points = (roadInfo.get('points')) ? roadInfo.get('points').coordinates : null
                    result.imgpath = roadInfo.get('img')
                } catch (err) {};
                if (result.points == null) {
                    var points = [];
                    var temp_str = result.remark.replace("LineString(", "");
                    temp_str = temp_str.replace(")", "");
                    var temp = temp_str.split(',');
                    temp.forEach(element => {
                        var latlng = element.split(' ');
                        points.push([latlng[0], latlng[1]])
                    });
                    result.points = points
                }
                //delete result.latlng
                return result
            })
            res.json(output)
        })
};