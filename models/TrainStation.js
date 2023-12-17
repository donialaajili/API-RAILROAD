import mongoose from "mongoose";

const trainStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
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

export default mongoose.model('TrainStation', trainStationSchema);
