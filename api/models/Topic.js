/**
* Topic.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    'description': 'string',
    photos:{
      collection:'photo',
      via: 'topic'
    },
    tribes: {
      collection: 'tribe',
      via: 'topics'
    }
  }
};
