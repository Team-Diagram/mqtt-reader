import 'websocket-polyfill';
import Paho from 'paho-mqtt';

const brokerUrl = 'ws://test.mosquitto.org/';
const clientId = 'client-adrien';
const port = 8080;

const client = new Paho.mqtt.Client(brokerUrl, port, clientId);

client.onConnectionLost = (responseObject) => {
  if (responseObject.errorCode !== 0) {
    console.log(`Connexion perdue : ${responseObject.errorMessage}`);
  }
};

client.onMessageArrived = (message) => {
  console.log(`Message reçu : ${message.payloadString}`);

  processMessage(message);
};

function connectToBroker() {
  client.connect({
    onSuccess: () => {
      console.log('Connecté au broker MQTT');
    },
    onFailure: (err) => {
      console.error('Erreur de connexion MQTT :', err);
    }
  });
}

function sendMessage(topic, message) {
  client.send(topic, message);
}

function subscribeToTopic(topic) {
  client.subscribe(topic);
}

function processMessage(message) {
  console.log('Traitement du message :', message);
}

function stopMessageLoop() {
  client.onMessageArrived = null;
}

function unsubscribeFromTopic(topic) {
  client.unsubscribe(topic);
}

function disconnectFromBroker() {
  client.disconnect();
}

export {
  subscribeToTopic,
  stopMessageLoop,
  unsubscribeFromTopic,
  disconnectFromBroker,
  connectToBroker,
  sendMessage,
};
