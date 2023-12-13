import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const router = express.Router();

// Endpoint pour s'inscrire
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', process.env.PASS_SEC, iv);
    let encryptedPassword = cipher.update(password, 'utf-8', 'hex');
    encryptedPassword += cipher.final('hex');

    const newUser = new User({
      username,
      email,
      password: encryptedPassword,
      iv: iv.toString('hex'),
      role
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ response: 'Internal server error: ' + err.message });
  }
});

// Endpoint pour se connecter
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(401).json('Wrong user name');
    }

    const decipher = createDecipheriv(
      'aes-256-cbc',
      process.env.PASS_SEC,
      Buffer.from(user.iv, 'hex')
    );

    let decryptedPassword = decipher.update(user.password, 'hex', 'utf-8');
    decryptedPassword += decipher.final('utf-8');

    if (decryptedPassword !== password) {
      res.status(401).json('Wrong password');
    }

    const accessToken = jwt.sign(
      {
        role: user.role,
        id: user._id
      },
      process.env.JWT_SEC,
      { expiresIn: '3d' }
    );

    const { password: _, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json({ response: 'Internal server error: ' + err.message });
  }
});

export default router;