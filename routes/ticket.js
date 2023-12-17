import express from 'express';
import Ticket from '../models/Ticket.js';
import Train from '../models/Train.js';
import User from '../models/User.js';
import Joi from 'joi';
import { verifyToken, verifyTokenAndAuthorizationAndAdmin, verifyTokenAndAuthorization, verifyTokenAndAdmin } from '../middlewares/verifyToken.js';

const router = express.Router();

// Define the Joi schema for the ticket data
const TicketSchema = Joi.object({
  train: Joi.string().required(),
  user: Joi.string().required(),
  date: Joi.date().iso().required()

});

// Get all tickets
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('train').populate('user');
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ response: 'Internal server error' });
  }
});

// Get a single ticket by id
router.get('/:id', verifyTokenAndAdmin, (req, res) => {
  const id = req.params.id;

  Ticket.findById(id)
    .populate('train')
    .populate('user')
    .then(data => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(400).json({ response: `Could not find ticket with id ${id}` });
      }
    }).catch(err => {
      console.log(err);
      res.status(500).json({ response: 'Internal server error' });
    });
});

router.post('/', verifyToken, async (req, res) => {
  try {
    // Validate the request body against the schema
    const { error, value } = TicketSchema.validate(req.body);

    if (error) {
      // If validation fails, respond with a 400 Bad Request and error details
      return res.status(400).json({ error: error.details[0].message });
    }

    // check if the train exist
    const train = await Train.findById(value.train);
    if (!train) {
      return res.status(404).json({ message: `Train ${value.train} not found` });
    }

    // check if the user exist
    const user = await User.findById(value.user);
    if (!user) {
      return res.status(404).json({ message: `User ${value.user} not found` });
    }

    // If validation passes, create a new ticket using Mongoose
    const ticket = new Ticket({
      train: value.train,
      user: value.user,
      date: value.date
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

// Update a ticket by id
router.put('/:id', verifyTokenAndAdmin, async(req, res) => {
  const id = req.params.id;
  const { error, value } = TicketSchema.validate(req.body);

  if (error) {
    // If validation fails, respond with a 400 Bad Request and error details
    return res.status(400).json({ error: error.details[0].message });
  }

   // check if the train exist
   const train = await Train.findById(value.train);
   if (!train) {
     return res.status(404).json({ message: `Train ${value.train} not found` });
   }

   // check if the user exist
   const user = await User.findById(value.user);
   if (!user) {
     return res.status(404).json({ message: `User ${value.user} not found` });
   }

  Ticket.findByIdAndUpdate(id, {
    train: value.train,
    user: value.user,
    date: value.date
  },
    { new: true })
    .then(data => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(400).json({ response: `Could not find ticket with id ${id}` });
      }
    }).catch(err => {
      console.log(err);
      res.status(500).json({ response: 'Internal server error' });
    });
});

// Delete a train by id
router.delete('/:id', verifyTokenAndAdmin, (req, res) => {
  const id = req.params.id;

  Ticket.findByIdAndDelete(id)
    .then(data => {
      if (data) {
        res.status(200).json({ response: `Ticket with id ${id} has been deleted` });
      } else {
        res.status(400).json({ response: `Could not find ticket with id ${id}` });
      }
    }).catch(err => {
      console.log(err);
      res.status(500).json({ response: 'Internal server error' });
    });
});

export default router;