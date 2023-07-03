import Fastify from 'fastify'
import process from "process";
import {disconnectFromBroker, connectToBroker, sendMessage} from "./mqtt.js"
const fastify = Fastify({
  logger: true
})

fastify.get('/', async function handler (request, reply) {
  const messages = {
    sink_id: "sink1",
    source_address: 1005865590,
    sensor_id: 115,
    tx_time_ms_epoch: 1688397333,
    data: {"motion": 0},
    event_id: 43
  }
  messages.node_id = 'a4be12de-12c1-4e29-bd28-7e7e8a1fe765';
  sendMessage('adrien-topic', JSON.stringify(messages));
})

try {
  await fastify.listen({ port: 8585 });
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
