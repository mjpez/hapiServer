import { Server } from "hapi"
import { db, User } from "./db/models/user"

const server = new Server({
  host: "localhost",
  port: 8000,
})

server.route({
  method: "GET",
  path: "/hello",
  handler: () => "hello world",
})

server.route({
  method: "GET",
  path: "/hello/{username}",
  handler: async (request, h) => {
    const foundUser = await User.findOne({
      where: { name: request.params.username },
    })

    console.log("foundUser")

    if (!foundUser) {
      throw new Error("Not Found")
    }

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
    if (isRequestPayloadNumber(request.payload)) {
      console.log("payload number OK", request.payload.number)
      console.log("request method ->", request.method)
      return request.payload.number
    } else {
      return "Bad Payload"
    }
  },
})

interface RequestPayloadNumber {
  number: number
}

function isRequestPayloadNumber(val: any): val is RequestPayloadNumber {
  return val && val.number && typeof val.number === "number"
}

server.route({
  method: "POST",
  path: "/add",
  handler: async request => {
    if (isRequestPayloadUser(request.payload)) {
      const now = new Date()
      return User.create({
        ...request.payload,
        createdAt: now,
        updatedAt: now,
      })
    } else {
      return "Bad Payload"
    }
  },
})

interface RequestPayloadUser {
  name: string
  password: string
}

function isRequestPayloadUser(val: any): val is RequestPayloadUser {
  return (
    val &&
    val.name &&
    typeof val.name === "string" &&
    val.password &&
    typeof val.password === "string"
  )
}

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
