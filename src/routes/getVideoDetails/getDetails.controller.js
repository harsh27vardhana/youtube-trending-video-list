const {getVideo} = require('../../models/video.model');
const fetch = require('node-fetch');
const key = `AIzaSyB1HrKMicwPLfXolSUdo3rJ1UNKwtE_bJ4`;

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
        const videoData = await getVideo(id);
        if(videoData != null){
            const videoMeta = videoData;
            let a = await fetch(videoApiUrl(videoMeta['_id']));
            let b = await fetch(channelApiUrl(videoMeta['channelId']));
            a = await a.json();
            b =await b.json();
            let videoDetails = {
                videoData : {
                    title : videoMeta['title'],
                    description : a['items'][0]['snippet']['description'],
                    videoUrl : `https://www.youtube.com/watch?v=${videoMeta['_id']}`,
                    thumbnails : a['items'][0]['snippet']['thumbnails'],
                    views : a['items'][0]['statistics']['viewCount'],
                    likes : a['items'][0]['statistics']['likeCount']
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