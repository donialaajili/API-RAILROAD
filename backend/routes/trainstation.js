const sharp = require('sharp');
const TrainStation = require('./models/TrainStation'); // Supposons que vous ayez un modèle TrainStation

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
