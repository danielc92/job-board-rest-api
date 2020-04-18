const redis = require("redis")
const client = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST
)

client.on("error", function (error) {
  console.error(error)
})

client.on("connect", function () {
  console.log("Successfully connected to redis client.")
})

module.exports = client
