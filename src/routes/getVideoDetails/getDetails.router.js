const  express = require('express');
const {
    httpGetDetails,
}  = require('./getDetails.controller');

const getDetailsRouter = express.Router();

getDetailsRouter.get('/',httpGetDetails);


module.exports = getDetailsRouter
