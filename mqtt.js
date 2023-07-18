import mqtt from 'mqtt';
import fetch from 'node-fetch';
import config from "config";

const brokerUrl = 'mqtt://mqtt.arcplex.fr';
const port = 2295;
const topic = 'groupe3/packet/#';

const client = mqtt.connect(brokerUrl, {
  port,
  username: 'groupe3',
  password: '8ae3V7skJoIs',
});

client.on('connect', () => {
  client.subscribe([topic], function (err) {
    if (err) {
      console.log(topic, err)
    }
  })
});

client.on('message', (topic, message) => {
  const msg = message.toString()
  processMessage(msg, topic);
});

function processMessage(message, topic) {
  const url = config.get('api_symfony');
  const data = {
    message: message,
    topic: topic
  }
  console.log(topic, ' : Traitement du message : ', data);
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {
      if (response.ok) {
        console.log('Message envoyé avec succès à l\'URL :', url);
        return response.json()
      } else {
        console.error('Erreur lors de l\'envoi du message à l\'URL :', url);
      }
    })
    .then(data => {
      console.log('Réponse JSON :', data);
    })
    .catch(error => {
      console.error('Erreur lors de l\'envoi du message à l\'URL :', url, error);
    });
}

export function sendMessage(topic, message) {
  client.publish(topic, message);
}

client.on('error', (error) => {
  console.error('Erreur de connexion MQTT :', error);
  client.reconnect();
});

