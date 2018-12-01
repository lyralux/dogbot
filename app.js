const restify = require('restify');
const builder = require('botbuilder');
require('dotenv').config();
const bot = require('./bot.js');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

server.post('/api/messages', bot.connector('*').listen());
