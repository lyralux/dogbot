var Promise = require('bluebird');

const dogBreedData = require('./dogBreedData');



module.exports = {
    searchDogBreeds: function (breed) {
        return new Promise(function (resolve) {

            let dogData = dogBreedData;

            let result = dogData.find( search => search.Breed.toLowerCase() == breed.toLowerCase() );


            // complete promise with a timer to simulate async response
            setTimeout(function () { resolve(result); }, 1000);
        });
    },
};