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
  handler: async (request, h) => {
    const foundUser = await User.findOne({
      where: { name: request.params.username },
    })

    console.log("foundUser")

    const response = h.entity({ etag: foundUser.updatedAt.toISOString() })
    if (response) {
      console.log("Etag valid")
      return response
    }

    console.log("Etag invalid or undefined")

    return foundUser
  },
})

server.route({
  method: "POST",
  path: "/payload-test",
  handler: request => {
    console.log("payload number OK", request.payload.number)
    console.log("request method ->", request.method)
    return request.payload.number
  },
})

server.route({
  method: "POST",
  path: "/add",
  handler: async request => {
    const newUser = await User.create({
      name: request.payload.name,
      password: request.payload.password,
    })
    return JSON.stringify(newUser)
  },
})

async function start() {
  try {
    await server.start()
    await db.sync()
  } catch (err) {
    console.log(err)
    process.exit(1)
  } finally {
    console.log("Server running at:", server.info.uri)
  }
}

start()
