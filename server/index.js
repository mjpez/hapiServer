"use strict"

const Hapi = require("hapi")
const { db, User } = require("./db/models/user")

const server = Hapi.server({
  host: "localhost",
  port: 8000,
})

server.route({
  method: "GET",
  path: "/hello",
  handler: function(request, h) {
    return "hello world"
  },
})

server.route({
  method: "GET",
  path: "/hello/{username}",
  handler: (request, h) => {
    return User.findOne({ where: { name: request.params.username } })
      .then(foundUser => {
        const data = JSON.stringify(foundUser)
        console.log(data)
        return data
      })
      .catch()
  },
})

server.route({
  method: "POST",
  path: "/payloadOK",
  config: {
    handler: function(request, reply) {
      console.log("payload number OK", request.payload.number)
      console.log("request method ->", request.method)
      reply("End")
    },
  },
})

server.route({
  method: "POST",
  path: "/add",
  config: {
    handler: (request, h) => {
      return User.create({
        name: request.payload.name,
        password: request.payload.password,
      })
        .then(newUser => {
          console.log(JSON.stringify(newUser))
          return JSON.stringify(newUser)
        })
        .catch()
    },
  },
})

async function start() {
  try {
    await server.start()
    await db.sync()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }

  console.log("Server running at:", server.info.uri)
}

start()
