"use strict";

const builder = require("botbuilder");
const Store = require('./store');

// Bot Storage: Here we register the state storage for your bot. 
// Default store: volatile in-memory store - Only for prototyping!
// We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
// For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
const inMemoryStorage = new builder.MemoryBotStorage();

const bot = new builder.UniversalBot(
    new builder.ChatConnector({
        appId: process.env.MICROSOFT_APP_ID,
        appPassword: process.env.MICROSOFT_APP_PASSWORD
    })
).set('storage', inMemoryStorage);

const recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

bot.dialog('FindDogBreedSize', [
    function (session, args, next) {
        session.send('Welcome to the Dog breed weight finder! We are analyzing your message: \'%s\'', session.message.text);

        // try extracting entities
        const dogBreedEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'DogBreed');
        if (dogBreedEntity) {
            // DogBreed entity detected, continue to next step
            session.dialogData.searchType = 'breed';
            next({ response: dogBreedEntity.entity });
        } else {
            builder.Prompts.text(session, 'Please enter your dog breed');
        }
    },
    function (session, results) {
        let dogBreed = results.response;
        let message = 'Looking for the weight of a %s...';

        session.send(message, dogBreed);

        // Async search
        Store
            .searchDogBreeds(dogBreed)
            .then(function (breeds) {
                // args

                if(!breeds){
                    session.send("We couldn't find any information for %s in our system! Check your spelling and try again", dogBreed);
                } else {
                    session.send('The weight of a %s is about %d lbs', breeds.Breed, breeds.Weight);
                }
                // End
                session.endDialog();
            });
    }
]).triggerAction({
    matches: 'FindDogBreedSize',
    onInterrupted: function (session) {
        session.send('Please provide a dog breed');
    }
});


module.exports = bot;
