import cors from 'cors';
import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import trainRoutes from './backend/routes/train.js';
import userRoutes from './backend/routes/user.js';

const app = express();
const PORT = 8080;

const server = http.createServer(app);

config();

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
).then(() => {
    console.log('Connected to the database');
}).catch((error) => {
    console.error('Error connecting to the database: ', error);
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use('/api/trains', trainRoutes);
app.use('/api/users', userRoutes);

server.listen(8080, () => {
    console.log(`Server started on port ${PORT}. API Documentation: http://localhost:${PORT}/api-docs/`);
})

export default app;
