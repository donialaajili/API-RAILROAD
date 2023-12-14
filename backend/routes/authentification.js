import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const router = express.Router();

const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().required()
});

// Endpoint pour s'inscrire
router.post('/register', async (req, res) => {
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    // If validation fails, respond with a 400 Bad Request and error details
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', process.env.PASS_SEC, iv);
    let encryptedPassword = cipher.update(value.password, 'utf-8', 'hex');
    encryptedPassword += cipher.final('hex');

    const newUser = new User({
      username: value.username,
      email: value.email,
      password: encryptedPassword,
      iv: iv.toString('hex'),
      role: value.role
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ response: 'Internal server error: ' + err.message });
  }
});

const userLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

// Endpoint pour se connecter
router.post('/login', async (req, res) => {
  try {
    const { error, value } = userLoginSchema.validate(req.body);

    if (error) {
      // If validation fails, respond with a 400 Bad Request and error details
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await User.findOne({ username: value.username });

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

    if (decryptedPassword !== value.password) {
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