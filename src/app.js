const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const getDetailsRouter = require('./routes/getVideoDetails/getDetails.router');
const updateRouter = require('./routes/dataBaseUpdate/update.router');
const videoListRouter = require('./routes/videoList/videoList.router');

const app = express();
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/databaseupdate', updateRouter);
app.use('/videoDetails', getDetailsRouter);
app.use('/videos', videoListRouter);
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})


module.exports = app;
