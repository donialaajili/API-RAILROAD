const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('./authentification');
const multer = require('multer');
const sharp = require('sharp');
const TrainStation = require('./models/TrainStation'); // Assuming you have a TrainStation model

// Multer setup for handling image uploads
const upload = multer({
  limits: {
    fileSize: 10000000 // 10MB limit
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image file'));
    }
    cb(undefined, true);
  }
});

// Endpoint to list all train stations and allow sorting by name
router.get('/trainstations', async (req, res) => {
  try {
    let stations = await TrainStation.find().sort({ name: 1 });

    res.json(stations);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to create a train station (only for admin)
router.post('/trainstations', requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, open_hour, close_hour } = req.body;
    const imageBuffer = await sharp(req.file.buffer).resize(200, 200).toBuffer();

    const station = new TrainStation({
      name,
      open_hour,
      close_hour,
      image: imageBuffer
    });

    await station.save();

    res.status(201).json(station);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to update a train station (only for admin)
router.put('/trainstations/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, open_hour, close_hour } = req.body;

    const station = await TrainStation.findByIdAndUpdate(
      id,
      { name, open_hour, close_hour },
      { new: true }
    );

    if (!station) {
      return res.status(404).send('Train Station not found');
    }

    res.json(station);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to delete a train station (only for admin)
router.delete('/trainstations/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Consider deleting associated trains or handle accordingly

    const station = await TrainStation.findByIdAndDelete(id);

    if (!station) {
      return res.status(404).send('Train Station not found');
    }

    res.json({ message: 'Train Station deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;


