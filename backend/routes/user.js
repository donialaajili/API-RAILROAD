import express from 'express';
import User from '../models/User.js';
import { verifyToken, verifyTokenAndAuthorizationAndAdmin, verifyTokenAndAuthorization, verifyTokenAndAdmin } from '../middlewares/verifyToken.js';
import Joi from 'joi';

const router = express.Router();

const userSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  
 // router.post('/register', async (req, res) => {
 //   const { error, value } = userSchema.validate(req.body);
  
 //   if (error) {
 //     return handleValidationError(res, error);
 //   }
  
    
 // });

// Get all users
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch(err) {
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
    } catch(err) {
        console.error('Error getting user', err);
        res.status(500).json({ response: 'Internal server error' });
    }
});

// Update a user
router.put('/:id', verifyTokenAndAuthorizationAndAdmin, async (req, res) => {
    const { id }  = req.params;
    const { username, email, password, role } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, email, password, role },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch(err) {
        console.error('Error updating user', err);
        res.status(500).json({ response: 'Internal server error' });
    }
});

// Delete a user by id
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    const { id }  = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully'});
    } catch(err) {
        console.error('Error deleting user', err);
        res.status(500).json({ response: 'Internal server error' });
    }
})

// Endpoint to delete the user's own account
router.delete('/delete-account', verifyToken, async (req, res) => {
    const userIdToDelete = req.user._id; 
  
    try {
      
      if (userIdToDelete.toString() !== req.params.id) {
        return res.status(403).json({ error: 'Permission denied. Cannot delete other users.' });
      }
  
      
      const deletedUser = await User.findByIdAndDelete(userIdToDelete);
  
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      res.json({ message: 'Account deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

 // Update user endpoint
router.put('/update', verifyToken, async (req, res) => {
    const { username, email } = req.body;
    const userId = req.user.id; 
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      
      if (req.user.role === 'admin' || req.user.id === userId) {
        
        user.username = username || user.username;
        user.email = email || user.email;
  
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
      } else {
        
        return res.status(403).json({ error: 'Permission denied. Only admins or the user can update this account.' });
      }
    } catch (error) {
      console.error('Error updating user', error);
      res.status(500).json({ response: 'Internal server error' });
    }
  });

  // Get user information endpoint
router.get('/info', verifyToken, async (req, res) => {
    const userId = req.user.id; 
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      
      if (req.user.role === 'admin') {
        
        return res.status(200).json(user);
      } else {
        
        const { _id, username, email } = user;
        return res.status(200).json({ _id, username, email });
      }
    } catch (error) {
      console.error('Error getting user information', error);
      res.status(500).json({ response: 'Internal server error' });
    }
  });
  
   

export default router;
