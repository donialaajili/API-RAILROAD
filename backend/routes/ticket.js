import Ticket from './models/Ticket';
import express from 'express';
import Joi from 'joi';


// Define the Joi schema for the ticket data
const Ticket = Joi.object({
    startStation: Joi.string().required(),
    endStation: Joi.string().required(),
    date: Joi.date().iso().required(),
    // Add other relevant fields to validate
  });
  

router.post('/create-ticket', async (req, res) => {
    try {
      // Validate the request body against the schema
      const { error, value } = Ticket.validate(req.body);
  
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