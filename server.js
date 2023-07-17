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
    source_address: "d3b13593-ea5c-4514-85dc-91f8873fe478",
    sensor_id: 136,
    tx_time_ms_epoch: 1688397333,
    data: {"adc": 1},
  }
  sendMessage('groupe3/packet/d3b13593-ea5c-4514-85dc-91f8873fe478/86237e63-89cf-45d3-b61a-dc0c592aee09/136', JSON.stringify(messages));
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
