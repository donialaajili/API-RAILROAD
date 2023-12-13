import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  startStation: {
    type: String,
    required: true,
  },
  endStation: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
});


export default mongoose.model('Ticket', ticketSchema);
