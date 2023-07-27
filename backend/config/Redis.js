const Redis = require("redis");

let redisClient;

(async()=>{
    redisClient = Redis.createClient();
    redisClient.on("error",(error)=> console.error(`Error ${error}`));
    await redisClient.connect()
})()

module.exports = redisClient;