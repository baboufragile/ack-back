import {makeFile} from "./function.js";
import fastify from 'fastify';

const server = fastify()
// Declare a route
server.post('/', makeFile)

// Run the server!
const start = async () => {
    try {
        await server.server.listen(3000)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()