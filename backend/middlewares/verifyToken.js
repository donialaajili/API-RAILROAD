import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import TrainStation from "../models/TrainStation"; 

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) res.status(403).json('Token is not valid');
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            
            let authorized = false;
            const stationId = req.params.id;

            // Verify if the stationId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(stationId)) {
                return res.status(400).json("Invalid station ID!");
            }

            // Verify if the train station exists using your TrainStation model
            const station = await TrainStation.findById(stationId);

            if (req.user.isAdmin) {
                authorized = true;
            } else if (req.params.id) {
               
                if (station && station.ownerId.toString() === req.user.id) {
                    authorized = true;
                }
            }

            if (authorized) {
                next();
            } else {
                res.status(403).json("You are not allowed to do that!");
            }
        } catch (err) {
            res.status(500).json({ response: 'Internal server error: ' + err.message });
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    });
};

export {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
};
