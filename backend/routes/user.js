import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch(err) {
        console.error('Error getting users', err);
        res.status(500).json({ response: 'Internal server error' });
    }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
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

// Create a new user
router.post('/', (req, res) => {
    const { username, email, password, role } = req.body;
    const user = new User({ username, email, password, role });

    user.save()
        .then(data => {
            res.status(200).json(data);
        }).catch(err => {
            console.log(err);
            res.status(500).json({ response: 'Internal server error' });
        });
});

// Update a user
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

export default router;
