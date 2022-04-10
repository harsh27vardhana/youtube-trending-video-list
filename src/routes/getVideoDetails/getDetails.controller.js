const {getVideo} = require('../../models/video.model');
const fetch = require('node-fetch');
const key = `AIzaSyAUQZnVtSElidc9BDWmMUoTVUCISEnpIOU`;

function videoApiUrl(id){
    const youtubeVideoApi = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&regionCode=IN&key=${key}&fields=items(snippet(publishedAt,description,thumbnails),statistics)&id=${id}`;
    return youtubeVideoApi;
}

function channelApiUrl(id){
    const youtubeChannelApi = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,statistics&key=${key}&id=${id}&fields=items(id,snippet(title,description,thumbnails),statistics)`;
    return youtubeChannelApi;
}

async function httpGetDetails(req,res){
    try{
        const id = req.query.id;  
        const videoMeta = await getVideo(id);
        if(videoMeta != null){
            let b = await fetch(channelApiUrl(videoMeta['channelId']));
            b =await b.json();
            let videoDetails = {
                videoData : {
                    title : videoMeta['title'],
                    description : videoMeta['description'],
                    videoUrl : videoMeta['videoUrl'],
                    thumbnails : videoMeta['thumbnails'],
                    views : videoMeta['views'],
                    likes : videoMeta['likes']
                },
                channelData : {
                    title : b['items'][0]['snippet']['title'],
                    description : b['items'][0]['snippet']['description'],
                    thumbnails : b['items'][0]['snippet']['thumbnails'],
                    subscriberCount : 0
                }
            };

            if(!b['items'][0]['statistics']['hiddenSubscriberCount']){
                videoDetails['channelData']['subscriberCount'] = b['items'][0]['statistics']['subscriberCount']
            }
          
         res.status(200).send(videoDetails);
        }else{
            res.status(400).send('video does not exist');
        }
        
        return;

    }catch(err){
        
        console.log(err);
        return res.status(500).send();
    }
}

module.exports = {
    httpGetDetails
}