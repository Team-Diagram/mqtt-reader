import mqtt from 'mqtt';
import fetch from 'node-fetch'

const brokerUrl = 'mqtt://test.mosquitto.org';
const clientId = 'client-adrien';
const port = 1883;
const topic = 'adrien-topic'

const client = mqtt.connect(brokerUrl, {
  clientId,
  port
});

client.on('connect', () => {
  client.subscribe([topic], function (err) {
    if (err) {
      console.log(topic, err)
    }
  })
});

client.on('message', (topic, message) => {
  const msg = message.toString();
  processMessage(msg, topic);
});

function processMessage(message, topic) {
  console.log(topic, ' : Traitement du message : ', message);
  const url = 'http://localhost:8787/sensor';
  const data = {
    message: message,
    topic: topic
  };
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

function sendMessage(topic, message) {
  client.publish(topic, message);
}

client.on('error', (error) => {
  console.error('Erreur de connexion MQTT :', error);
  client.reconnect();
});

function connectToBroker() {
  client.reconnect();
}

function subscribeToTopic(topic) {
  client.subscribe(topic);
}

function stopMessageLoop() {
  client.removeAllListeners('message');
}

function unsubscribeFromTopic(topic) {
  client.unsubscribe(topic);
}

function disconnectFromBroker() {
  client.end();
}

export {
  subscribeToTopic,
  stopMessageLoop,
  unsubscribeFromTopic,
  disconnectFromBroker,
  connectToBroker,
  sendMessage,
};
