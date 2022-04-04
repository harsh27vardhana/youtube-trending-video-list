const {deleteAllVideos,getAllVideos,updateAllVideoDetails,insertAllVideos} = require('../../models/video.model')
const fetch = require('node-fetch');
const apiKey = "AIzaSyB1HrKMicwPLfXolSUdo3rJ1UNKwtE_bJ4"
const youtubeApi =  `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=IN&maxResults=45&key=${apiKey}&fields=items(id,snippet(channelId,title))`



async function httpUpdateDataBase(req,res){

 try{
   const rawData = await fetch(youtubeApi);
   const jsonData = await rawData.json();
   const items = jsonData['items'];
   let processedData = [];
   const n = Object.keys(items).length;
   for(var i = 0; i < n; i++){
     let v = {'_id' : `${items[i]['id']}`,'channelId' : `${items[i]['snippet']['channelId']}`,'title' : `${items[i]['snippet']['title']}`};
     processedData.push(v);
   }
    const videosToBeDeleted  = [];
    const videosToBeUpdated = [];
    const videosToBeInserted = [];
    const allvideos = await getAllVideos();
    allvideos.forEach((a)=>{
        let check =  false;
        processedData.forEach((b)=>{
            if(b['_id'] == a['_id'])
                check = true;
        });

        if(!check)
            videosToBeDeleted.push(a);
        else
            videosToBeUpdated.push(a);

    });

    processedData.forEach((a)=>{
        let check = false;
        videosToBeUpdated.forEach((b)=>{
            if(b['_id'] == a['_id'])
                check = true;
        });
        
        if(!check)
            videosToBeInserted.push(a);
    })

    
    Promise.all([deleteAllVideos(videosToBeDeleted),updateAllVideoDetails(videosToBeUpdated),insertAllVideos(videosToBeInserted)]).then((value)=>{
        res.status(200).send('operation succesfull');
    });
    
    return;
   
}catch(err){
    console.log(err);
    return res.status(500).send();
}


  
}



module.exports = {
    httpUpdateDataBase
}
