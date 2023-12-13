const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const TrainStation = require('./models/TrainStation');





router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const trainstations = await TrainStation.find()
        res.status(200).json(trainstations)
    } catch(err) {
        res.status(500).json({ response: 'Internal server error' })
    }
})


router.get('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const trainstation = await TrainStation.findById(req.params.id)
        res.status(200).json(trainstation)
    } catch(err) {
        res.status(500).json({ response: 'Internal server error' })
    }
})








const listTrainStations = async () => {
  try {
    return await TrainStation.find().sort({ name: 1 });
  } catch (error) {
    console.error(error);
    throw new Error('Erreur interne du serveur');
  }
};

const createTrainStation = async (name, open_hour, close_hour, imageBuffer) => {
  try {
    const station = new TrainStation({
      name,
      open_hour,
      close_hour,
      image: imageBuffer
    });

    await station.save();

    return station;
  } catch (error) {
    console.error(error);
    throw new Error('Erreur interne du serveur');
  }
};

const updateTrainStation = async (id, name, open_hour, close_hour) => {
  try {
    return await TrainStation.findByIdAndUpdate(
      id,
      { name, open_hour, close_hour },
      { new: true }
    );
  } catch (error) {
    console.error(error);
    throw new Error('Erreur interne du serveur');
  }
};

const deleteTrainStation = async (id) => {
  try {
    // Considérer la suppression des trains associés ou gérer en conséquence
    return await TrainStation.findByIdAndDelete(id);
  } catch (error) {
    console.error(error);
    throw new Error('Erreur interne du serveur');
  }
};

module.exports = {
  listTrainStations,
  createTrainStation,
  updateTrainStation,
  deleteTrainStation
};
