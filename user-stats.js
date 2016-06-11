'use strict';

const kafka = require('kafka-node');
const AsciiTable = require('ascii-table');
const HighLevelConsumer = kafka.HighLevelConsumer;
const Client = kafka.Client;
const client = new Client('localhost:2181');

const topics = [{ topic: 'wiki-ingress' }];
const options = { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024*1024, groupId: 'kafka.wiki' };
const consumer = new HighLevelConsumer(client, topics, options);

const user_events = {};

consumer.on('message', function (message) {
    const event = JSON.parse(message.value);
    user_events[event.user] = user_events[event.user] || {new: 0, edit: 0, categorize: 0};
    user_events[event.user].total = (user_events[event.user].total || 0) + 1;
    user_events[event.user][event.type] = (user_events[event.user][event.type] || 0) + 1;
    
    const table = new AsciiTable('User Stats');
    table.setHeading('User', 'Events', 'New', 'Edit', 'Categorize');
    for (let user of Object.keys(user_events)) {
        table.addRow(user, user_events[user].total, user_events[user].new, user_events[user].edit, user_events[user].categorize);
    }
    table.sortColumn(1, (a, b) => b - a);
    
    process.stdout.write("\x1B[2J");
    console.log(table.toString());
});

consumer.on('error', function (err) {
    console.log('error', err);
});