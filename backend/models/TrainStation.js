import mongoose from "mongoose";

const trainStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  open_hour: {
    type: String,
    required: true
  },
  close_hour: {
    type: String,
    required: true
  },
  image: {
    type: Buffer // Storing the image as a Buffer
  }
});

const TrainStation = mongoose.model('TrainStation', trainStationSchema);

module.exports = TrainStation;

