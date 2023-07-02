const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  name: {
    type: String // Store the location name/address as a string
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
        type: String // Store the location name/address as a string
      },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

photoSchema.index({ location: '2dsphere' });

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
