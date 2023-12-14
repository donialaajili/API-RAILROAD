import express from 'express';
import Ticket from '../models/Ticket.js';
import Joi from 'joi';
import { verifyToken, verifyTokenAndAuthorizationAndAdmin, verifyTokenAndAuthorization, verifyTokenAndAdmin } from '../middlewares/verifyToken.js';

const router = express.Router();

// Define the Joi schema for the ticket data
const TicketSchema = Joi.object({
    startStation: Joi.string().required(),
    endStation: Joi.string().required(),
    date: Joi.date().iso().required(),
    
  });
  

router.post('/', verifyToken, async (req, res) => {
    try {
      // Validate the request body against the schema
      const { error, value } = TicketSchema.validate(req.body);
  
      if (error) {
        // If validation fails, respond with a 400 Bad Request and error details
        return res.status(400).json({ error: error.details[0].message });
      }
  
      // If validation passes, create a new ticket using Mongoose
      const ticket = new Ticket({
        startStation: value.startStation,
        endStation: value.endStation,
        date: value.date,
        // Add other relevant fields to create
      });
  
      // Save the ticket to the database
      const savedTicket = await ticket.save();
  
      // Respond with a success message and the created ticket
      res.json({ message: 'Ticket created successfully', ticket: savedTicket });
    } catch (error) {
      // Handle any internal server errors
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  export default router;