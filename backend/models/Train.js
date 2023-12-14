import mongoose from "mongoose";

const TrainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  start_station: {
    type: String,
    ref: 'station',
    required: true
  },
  end_station: {
    type: String,
    ref: 'station',
    required: true
  },
  time_of_departure: {
    type: Date,
    required: true
  }
});

export default mongoose.model('Train', TrainSchema);

