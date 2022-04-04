const  express = require('express');
const {
    httpUpdateDataBase,
}  = require('./update.controller');

const updateRouter = express.Router();

updateRouter.get('/',httpUpdateDataBase);



module.exports = updateRouter
