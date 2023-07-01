const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    image:[{
        url:{
          type:String
        },
        filename:{
          type:String
        }
      }],
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

photoSchema.index({ location: '2dsphere' });

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
