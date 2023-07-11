import Fastify from 'fastify'
import process from "process";
import { v4 as uuidv4 } from 'uuid';
import {sendMessage} from "./mqtt.js";
const fastify= Fastify({
  logger: true
})


function generateUUID() {
  return uuidv4();
}

fastify.get('/', async function handler (request, reply) {
  const messages = {
    sink_id: "sink1",
    source_address: 1005865590,
    sensor_id: 115,
    tx_time_ms_epoch: 1688397333,
    data: {"motion": 0},
    event_id: 43
  }
  sendMessage('adrien-topic/a4be12de-12c1-4e29-bd28-7e7e8a1fe765/115', JSON.stringify(messages));
})

fastify.post('/sensor', (request, reply) => {
  const data = request.body;
  const gatewayId = data.gatewayId;
  const topic = `groupe3/request/${gatewayId}`
  const message = {
    cmd_id: Math.floor(Math.random() * (1000000 - 1)) + 1,
    destination_address: data.nodeId,
    ack_flags: 0,
    cmd_type: data.cmdType,
  };

  console.log(message);
  reply.code(200).send({ message: 'Message reçu avec succès' });
  sendMessage(topic, JSON.stringify(message));
})

try {
  await fastify.listen({ port: 8585 });
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
