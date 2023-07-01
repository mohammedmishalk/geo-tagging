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
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

photoSchema.index({ location: '2dsphere' });

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
