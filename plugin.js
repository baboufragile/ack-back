import {makeFile} from "./function.js";
import Fastify from'fastify';

const fastify = Fastify()
// Declare a route
fastify.post('/', makeFile)

// Run the server!
const start = async () => {
    try {
        await fastify.listen(3000)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()