import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  train: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Train',
    required: true,
  },
 
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },

  date: {
    type: Date,
    required: true,
  }
});


export default mongoose.model('Ticket', ticketSchema);
