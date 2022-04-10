const {deleteAllVideos,getAllVideos,updateAllVideoDetails,insertAllVideos} = require('../../models/video.model')
const fetch = require('node-fetch');

const apiKey = 'AIzaSyAUQZnVtSElidc9BDWmMUoTVUCISEnpIOU'
const youtubeApi =  `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=IN&maxResults=45&key=${apiKey}&items(id,snippet(channelId,channelTitle,title,description,thumbnails),contentDetails(duration),statistics(viewCount,likeCount))`



async function httpUpdateDataBase(req,res){

 try{
    const [items,allvideos] = await Promise.all([fetch(youtubeApi).then(async (a)=>{
        const b = await a.json();
        return b['items']
    }),getAllVideos()]);
   //const jsonData = await rawData.json();
   //const items = jsonData['items'];
  // console.log(items);
   let processedData = [];
   const st1 = new Set()
   const st2 = new Set();
   const n = Object.keys(items).length;
   for(var i = 0; i < n; i++){
     let v = {'_id' : items[i]['id'],'channelId' : items[i]['snippet']['channelId'],'title' : items[i]['snippet']['title'],'channelTitle': items[i]['snippet']['channelTitle'],'thumbnails' :items[i]['snippet']['thumbnails'],'duration' : items[i]['contentDetails']['duration'],'views': items[i]['statistics']['viewCount'],'likes': items[i]['statistics']['likeCount'],'videoUrl': `https://www.youtube.com/watch?v=${items[i]['id']}`,'description': items[i]['snippet']['description']};
     processedData.push(v);
     st1.add(v['_id']);
   }
  // console.log(processedData);
    const videosToBeDeleted  = [];
    const videosToBeUpdated = [];
    const videosToBeInserted = [];
    
    allvideos.forEach((a)=>{
        if(st1.has(a['_id'])){
            videosToBeUpdated.push(a);
            st2.add(a['_id']);
        }
        else
            videosToBeDeleted.push(a);

    });

    processedData.forEach((a)=>{        
        if(!st2.has(a['_id']))
            videosToBeInserted.push(a);
    })

    
    Promise.all([deleteAllVideos(videosToBeDeleted),updateAllVideoDetails(videosToBeUpdated),insertAllVideos(videosToBeInserted)]).then((value)=>{
        st1.clear();
        st2.clear();
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
