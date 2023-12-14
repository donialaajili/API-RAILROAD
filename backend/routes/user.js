import express from 'express';
import User from '../models/User.js';
import { verifyToken, verifyTokenAndAuthorizationAndAdmin, verifyTokenAndAuthorization, verifyTokenAndAdmin } from '../middlewares/verifyToken.js';
import Joi from 'joi';

const router = express.Router();

const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().required()
});

// Get all users
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error getting users', err);
    res.status(500).json({ response: 'Internal server error' });
  }
});

// Get a specific user by ID
router.get('/:id', verifyTokenAndAuthorizationAndAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error getting user', err);
    res.status(500).json({ response: 'Internal server error' });
  }
});

// Update a user
router.put('/:id', verifyTokenAndAuthorizationAndAdmin, async (req, res) => {
  const { id } = req.params;
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    // If validation fails, respond with a 400 Bad Request and error details
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username: value.username,
        email: value.email,
        password: value.password,
        role: value.role
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error updating user', err);
    res.status(500).json({ response: 'Internal server error' });
  }
});

// Delete a user by id
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user', err);
    res.status(500).json({ response: 'Internal server error' });
  }
})

export default router;
