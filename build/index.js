"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hapi_1 = require("hapi");
const user_1 = require("./db/models/user");
const server = new hapi_1.Server({
    host: "localhost",
    port: 8000,
});
server.route({
    method: "GET",
    path: "/hello",
    handler: () => "hello world",
});
server.route({
    method: "GET",
    path: "/hello/{username}",
    handler: async (request, h) => {
        const foundUser = await user_1.User.findOne({
            where: { name: request.params.username },
        });
        console.log("foundUser");
        if (!foundUser) {
            throw new Error("Not Found");
        }
        const response = h.entity({ etag: foundUser.updatedAt.toISOString() });
        if (response) {
            console.log("Etag valid");
            return response;
        }
        console.log("Etag invalid or undefined");
        return foundUser;
    },
});
server.route({
    method: "POST",
    path: "/payload-test",
    handler: request => {
        if (isRequestPayloadNumber(request.payload)) {
            console.log("payload number OK", request.payload.number);
            console.log("request method ->", request.method);
            return request.payload.number;
        }
        else {
            return "Bad Payload";
        }
    },
});
function isRequestPayloadNumber(val) {
    return val && val.number && typeof val.number === "number";
}
server.route({
    method: "POST",
    path: "/add",
    handler: async (request) => {
        if (isRequestPayloadUser(request.payload)) {
            const now = new Date();
            return user_1.User.create(Object.assign({}, request.payload, { createdAt: now, updatedAt: now }));
        }
        else {
            return "Bad Payload";
        }
    },
});
function isRequestPayloadUser(val) {
    return (val &&
        val.name &&
        typeof val.name === "string" &&
        val.password &&
        typeof val.password === "string");
}
async function start() {
    try {
        await server.start();
        await user_1.db.sync();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    finally {
        console.log("Server running at:", server.info.uri);
    }
}
start();
