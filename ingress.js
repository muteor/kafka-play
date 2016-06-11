const io = require('socket.io-client');
const socket = io.connect('stream.wikimedia.org/rc');
const kafka = require('kafka-node');
const Producer = kafka.Producer;
const client = new kafka.Client();
const producer = new Producer(client, {partitionerType: Producer.PARTITIONER_TYPES.keyed});

const TOPIC = 'wiki-ingress';
let producerReady = false;

producer.on('ready', () => {
    console.log('Producer ready');
    producer.createTopics([TOPIC], false, (err) => {
        if (err) {
            console.log('Failed to create topic', err);
            process.exit(1);
        }
        setTimeout(() => {
            producerReady = true;
            console.log('Created topic');
        }, 500);
    });
});

producer.on('error', (err) => {
    console.log('Kafka Err: ', err);
});

socket.on('connect', () => {
     socket.emit('subscribe', 'commons.wikimedia.org');
});

socket.on('change', (data) => {
    if (!producerReady) {
        console.log('waiting for kafka');
        return;
    }
    
    producer.send([{topic: TOPIC, messages: [JSON.stringify(data)], key: String(data.id)}], (err, ack) => {
        console.log('SEND', err, ack);
    });
});
