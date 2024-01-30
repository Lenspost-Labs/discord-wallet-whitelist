const { createClient } = require("redis");
const dotenv = require("dotenv");
dotenv.config();

let redisURI = process.env.REDIS_URI;

console.log(redisURI);

const client = createClient({
  url: redisURI,
});

client.on("connect", () => {
  console.log("Redis client connected");
});

client.on("error", (err) => {
  console.log("Something went wrong " + err);
});

module.exports = client;
