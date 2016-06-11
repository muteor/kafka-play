const kafka = require('kafka-node');
const client = new kafka.Client();

client.on('ready', () => {
    client.loadMetadataForTopics(['wiki'], (err, data) => {
        if (err) {
            console.log('ERROR: ', err);
            return;
        }
        console.log(JSON.stringify(data, null, '  '));
    });
});
