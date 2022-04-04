const { MongoClient } = require("mongodb");

const url = "mongodb+srv://dbuser:user_1234@cluster0.8lit2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
let database;
async function dbConnect() {

    return new Promise(async (resolve, reject) => {
        try {
            const client = new MongoClient(url);
            await client.connect();
            database = client.db();
            resolve('DB Connected');
        } catch (err) {
            console.log(err);
            reject(err);
        }

    }
    )
}


function dbClient(){
    return database;
}


async function deleteAllVideos(videos) {
    return new Promise(async (resolve, reject) => {
        try {
            const db =  dbClient();
            const collection = await db.collection("trendingVideos");
           await  videos.map(id => {
                collection.deleteOne({ _id: id['_id'] });
            });

            resolve("sucess");
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}


async function getAllVideos() {
    return new Promise(async (resolve, reject) => {
        try {
            const db = dbClient();
            const collection = await db.collection("trendingVideos");
            let videos=[];
            const data = await collection.find({});
            
            await data.forEach((doc) =>{
                videos.push(doc);
            });
            resolve(videos);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}
async function insertAllVideos(videos) {
    return new Promise(async (resolve, reject) => {
        try {
            const db = dbClient();
            const collection = await db.collection("trendingVideos");
            await videos.map(video =>{
                 collection.insertOne(video)
            })

            resolve("sucess");
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}


async function updateAllVideoDetails(videos) {
    return new Promise(async (resolve, reject) => {
        try {
            const db = dbClient();
            const collection = await db.collection("trendingVideos");
            const tobeResolved = [];
            videos.map(video =>{

               tobeResolved.push( collection.replaceOne({_id: video['_id']},video) );
            });
            Promise.all(tobeResolved).then((values)=>{
                resolve('sucess');
            })
            
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}


async function getVideo(id) {
    return new Promise(async (resolve, reject) => {
        try {
            const db = dbClient();
            const collection = await db.collection("trendingVideos");
            const data = await collection.findOne({_id:id});
            resolve(data);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}


module.exports = {
    deleteAllVideos, getAllVideos, insertAllVideos, updateAllVideoDetails,getVideo,dbConnect

}


/*{
   'id':"dsjknvds",
   "channel id":"cdvcdncd",
   "video title":"cd"

}*/