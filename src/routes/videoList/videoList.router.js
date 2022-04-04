const  express = require('express');
const {
    httpVideoList
}  = require('./videoList.controller');

const videoListRouter = express.Router();

videoListRouter.get('/',httpVideoList);


module.exports = videoListRouter
