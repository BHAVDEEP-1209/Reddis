const express = require("express");
const cors = require("cors");
const axios = require("axios");
const redisClient = require("./config/Redis.js")

const DEFAULT_EXPIRATION = 5;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/photos", async (req, res) => {
    const photos = await getOrSetCache("photos",async()=>{
            const { data } = await axios.get(
                "https://jsonplaceholder.typicode.com/posts"
            );
            return data;
    })
    res.json(photos);
});

app.get("/photos/:id", async (req, res) => {
  const id = req.params.id;
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  res.json(data);
});


function getOrSetCache(key,cb){
    return new Promise(async(resolve,reject)=>{
        try {
            const data = await redisClient.get(key);
            if(data!=null)return resolve(JSON.parse(data));
            const freshData = await cb();
            redisClient.setEx(key,DEFAULT_EXPIRATION,JSON.stringify(freshData));
            return resolve(freshData)
        } catch (error) {
            return reject(error);
        }
    })
}

app.listen(5000, (err) => {
  if (err) {
    console.log("Error while connecting!");
  } else {
    console.log("server started!");
  }
});
