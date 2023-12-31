import express from 'express';
import multer from 'multer';
import TrainStation from '../models/TrainStation.js';
import Train from '../models/Train.js';
import Joi from 'joi';
import sharp from 'sharp';
import { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } from '../middlewares/verifyToken.js';

const router = express.Router();

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
    },
    storage: multer.memoryStorage() // Stocke les fichiers en mémoire 
});

const trainStationSchema = Joi.object({
    name: Joi.string().required(),
    open_hour: Joi.string().required(),
    close_hour: Joi.string().required(),

});

// Get all trainstations
router.get('/', async (req, res) => {
    try {
        const trainstations = await TrainStation.find().sort({ name: 1 });
        res.status(200).json(trainstations);
    } catch (err) {
        res.status(500).json({ response: 'Internal server error' });
    }
});

// Get a single trainstation by id
router.get('/:id', (req, res) => {
    const id = req.params.id;

    TrainStation.findById(id)
        .then(data => {
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(400).json({ response: `Could not find trainstation with id ${id}` });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ response: 'Internal server error' });
        });
});

// Create a new trainstation
router.post('/', verifyTokenAndAdmin, upload.single('image'), async (req, res) => {
    const { error, value } = trainStationSchema.validate(req.body);

    if (error) {
        // If validation fails, respond with a 400 Bad Request and error details
        return res.status(400).json({ error: error.details[0].message });
    }



    if (req.file != undefined) {
        const imageBuffer = await sharp(req.file.buffer).resize(200, 200).toBuffer();
        var trainstation = new TrainStation({
            name: value.name,
            open_hour: value.open_hour,
            close_hour: value.close_hour,
            image: imageBuffer
        });
    } else {
        var trainstation = new TrainStation({
            name: value.name,
            open_hour: value.open_hour,
            close_hour: value.close_hour
        });
    }

    trainstation.save()
        .then(data => {
            res.status(200).json(data);
        }).catch(err => {
            console.log(err);
            res.status(500).json({ response: 'Internal server error' });
        });
});

// Update a trainstation by id
router.put('/:id', verifyTokenAndAdmin, upload.single('image'), async (req, res) => {
    const id = req.params.id;
    const { error, value } = trainStationSchema.validate(req.body);

    if (error) {
        // If validation fails, respond with a 400 Bad Request and error details
        return res.status(400).json({ error: error.details[0].message });
    }

    if (req.file != undefined) {
        const imageBuffer = await sharp(req.file.buffer).resize(200, 200).toBuffer();
        var updatedTrainstation = { name: value.name, open_hour: value.open_hour, close_hour: value.close_hour, image: imageBuffer };
    } else {
        var updatedTrainstation = { name: value.name, open_hour: value.open_hour, close_hour: value.close_hour };
    }

    TrainStation.findByIdAndUpdate(id, updatedTrainstation, { new: true })
        .then(data => {
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(400).json({ response: `Could not find trainstation with id ${id}` });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ response: 'Internal server error' });
        });
});

// Delete a trainstation by id
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    const id = req.params.id;

    // Check if trainstation is used by a train
    const relatedTrains = await Train.find({ $or: [{ start_station: id }, { end_station: id }] });
    if (relatedTrains.length > 0) {
        return res.status(400).json({
            message: "You can't delete this trainstation because it is used by one or more trains."
        });
    }

    TrainStation.findByIdAndDelete(id)
        .then(data => {
            if (data) {
                res.status(200).json({ response: `Trainstation with id ${id} has been deleted` });
            } else {
                res.status(400).json({ response: `Could not find trainstation with id ${id}` });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ response: 'Internal server error' });
        });
});



export default router;
