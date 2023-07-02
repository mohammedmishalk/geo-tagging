const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  name: {
    type: String 
  },
    image:[{
        url:{
          type:String
        },
        filename:{
          type:String
        }
      }],
      location: {
        type: String 
      },
      userid:{
         type:String
      },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

photoSchema.index({ location: '2dsphere' });

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
