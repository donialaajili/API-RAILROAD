import express from 'express';
import Train from '../models/Train.js';
import { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } from '../middlewares/verifyToken.js';
import Joi from 'joi';

const router = express.Router();

// Get all trains
router.get('/', async (req, res) => {
    const sortFields = req.query.sort ? req.query.sort.split(',') : [];
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let query = Train.find();

    if (sortFields.length > 0) {
        const sortOptions = [];

        sortFields.forEach(field => {
            let sortOrder = 1;

            if (field.startsWith('-')) {
                sortOrder = -1;
                field = field.substring(1);
            }

            if (['name', 'start_station', 'end_station', 'time_of_departure'].includes(field)) {
                sortOptions.push([field, sortOrder]);
            }
        });

        if (sortOptions.length > 0) {
            query = query.sort(sortOptions);
        }
    }

    if (limit > 0) {
        query = query.limit(limit);
    }

    try {
        const data = await query.exec();
        res.status(200).json(data);
    } catch(err) {
        console.error('Error getting trains: ', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Définissez un schéma Joi pour les données de train
const Train = Joi.object({
    name: Joi.string().required(),
    start_station: Joi.string().required(),
    end_station: Joi.string().required(),
    time_of_departure: Joi.date().iso().required(),
    // Ajoutez d'autres champs pertinents pour la validation
  });
  
  // Endpoint pour créer un nouveau train
 // router.post('/trains', async (req, res) => {
    // Validez les données du corps de la requête par rapport au schéma
  //  const { error, value } = trainSchema.validate(req.body);
  
   // if (error) {
      // Si la validation échoue, renvoyez une réponse d'erreur
  //    return handleValidationError(res, error);
  //  }
  



// Get a single train by id
router.get('/:id', (req, res) => {
    const id = req.params.id;

    Train.findById(id)
        .then(data => {
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(400).json({ response: `Could not find train with id ${id}` });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ response: 'Internal server error' });
        });
});

// Create a new train
router.post('/', verifyTokenAndAdmin, (req, res) => {
    const { name, start_station, end_station, time_of_departure } = req.body;
    const train = new Train({ name, start_station, end_station, time_of_departure });

    train.save()
        .then(data => {
            res.status(200).json(data);
        }).catch(err => {
            console.log(err);
            res.status(500).json({ response: 'Internal server error' });
        });
});

// Update a train
router.put('/:id', verifyTokenAndAdmin, (req, res) => {
    const id  = req.params.id;
    const { name, start_station, end_station, time_of_departure } = req.body;

    Train.findByIdAndUpdate(id, { name, start_station, end_station, time_of_departure }, { new: true })
        .then(data => {
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(400).json({ response: `Could not find train with id ${id}` });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ response: 'Internal server error' });
        });
});

// Delete a train by id
router.delete('/:id', verifyTokenAndAdmin, (req, res) => {
    const id  = req.params.id;

    Train.findByIdAndDelete(id)
        .then(data => {
            if (data) {
                res.status(200).json({ response: `Train with id ${id} has been deleted` });
            } else {
                res.status(400).json({ response: `Could not find train with id ${id}` });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ response: 'Internal server error' });
        });
});

export default router;
