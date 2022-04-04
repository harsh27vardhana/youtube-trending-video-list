const {getAllVideos} = require('../../models/video.model');

async function httpVideoList(req,res){
    try{
        
        const videoList = await getAllVideos();
        return res.status(200).send(videoList);

    }catch(err){
        
        console.log(err);
        return res.status(500).send();
    }
}

module.exports = {
    httpVideoList
}